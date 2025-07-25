# 🛡️ Stratégie de Backup - Kamba Lhains

## Vue d'ensemble

Cette documentation décrit la stratégie complète de sauvegarde et récupération pour l'application e-commerce Kamba Lhains, couvrant tous les aspects critiques : base de données, fichiers, configuration et code.

## 🎯 Objectifs de sauvegarde

### RTO (Recovery Time Objective)
- **Critique** : < 1 heure (base de données, commandes)
- **Important** : < 4 heures (fichiers utilisateur, images)
- **Normal** : < 24 heures (logs, analytics)

### RPO (Recovery Point Objective)
- **Transactions e-commerce** : < 5 minutes
- **Données utilisateur** : < 1 heure
- **Contenu statique** : < 24 heures

## 📊 Classification des données

### 🔴 **Niveau Critique**
- **Base de données PostgreSQL** (commandes, utilisateurs, paiements)
- **Variables d'environnement** et secrets
- **Configuration Stripe** et clés API

### 🟡 **Niveau Important**
- **Images produits** et assets utilisateur
- **Logs d'application** et métriques
- **Configuration serveur** et middleware

### 🟢 **Niveau Standard**
- **Code source** (déjà versioned sur Git)
- **Logs système** anciens (> 30 jours)
- **Cache temporaire** et sessions

## 🗄️ Stratégie par composant

### 1. Base de données PostgreSQL

#### **Sauvegardes automatiques**
```bash
# Sauvegarde quotidienne complète (3h du matin)
0 3 * * * pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > /backups/db/daily/kamba_$(date +\%Y\%m\%d).sql.gz

# Sauvegarde incrémentale toutes les 4h
0 */4 * * * pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME --serializable-deferrable | gzip > /backups/db/incremental/kamba_$(date +\%Y\%m\%d_\%H).sql.gz
```

#### **Réplication**
- **Master-Slave** : Réplication automatique sur serveur secondaire
- **Point-in-Time Recovery** : WAL archiving activé
- **Geo-replication** : Backup dans région différente

#### **Monitoring**
```sql
-- Vérification de la réplication
SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn 
FROM pg_stat_replication;

-- Vérification de l'espace disque
SELECT datname, pg_size_pretty(pg_database_size(datname)) 
FROM pg_database 
WHERE datistemplate = false;
```

### 2. Fichiers et Assets

#### **Structure de backup**
```
/backups/
├── db/
│   ├── daily/          # Sauvegardes complètes quotidiennes
│   ├── incremental/    # Sauvegardes incrémentales
│   └── wal/           # WAL files pour PITR
├── files/
│   ├── images/        # Images produits et utilisateur
│   ├── uploads/       # Fichiers uploadés
│   └── static/        # Assets statiques
├── config/
│   ├── env/           # Variables d'environnement
│   ├── nginx/         # Configuration serveur
│   └── ssl/           # Certificats SSL
└── logs/
    ├── app/           # Logs application
    ├── access/        # Logs d'accès
    └── error/         # Logs d'erreur
```

#### **Synchronisation cloud**
```bash
# Sync vers AWS S3 (quotidien)
aws s3 sync /backups/ s3://kamba-lhains-backups/ --delete --storage-class STANDARD_IA

# Sync vers Google Cloud Storage (hebdomadaire)
gsutil -m rsync -r -d /backups/ gs://kamba-lhains-backups-secondary/
```

### 3. Configuration et Secrets

#### **Vault de secrets**
- **HashiCorp Vault** ou **AWS Secrets Manager**
- **Rotation automatique** des clés API
- **Audit trail** complet des accès

#### **Sauvegarde des configurations**
```bash
# Export des variables d'environnement (masquées)
env | grep -E "^(DB_|STRIPE_|NEXTAUTH_)" | sed 's/=.*/=***/' > /backups/config/env_template.txt

# Backup configuration Vercel
vercel env ls --format json > /backups/config/vercel_env.json
```

## 🤖 Scripts d'automatisation

### Script principal de backup

```bash
#!/bin/bash
# /scripts/backup.sh

set -e

BACKUP_ROOT="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="/var/log/backup_$TIMESTAMP.log"

# Configuration
DB_HOST=$DATABASE_HOST
DB_NAME=$DATABASE_NAME
DB_USER=$DATABASE_USER
S3_BUCKET="kamba-lhains-backups"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Backup base de données
backup_database() {
    log "🗄️  Démarrage backup base de données"
    
    local backup_file="$BACKUP_ROOT/db/daily/kamba_$TIMESTAMP.sql.gz"
    mkdir -p "$(dirname "$backup_file")"
    
    if pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" --clean --if-exists | gzip > "$backup_file"; then
        log "✅ Backup DB réussi: $(basename "$backup_file")"
        
        # Vérification de l'intégrité
        if gunzip -t "$backup_file"; then
            log "✅ Vérification intégrité OK"
        else
            log "❌ Erreur intégrité backup DB"
            return 1
        fi
    else
        log "❌ Erreur backup base de données"
        return 1
    fi
}

# Backup fichiers
backup_files() {
    log "📁 Démarrage backup fichiers"
    
    local dirs=("public/images" "uploads" ".next/static")
    
    for dir in "${dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            local backup_file="$BACKUP_ROOT/files/${dir//\//_}_$TIMESTAMP.tar.gz"
            mkdir -p "$(dirname "$backup_file")"
            
            if tar -czf "$backup_file" "$dir"; then
                log "✅ Backup $dir réussi"
            else
                log "❌ Erreur backup $dir"
            fi
        fi
    done
}

# Sync vers cloud
sync_to_cloud() {
    log "☁️  Synchronisation vers cloud"
    
    if aws s3 sync "$BACKUP_ROOT/" "s3://$S3_BUCKET/" --delete --storage-class STANDARD_IA; then
        log "✅ Sync S3 réussi"
    else
        log "❌ Erreur sync S3"
        return 1
    fi
}

# Nettoyage des anciens backups
cleanup_old_backups() {
    log "🧹 Nettoyage anciens backups"
    
    # Garder 7 jours de backups quotidiens
    find "$BACKUP_ROOT/db/daily" -name "*.sql.gz" -mtime +7 -delete
    
    # Garder 2 jours de backups incrémentaux
    find "$BACKUP_ROOT/db/incremental" -name "*.sql.gz" -mtime +2 -delete
    
    # Garder 30 jours de backups fichiers
    find "$BACKUP_ROOT/files" -name "*.tar.gz" -mtime +30 -delete
    
    log "✅ Nettoyage terminé"
}

# Vérification de santé
health_check() {
    log "🏥 Vérification de santé"
    
    # Vérifier espace disque
    local disk_usage=$(df /backups | tail -1 | awk '{print $5}' | sed 's/%//')
    if [[ $disk_usage -gt 85 ]]; then
        log "⚠️  Espace disque faible: $disk_usage%"
        # Envoyer alerte
        curl -X POST "$SLACK_WEBHOOK" -H 'Content-type: application/json' \
            --data '{"text":"🚨 Backup: Espace disque faible '$disk_usage'%"}'
    fi
    
    # Vérifier que les backups récents existent
    local recent_backup=$(find "$BACKUP_ROOT/db/daily" -name "*.sql.gz" -mtime -1 | wc -l)
    if [[ $recent_backup -eq 0 ]]; then
        log "❌ Aucun backup récent trouvé"
        return 1
    fi
    
    log "✅ Vérification de santé OK"
}

# Notification
notify_completion() {
    local status=$1
    local message
    
    if [[ $status -eq 0 ]]; then
        message="✅ Backup Kamba Lhains réussi - $TIMESTAMP"
    else
        message="❌ Backup Kamba Lhains échoué - $TIMESTAMP"
    fi
    
    # Slack notification
    if [[ -n "$SLACK_WEBHOOK" ]]; then
        curl -X POST "$SLACK_WEBHOOK" -H 'Content-type: application/json' \
            --data '{"text":"'"$message"'"}'
    fi
    
    # Email notification
    if [[ -n "$BACKUP_EMAIL" ]]; then
        echo "$message" | mail -s "Backup Kamba Lhains" "$BACKUP_EMAIL"
    fi
}

# Main execution
main() {
    log "🚀 Démarrage backup Kamba Lhains - $TIMESTAMP"
    
    local exit_code=0
    
    backup_database || exit_code=1
    backup_files || exit_code=1
    sync_to_cloud || exit_code=1
    cleanup_old_backups
    health_check || exit_code=1
    
    notify_completion $exit_code
    
    if [[ $exit_code -eq 0 ]]; then
        log "🎉 Backup terminé avec succès"
    else
        log "💥 Backup terminé avec erreurs"
    fi
    
    return $exit_code
}

# Gestion des signaux
trap 'log "⚠️  Backup interrompu"; exit 1' INT TERM

# Lancement
main "$@"
```

### Script de restauration

```bash
#!/bin/bash
# /scripts/restore.sh

set -e

usage() {
    echo "Usage: $0 [options] <backup_date>"
    echo "Options:"
    echo "  -t, --type     Type de restore (db|files|all) [default: all]"
    echo "  -e, --env      Environnement (staging|production) [default: staging]"
    echo "  -f, --force    Force restore without confirmation"
    echo "  -h, --help     Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 20241225_030000                    # Restore complète"
    echo "  $0 -t db -e staging 20241225_030000   # Restore DB seulement"
    echo "  $0 -f latest                          # Restore dernière sauvegarde"
}

restore_database() {
    local backup_file=$1
    local target_env=$2
    
    echo "🗄️  Restauration base de données: $backup_file"
    
    if [[ "$target_env" == "production" ]]; then
        read -p "⚠️  ATTENTION: Restore en PRODUCTION. Confirmer (yes/no): " confirm
        [[ "$confirm" != "yes" ]] && { echo "Annulé"; exit 1; }
    fi
    
    # Création d'un backup de sécurité avant restore
    local safety_backup="/tmp/safety_backup_$(date +%s).sql.gz"
    echo "📦 Création backup de sécurité..."
    pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" | gzip > "$safety_backup"
    
    # Restore
    echo "🔄 Restauration en cours..."
    gunzip -c "$backup_file" | psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"
    
    echo "✅ Restauration terminée"
    echo "💾 Backup de sécurité: $safety_backup"
}

# ... [suite du script de restore]
```

## 📋 Procédures d'urgence

### 1. Perte complète de base de données

```bash
# 1. Identifier la dernière sauvegarde valide
ls -la /backups/db/daily/ | tail -5

# 2. Restaurer depuis S3 si nécessaire
aws s3 cp s3://kamba-lhains-backups/db/daily/kamba_20241225_030000.sql.gz /tmp/

# 3. Créer nouvelle base si nécessaire
createdb -h $DB_HOST -U $DB_USER kamba_lhains_new

# 4. Restaurer
gunzip -c /tmp/kamba_20241225_030000.sql.gz | psql -h $DB_HOST -U $DB_USER -d kamba_lhains_new

# 5. Vérifier l'intégrité
psql -h $DB_HOST -U $DB_USER -d kamba_lhains_new -c "SELECT COUNT(*) FROM users;"
```

### 2. Corruption partielle

```sql
-- Vérification de l'intégrité
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public';

-- Reconstruction des index si nécessaire
REINDEX DATABASE kamba_lhains;

-- Analyse des statistiques
ANALYZE;
```

## 📊 Monitoring et alertes

### Métriques à surveiller

```bash
# Espace disque backups
df -h /backups | awk 'NR==2{print $5}' | sed 's/%//'

# Âge du dernier backup
find /backups/db/daily -name "*.sql.gz" -printf '%T@ %p\n' | sort -n | tail -1

# Taille des backups
du -sh /backups/db/daily/* | tail -7
```

### Dashboard Grafana

```yaml
# prometheus.yml
- job_name: 'backup-monitoring'
  static_configs:
    - targets: ['backup-server:9100']
  metrics_path: /metrics/backup
  scrape_interval: 300s
```

## 🔒 Sécurité et conformité

### Chiffrement
- **En transit** : TLS 1.3 pour tous les transferts
- **Au repos** : AES-256 pour stockage S3/GCS
- **Clés** : Rotation automatique tous les 90 jours

### Accès et audit
- **RBAC** : Accès basé sur les rôles
- **Audit logs** : Tous les accès tracés
- **2FA** : Obligatoire pour accès production

### Conformité RGPD
- **Anonymisation** : Scripts d'anonymisation des données sensibles
- **Rétention** : 7 ans pour données fiscales, 3 ans pour données utilisateur
- **Droit à l'oubli** : Procédure de suppression définitive

## 📅 Planning de maintenance

### Quotidien (3h00)
- Backup complet base de données
- Sync incrémental fichiers
- Vérification intégrité

### Hebdomadaire (Dimanche 2h00)
- Backup complet fichiers
- Test de restore sur staging
- Nettoyage anciens backups

### Mensuel (1er du mois)
- Test de restore complet
- Audit des accès
- Mise à jour documentation

### Trimestriel
- Test de disaster recovery complet
- Review des RTO/RPO
- Formation équipe

## 🧪 Tests de récupération

### Test mensuel automatisé

```bash
#!/bin/bash
# test-recovery.sh

STAGING_DB="kamba_staging_test"
LATEST_BACKUP=$(ls -t /backups/db/daily/*.sql.gz | head -1)

echo "🧪 Test de récupération - $(date)"

# 1. Créer DB de test
dropdb --if-exists $STAGING_DB
createdb $STAGING_DB

# 2. Restaurer depuis backup
gunzip -c "$LATEST_BACKUP" | psql -d $STAGING_DB

# 3. Tests de validation
psql -d $STAGING_DB -c "
    SELECT 
        'users' as table_name, 
        count(*) as row_count 
    FROM users
    UNION ALL
    SELECT 'orders', count(*) FROM orders
    UNION ALL  
    SELECT 'products', count(*) FROM products;
"

# 4. Test application
cd /app && DATABASE_URL="postgresql://localhost/$STAGING_DB" npm run test:integration

echo "✅ Test de récupération terminé"
```

## 📞 Contacts d'urgence

### Plan d'escalade
1. **DevOps Engineer** : +33 6 XX XX XX XX
2. **Lead Developer** : +33 6 XX XX XX XX  
3. **CTO** : +33 6 XX XX XX XX
4. **Support AWS** : Enterprise Support Case

### Canaux de communication
- **Slack** : #incidents-backup
- **Email** : backup-alerts@kamba-lhains.com
- **PagerDuty** : Integration configurée

---

**📋 Ce document doit être mis à jour trimestriellement et après tout incident de production.**

*Dernière mise à jour : 2024-12-25*  
*Version : 1.0*  
*Responsable : DevOps Team*