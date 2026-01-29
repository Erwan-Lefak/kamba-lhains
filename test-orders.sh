#!/bin/bash

# Script de test pour le système de commandes
# Usage: ./test-orders.sh [commande]

BASE_URL="http://localhost:3002"

case "$1" in
  "create")
    echo "🛒 Création d'une commande test..."
    curl -X POST "$BASE_URL/api/orders/create" \
      -H "Content-Type: application/json" \
      -d '{
        "customerEmail": "test@example.com",
        "customerName": "Test Client",
        "phone": "+33612345678",
        "totalAmount": 380,
        "shippingCost": 0,
        "taxAmount": 0,
        "items": [{
          "productName": "BOMBERS ITOUA",
          "quantity": 1,
          "price": 380,
          "size": "M",
          "color": "Noir"
        }],
        "shippingAddress": {
          "firstName": "Test",
          "lastName": "Client",
          "address1": "123 Rue Test",
          "city": "Paris",
          "postalCode": "75001",
          "country": "France"
        }
      }' | python3 -m json.tool
    ;;

  "dashboard")
    echo "📊 Récupération du dashboard..."
    curl -s "$BASE_URL/api/admin/dashboard-sheets" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(f'💰 Revenu total: {d[\"totalRevenue\"]}€')
print(f'📦 Commandes totales: {d[\"totalOrders\"]}')
print(f'📅 Commandes aujourd\'hui: {d[\"ordersToday\"]}')
print(f'💵 Panier moyen: {d[\"averageOrderValue\"]}€')
print(f'\n📋 Commandes récentes:')
for o in d['recentOrders'][:5]:
    print(f'  • {o[\"orderNumber\"]} - {o[\"customerName\"]} - {o[\"totalAmount\"]}€ - {o[\"status\"]}')
"
    ;;

  "update")
    if [ -z "$2" ] || [ -z "$3" ]; then
      echo "Usage: ./test-orders.sh update [ORDER_NUMBER] [STATUS] [TRACKING]"
      echo "Exemple: ./test-orders.sh update KL-2025-123456 SHIPPED FR1234567890"
      exit 1
    fi

    ORDER_NUM="$2"
    STATUS="$3"
    TRACKING="${4:-}"

    echo "📝 Mise à jour de $ORDER_NUM vers $STATUS..."

    if [ -n "$TRACKING" ]; then
      curl -X POST "$BASE_URL/api/admin/update-order" \
        -H "Content-Type: application/json" \
        -d "{\"orderNumber\":\"$ORDER_NUM\",\"status\":\"$STATUS\",\"trackingNumber\":\"$TRACKING\"}" \
        | python3 -m json.tool
    else
      curl -X POST "$BASE_URL/api/admin/update-order" \
        -H "Content-Type: application/json" \
        -d "{\"orderNumber\":\"$ORDER_NUM\",\"status\":\"$STATUS\"}" \
        | python3 -m json.tool
    fi
    ;;

  "products")
    echo "📦 Récupération des produits..."
    curl -s "$BASE_URL/api/products/google-sheets" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(f'✅ {d[\"count\"]} produits récupérés')
print(f'Cache: {\"Oui\" if d.get(\"cached\") else \"Non\"}')
print(f'\n📦 Liste des produits:')
for p in d['data']:
    stock = '✅ En stock' if p['inStock'] else '❌ Rupture'
    print(f'  • {p[\"name\"]} - {p[\"price\"]}€ - {stock}')
"
    ;;

  "list")
    echo "📋 Liste des commandes depuis Google Sheet..."
    curl -s "https://docs.google.com/spreadsheets/d/1FPDQ0PiIdHe-y5WZhLmatJ3QLpEfzth6K7zo8GYf1dY/gviz/tq?tqx=out:csv" \
      | python3 -c "
import csv, sys
rows = list(csv.reader(sys.stdin))
print(f'📊 Total: {len(rows)-1} commandes\n')
for i, row in enumerate(rows[1:], 1):
    print(f'{i}. {row[0]}')
    print(f'   Client: {row[2]} ({row[1]})')
    print(f'   Montant: {row[6]}€')
    print(f'   Statut: {row[5]}')
    if row[13]:
        print(f'   Tracking: {row[13]}')
    print()
"
    ;;

  *)
    echo "🧪 Script de test - Système de commandes"
    echo ""
    echo "Usage: ./test-orders.sh [commande]"
    echo ""
    echo "Commandes disponibles:"
    echo "  create              Créer une commande test"
    echo "  dashboard           Afficher le dashboard"
    echo "  update ORDER STATUS [TRACKING]  Mettre à jour une commande"
    echo "  products            Lister les produits"
    echo "  list                Lister toutes les commandes"
    echo ""
    echo "Exemples:"
    echo "  ./test-orders.sh create"
    echo "  ./test-orders.sh dashboard"
    echo "  ./test-orders.sh update KL-2025-123456 SHIPPED FR1234567890"
    echo "  ./test-orders.sh products"
    echo "  ./test-orders.sh list"
    ;;
esac
