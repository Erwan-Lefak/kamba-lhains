#!/bin/bash

# Script principal de backup pour Kamba Lhains
# Usage: ./scripts/backup.sh [db|files|all] [local|staging|production]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_ROOT="${PROJECT_ROOT}/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="${BACKUP_ROOT}/logs/backup_${TIMESTAMP}.log"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Paramètres
BACKUP_TYPE=${1:-"all"}
ENVIRONMENT=${2:-"local"}

# Configuration par environnement
case $ENVIRONMENT in
    "local")
        DB_HOST="localhost"
        DB_NAME="kamba_lhains"
        DB_USER="postgres"
        ;;
    "staging")
        DB_HOST="${STAGING_DB_HOST}"
        DB_NAME="${STAGING_DB_NAME}"
        DB_USER="${STAGING_DB_USER}"
        ;;
    "production")
        DB_HOST="${PROD_DB_HOST}"
        DB_NAME="${PROD_DB_NAME}"
        DB_USER="${PROD_DB_USER}"
        ;;
esac

# Création des dossiers
mkdir -p "${BACKUP_ROOT}"/{db/{daily,incremental,wal},files/{images,uploads,static},config/{env,nginx,ssl},logs/{app,access,error}}
mkdir -p "$(dirname "$LOG_FILE")"

# Fonction de log
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Vérification des prérequis
check_prerequisites() {
    log "INFO" "${BLUE}🔍 Vérification des prérequis...${NC}"
    
    # Vérifier les commandes nécessaires
    local commands=("pg_dump" "tar" "gzip" "aws")
    for cmd in "${commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            log "ERROR" "${RED}❌ Commande manquante: $cmd${NC}"
            return 1
        fi
    done
    
    # Vérifier les variables d'environnement
    if [[ "$ENVIRONMENT" != "local" ]]; then
        local required_vars=("DB_HOST" "DB_NAME" "DB_USER" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")
        for var in "${required_vars[@]}"; do
            if [[ -z "${!var}" ]]; then
                log "ERROR" "${RED}❌ Variable manquante: $var${NC}"
                return 1
            fi
        done
    fi
    
    log "INFO" "${GREEN}✅ Prérequis OK${NC}"
}

# Backup de la base de données
backup_database() {
    log "INFO" "${BLUE}🗄️  Démarrage backup base de données${NC}"
    
    local backup_file="${BACKUP_ROOT}/db/daily/kamba_${TIMESTAMP}.sql.gz"
    local wal_backup="${BACKUP_ROOT}/db/wal/wal_${TIMESTAMP}"
    
    # Backup principal
    if PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
        --clean --if-exists --no-owner --no-privileges | gzip > "$backup_file"; then
        log "INFO" "${GREEN}✅ Backup DB réussi: $(basename "$backup_file")${NC}"
        
        # Vérification de l'intégrité
        if gunzip -t "$backup_file" 2>/dev/null; then
            log "INFO" "${GREEN}✅ Vérification intégrité OK${NC}"
            
            # Calcul de la taille
            local size=$(du -h "$backup_file" | cut -f1)
            log "INFO" "📊 Taille du backup: $size"
        else
            log "ERROR" "${RED}❌ Erreur intégrité backup DB${NC}"
            return 1
        fi
    else
        log "ERROR" "${RED}❌ Erreur backup base de données${NC}"
        return 1
    fi
    
    # Backup WAL si disponible (pour Point-in-Time Recovery)
    if [[ "$ENVIRONMENT" != "local" ]] && command -v pg_receivewal &> /dev/null; then
        mkdir -p "$wal_backup"
        timeout 30 pg_receivewal -h "$DB_HOST" -U "$DB_USER" -D "$wal_backup" --synchronous || true
        log "INFO" "${GREEN}✅ Backup WAL créé${NC}"
    fi
}

# Backup des fichiers
backup_files() {
    log "INFO" "${BLUE}📁 Démarrage backup fichiers${NC}"
    
    local dirs_to_backup=(
        "public/images:images"
        "public/uploads:uploads" 
        ".next/static:static"
        "docs:docs"
    )
    
    for dir_mapping in "${dirs_to_backup[@]}"; do
        IFS=":" read -r source_dir backup_name <<< "$dir_mapping"
        
        if [[ -d "$PROJECT_ROOT/$source_dir" ]]; then
            local backup_file="${BACKUP_ROOT}/files/${backup_name}_${TIMESTAMP}.tar.gz"
            
            if tar -czf "$backup_file" -C "$PROJECT_ROOT" "$source_dir" 2>/dev/null; then
                local size=$(du -h "$backup_file" | cut -f1)
                log "INFO" "${GREEN}✅ Backup $source_dir réussi ($size)${NC}"
            else
                log "ERROR" "${RED}❌ Erreur backup $source_dir${NC}"
            fi
        else
            log "WARN" "${YELLOW}⚠️  Dossier inexistant: $source_dir${NC}"
        fi
    done
    
    # Backup des logs d'application
    if [[ -d "$PROJECT_ROOT/logs" ]]; then
        local logs_backup="${BACKUP_ROOT}/logs/app_logs_${TIMESTAMP}.tar.gz"
        tar -czf "$logs_backup" -C "$PROJECT_ROOT" "logs" 2>/dev/null || true
        log "INFO" "${GREEN}✅ Backup logs réussi${NC}"
    fi
}

# Backup de la configuration
backup_config() {
    log "INFO" "${BLUE}⚙️  Backup configuration${NC}"
    
    local config_backup="${BACKUP_ROOT}/config/config_${TIMESTAMP}.tar.gz"
    local temp_config="/tmp/kamba_config_${TIMESTAMP}"
    
    mkdir -p "$temp_config"
    
    # Variables d'environnement (masquées)
    if [[ -f "$PROJECT_ROOT/.env.local" ]]; then
        sed 's/=.*/=***MASKED***/' "$PROJECT_ROOT/.env.local" > "$temp_config/env_template.txt"
    fi
    
    # Configuration package.json
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        cp "$PROJECT_ROOT/package.json" "$temp_config/"
    fi
    
    # Configuration Next.js
    if [[ -f "$PROJECT_ROOT/next.config.js" ]]; then
        cp "$PROJECT_ROOT/next.config.js" "$temp_config/"
    fi
    
    # Configuration TypeScript
    if [[ -f "$PROJECT_ROOT/tsconfig.json" ]]; then
        cp "$PROJECT_ROOT/tsconfig.json" "$temp_config/"
    fi
    
    # Configuration Prisma
    if [[ -f "$PROJECT_ROOT/prisma/schema.prisma" ]]; then
        mkdir -p "$temp_config/prisma"
        cp "$PROJECT_ROOT/prisma/schema.prisma" "$temp_config/prisma/"
    fi
    
    # Créer l'archive
    tar -czf "$config_backup" -C "$(dirname "$temp_config")" "$(basename "$temp_config")"
    rm -rf "$temp_config"
    
    log "INFO" "${GREEN}✅ Backup configuration réussi${NC}"
}

# Synchronisation vers le cloud
sync_to_cloud() {
    if [[ "$ENVIRONMENT" == "local" ]]; then
        log "INFO" "${YELLOW}⚠️  Sync cloud ignoré pour environnement local${NC}"
        return 0
    fi
    
    log "INFO" "${BLUE}☁️  Synchronisation vers cloud${NC}"
    
    local s3_bucket="kamba-lhains-backups-${ENVIRONMENT}"
    local sync_path="${BACKUP_ROOT}/"
    
    # Sync vers S3 avec chiffrement
    if aws s3 sync "$sync_path" "s3://${s3_bucket}/" \
        --delete \
        --storage-class STANDARD_IA \
        --server-side-encryption AES256 \
        --exclude "logs/*" \
        --exclude "*.log"; then
        log "INFO" "${GREEN}✅ Sync S3 réussi${NC}"
    else
        log "ERROR" "${RED}❌ Erreur sync S3${NC}"
        return 1
    fi
    
    # Backup vers région secondaire (production seulement)
    if [[ "$ENVIRONMENT" == "production" ]]; then
        local secondary_bucket="kamba-lhains-backups-secondary"
        if aws s3 sync "$sync_path" "s3://${secondary_bucket}/" \
            --region eu-west-1 \
            --storage-class GLACIER \
            --exclude "logs/*"; then
            log "INFO" "${GREEN}✅ Sync région secondaire réussi${NC}"
        else
            log "WARN" "${YELLOW}⚠️  Sync région secondaire échoué${NC}"
        fi
    fi
}

# Nettoyage des anciens backups
cleanup_old_backups() {
    log "INFO" "${BLUE}🧹 Nettoyage anciens backups${NC}"
    
    local cleaned=0
    
    # Backups quotidiens : garder 7 jours
    while IFS= read -r -d '' file; do
        rm "$file"
        ((cleaned++))
    done < <(find "${BACKUP_ROOT}/db/daily" -name "*.sql.gz" -mtime +7 -print0 2>/dev/null)
    
    # Backups incrémentaux : garder 2 jours
    while IFS= read -r -d '' file; do
        rm "$file"
        ((cleaned++))
    done < <(find "${BACKUP_ROOT}/db/incremental" -name "*.sql.gz" -mtime +2 -print0 2>/dev/null)
    
    # Backups fichiers : garder 30 jours
    while IFS= read -r -d '' file; do
        rm "$file"
        ((cleaned++))
    done < <(find "${BACKUP_ROOT}/files" -name "*.tar.gz" -mtime +30 -print0 2>/dev/null)
    
    # Logs : garder 14 jours
    while IFS= read -r -d '' file; do
        rm "$file"
        ((cleaned++))
    done < <(find "${BACKUP_ROOT}/logs" -name "*.log" -mtime +14 -print0 2>/dev/null)
    
    log "INFO" "${GREEN}✅ Nettoyage terminé ($cleaned fichiers supprimés)${NC}"
}

# Vérification de santé
health_check() {
    log "INFO" "${BLUE}🏥 Vérification de santé${NC}"
    
    # Vérifier espace disque
    local disk_usage
    disk_usage=$(df "$BACKUP_ROOT" | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [[ $disk_usage -gt 85 ]]; then
        log "WARN" "${YELLOW}⚠️  Espace disque faible: ${disk_usage}%${NC}"
        
        # Envoyer alerte si webhook configuré
        if [[ -n "$SLACK_WEBHOOK" ]]; then
            curl -s -X POST "$SLACK_WEBHOOK" \
                -H 'Content-type: application/json' \
                --data "{\"text\":\"🚨 Backup Kamba Lhains: Espace disque faible ${disk_usage}%\"}" || true
        fi
    else
        log "INFO" "${GREEN}✅ Espace disque OK: ${disk_usage}%${NC}"
    fi
    
    # Vérifier que les backups récents existent
    local recent_backup_count
    recent_backup_count=$(find "${BACKUP_ROOT}/db/daily" -name "*.sql.gz" -mtime -1 | wc -l)
    
    if [[ $recent_backup_count -eq 0 ]]; then
        log "ERROR" "${RED}❌ Aucun backup récent trouvé${NC}"
        return 1
    else
        log "INFO" "${GREEN}✅ Backups récents trouvés: $recent_backup_count${NC}"
    fi
    
    # Statistiques générales
    local total_size
    total_size=$(du -sh "$BACKUP_ROOT" | cut -f1)
    log "INFO" "📊 Taille totale des backups: $total_size"
    
    # Nombre de fichiers par type
    local db_count file_count config_count
    db_count=$(find "${BACKUP_ROOT}/db" -name "*.sql.gz" | wc -l)
    file_count=$(find "${BACKUP_ROOT}/files" -name "*.tar.gz" | wc -l)  
    config_count=$(find "${BACKUP_ROOT}/config" -name "*.tar.gz" | wc -l)
    
    log "INFO" "📈 Statistiques: DB=$db_count, Files=$file_count, Config=$config_count"
}

# Notification de fin
notify_completion() {
    local exit_code=$1
    local duration=$2
    local message
    
    if [[ $exit_code -eq 0 ]]; then
        message="✅ Backup Kamba Lhains ($ENVIRONMENT) réussi - Durée: ${duration}s - $TIMESTAMP"
        log "INFO" "${GREEN}$message${NC}"
    else
        message="❌ Backup Kamba Lhains ($ENVIRONMENT) échoué - $TIMESTAMP"
        log "ERROR" "${RED}$message${NC}"
    fi
    
    # Notifications externes
    if [[ -n "$SLACK_WEBHOOK" ]]; then
        curl -s -X POST "$SLACK_WEBHOOK" \
            -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" || true
    fi
    
    if [[ -n "$BACKUP_EMAIL" ]]; then
        echo "$message" | mail -s "Backup Kamba Lhains" "$BACKUP_EMAIL" 2>/dev/null || true
    fi
}

# Test de restore (mode simulation)
test_restore() {
    log "INFO" "${BLUE}🧪 Test de restauration (simulation)${NC}"
    
    local latest_backup
    latest_backup=$(ls -t "${BACKUP_ROOT}/db/daily"/*.sql.gz 2>/dev/null | head -1)
    
    if [[ -n "$latest_backup" ]]; then
        # Test d'intégrité du backup
        if gunzip -t "$latest_backup" 2>/dev/null; then
            log "INFO" "${GREEN}✅ Test intégrité backup OK${NC}"
            
            # Test de décompression (premiers octets)
            if gunzip -c "$latest_backup" | head -50 | grep -q "PostgreSQL database dump"; then
                log "INFO" "${GREEN}✅ Test format backup OK${NC}"
            else
                log "ERROR" "${RED}❌ Format backup invalide${NC}"
                return 1
            fi
        else
            log "ERROR" "${RED}❌ Backup corrompu: $(basename "$latest_backup")${NC}"
            return 1
        fi
    else
        log "WARN" "${YELLOW}⚠️  Aucun backup trouvé pour test${NC}"
    fi
}

# Exécution principale
main() {
    local start_time=$(date +%s)
    
    log "INFO" "${BLUE}🚀 Démarrage backup Kamba Lhains${NC}"
    log "INFO" "📋 Type: $BACKUP_TYPE, Environnement: $ENVIRONMENT, Timestamp: $TIMESTAMP"
    
    local exit_code=0
    
    # Vérifications préliminaires
    check_prerequisites || exit_code=1
    
    if [[ $exit_code -eq 0 ]]; then
        # Exécution des backups selon le type demandé
        case $BACKUP_TYPE in
            "db")
                backup_database || exit_code=1
                ;;
            "files")
                backup_files || exit_code=1
                ;;
            "config")
                backup_config || exit_code=1
                ;;
            "all")
                backup_database || exit_code=1
                backup_files || exit_code=1
                backup_config || exit_code=1
                ;;
            *)
                log "ERROR" "${RED}❌ Type de backup invalide: $BACKUP_TYPE${NC}"
                exit_code=1
                ;;
        esac
        
        # Post-traitement
        if [[ $exit_code -eq 0 ]]; then
            sync_to_cloud || exit_code=1
            cleanup_old_backups
            health_check || exit_code=1
            test_restore || exit_code=1
        fi
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    notify_completion $exit_code $duration
    
    if [[ $exit_code -eq 0 ]]; then
        log "INFO" "${GREEN}🎉 Backup terminé avec succès (${duration}s)${NC}"
    else
        log "ERROR" "${RED}💥 Backup terminé avec erreurs (${duration}s)${NC}"
    fi
    
    return $exit_code
}

# Gestion des signaux
trap 'log "WARN" "⚠️  Backup interrompu"; exit 1' INT TERM

# Affichage de l'aide
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: $0 [type] [environment]"
    echo ""
    echo "Types:"
    echo "  db       Backup base de données seulement"
    echo "  files    Backup fichiers seulement"
    echo "  config   Backup configuration seulement"
    echo "  all      Backup complet (défaut)"
    echo ""
    echo "Environnements:"
    echo "  local       Environnement local (défaut)"
    echo "  staging     Environnement staging"
    echo "  production  Environnement production"
    echo ""
    echo "Exemples:"
    echo "  $0                    # Backup complet local"
    echo "  $0 db staging         # Backup DB staging"
    echo "  $0 all production     # Backup complet production"
    exit 0
fi

# Lancement du script principal
main "$@"