#!/bin/bash

# Script de tests de charge automatisés pour Kamba Lhains
# Usage: ./scripts/load-testing.sh [k6|artillery|all] [environment]

set -e

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOAD_TESTS_DIR="$PROJECT_ROOT/tests/load"
REPORTS_DIR="$PROJECT_ROOT/reports/load-testing"

# Paramètres
TOOL=${1:-"all"}
ENVIRONMENT=${2:-"local"}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# URLs par environnement
case $ENVIRONMENT in
    "local")
        BASE_URL="http://localhost:3000"
        ;;
    "staging")
        BASE_URL="https://kamba-lhains-staging.vercel.app"
        ;;
    "production")
        BASE_URL="https://kamba-lhains.vercel.app"
        ;;
    *)
        BASE_URL=$ENVIRONMENT
        ;;
esac

echo -e "${BLUE}🚀 Kamba Lhains - Tests de charge${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "Outil: ${YELLOW}$TOOL${NC}"
echo -e "Environnement: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "URL cible: ${YELLOW}$BASE_URL${NC}"
echo -e "Timestamp: ${YELLOW}$TIMESTAMP${NC}"
echo ""

# Création du dossier de rapports
mkdir -p "$REPORTS_DIR"

# Fonction de vérification des prérequis
check_prerequisites() {
    echo -e "${BLUE}🔍 Vérification des prérequis...${NC}"
    
    if [[ "$TOOL" == "k6" || "$TOOL" == "all" ]]; then
        if ! command -v k6 &> /dev/null; then
            echo -e "${RED}❌ K6 non installé. Installation...${NC}"
            case "$OSTYPE" in
                linux*)
                    curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz --strip-components 1
                    sudo mv k6 /usr/local/bin/
                    ;;
                darwin*)
                    brew install k6
                    ;;
                *)
                    echo -e "${RED}❌ Veuillez installer K6 manuellement: https://k6.io/docs/getting-started/installation/${NC}"
                    exit 1
                    ;;
            esac
        fi
    fi
    
    if [[ "$TOOL" == "artillery" || "$TOOL" == "all" ]]; then
        if ! command -v artillery &> /dev/null; then
            echo -e "${RED}❌ Artillery non installé. Installation...${NC}"
            npm install -g artillery
        fi
    fi
    
    echo -e "${GREEN}✅ Prérequis OK${NC}"
}

# Fonction de vérification de l'application
check_application() {
    echo -e "${BLUE}🔍 Vérification de l'application...${NC}"
    
    if curl -sf "$BASE_URL" > /dev/null; then
        echo -e "${GREEN}✅ Application accessible${NC}"
    else
        echo -e "${RED}❌ Application non accessible à $BASE_URL${NC}"
        exit 1
    fi
}

# Tests K6
run_k6_tests() {
    echo -e "${BLUE}🧪 Exécution des tests K6...${NC}"
    
    local report_file="$REPORTS_DIR/k6_report_$TIMESTAMP.json"
    local html_report="$REPORTS_DIR/k6_report_$TIMESTAMP.html"
    
    BASE_URL="$BASE_URL" k6 run \
        --out json="$report_file" \
        --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" \
        "$LOAD_TESTS_DIR/k6-load-test.js"
    
    # Génération du rapport HTML
    if command -v k6-html-reporter &> /dev/null; then
        k6-html-reporter --json-file="$report_file" --output="$html_report"
        echo -e "${GREEN}📊 Rapport HTML généré: $html_report${NC}"
    fi
    
    echo -e "${GREEN}✅ Tests K6 terminés${NC}"
}

# Tests Artillery
run_artillery_tests() {
    echo -e "${BLUE}🧪 Exécution des tests Artillery...${NC}"
    
    local report_file="$REPORTS_DIR/artillery_report_$TIMESTAMP.json"
    local html_report="$REPORTS_DIR/artillery_report_$TIMESTAMP.html"
    
    # Modification de l'URL dans la config
    sed "s|target: 'http://localhost:3000'|target: '$BASE_URL'|g" \
        "$LOAD_TESTS_DIR/artillery-config.yml" > "/tmp/artillery-config-$TIMESTAMP.yml"
    
    artillery run \
        --output "$report_file" \
        "/tmp/artillery-config-$TIMESTAMP.yml"
    
    # Génération du rapport HTML
    artillery report --output "$html_report" "$report_file"
    
    # Nettoyage
    rm "/tmp/artillery-config-$TIMESTAMP.yml"
    
    echo -e "${GREEN}📊 Rapport HTML généré: $html_report${NC}"
    echo -e "${GREEN}✅ Tests Artillery terminés${NC}"
}

# Tests de pic de trafic
run_spike_tests() {
    echo -e "${BLUE}⚡ Tests de pic de trafic...${NC}"
    
    local report_file="$REPORTS_DIR/spike_test_$TIMESTAMP.json"
    
    BASE_URL="$BASE_URL" SCENARIO="spike" k6 run \
        --out json="$report_file" \
        --vus 200 \
        --duration 60s \
        "$LOAD_TESTS_DIR/k6-load-test.js"
    
    echo -e "${GREEN}✅ Tests de pic terminés${NC}"
}

# Tests de stress
run_stress_tests() {
    echo -e "${BLUE}💪 Tests de stress...${NC}"
    
    local report_file="$REPORTS_DIR/stress_test_$TIMESTAMP.json"
    
    BASE_URL="$BASE_URL" SCENARIO="stress" k6 run \
        --out json="$report_file" \
        --vus 100 \
        --duration 300s \
        "$LOAD_TESTS_DIR/k6-load-test.js"
    
    echo -e "${GREEN}✅ Tests de stress terminés${NC}"
}

# Analyse des résultats
analyze_results() {
    echo -e "${BLUE}📊 Analyse des résultats...${NC}"
    
    local latest_reports=$(ls -t "$REPORTS_DIR"/*_$TIMESTAMP.json 2>/dev/null | head -5)
    
    if [[ -n "$latest_reports" ]]; then
        echo -e "${GREEN}📈 Rapports générés:${NC}"
        for report in $latest_reports; do
            echo -e "  📄 $(basename "$report")"
        done
        
        echo -e "\n${YELLOW}📋 Résumé des métriques:${NC}"
        echo -e "📍 URL testée: $BASE_URL"
        echo -e "⏱️  Timestamp: $TIMESTAMP"
        echo -e "📂 Dossier rapports: $REPORTS_DIR"
        
        # Ouvrir le rapport HTML si disponible
        local html_report=$(ls -t "$REPORTS_DIR"/*_$TIMESTAMP.html 2>/dev/null | head -1)
        if [[ -n "$html_report" && "$OSTYPE" == "darwin" ]]; then
            echo -e "${BLUE}🌐 Ouverture du rapport dans le navigateur...${NC}"
            open "$html_report"
        fi
    else
        echo -e "${YELLOW}⚠️  Aucun rapport trouvé${NC}"
    fi
}

# Nettoyage des anciens rapports
cleanup_old_reports() {
    echo -e "${BLUE}🧹 Nettoyage des anciens rapports...${NC}"
    
    # Garder seulement les 10 derniers rapports
    if ls "$REPORTS_DIR"/* &>/dev/null; then
        ls -t "$REPORTS_DIR"/* | tail -n +21 | xargs -r rm
        echo -e "${GREEN}✅ Anciens rapports supprimés${NC}"
    fi
}

# Menu principal
main() {
    check_prerequisites
    check_application
    cleanup_old_reports
    
    case $TOOL in
        "k6")
            run_k6_tests
            ;;
        "artillery")
            run_artillery_tests
            ;;
        "spike")
            run_spike_tests
            ;;
        "stress")
            run_stress_tests
            ;;
        "all")
            run_k6_tests
            echo ""
            run_artillery_tests
            echo ""
            run_spike_tests
            ;;
        *)
            echo -e "${RED}❌ Outil non reconnu: $TOOL${NC}"
            echo -e "Usage: $0 [k6|artillery|spike|stress|all] [environment]"
            exit 1
            ;;
    esac
    
    analyze_results
    
    echo -e "\n${GREEN}🎉 Tests de charge terminés avec succès!${NC}"
}

# Gestion des signaux
trap 'echo -e "\n${YELLOW}⚠️  Tests interrompus${NC}"; exit 1' INT TERM

# Lancement du script principal
main "$@"