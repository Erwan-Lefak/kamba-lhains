#!/bin/bash

# Script de test du système Newsletter
# Usage: ./test-newsletter.sh

echo "🧪 Test du système Newsletter Kamba Lhains"
echo "=========================================="
echo ""

BASE_URL="http://localhost:3002"

# Vérifier que le serveur tourne
echo "🔍 Vérification du serveur..."
if ! curl -s "$BASE_URL" > /dev/null; then
    echo "❌ Le serveur ne semble pas tourner sur $BASE_URL"
    echo "   Lance d'abord: PORT=3002 npm run dev"
    exit 1
fi
echo "✅ Serveur actif"
echo ""

# Test 1 : Inscription simple (footer)
echo "📝 Test 1 : Inscription simple (footer)"
echo "----------------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-footer@kamba.test",
    "source": "footer"
  }')

echo "Réponse: $RESPONSE"
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Test 1 RÉUSSI"
else
    echo "❌ Test 1 ÉCHOUÉ"
fi
echo ""

# Test 2 : Inscription complète (newsletter page)
echo "📝 Test 2 : Inscription complète (page newsletter)"
echo "---------------------------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-page@kamba.test",
    "firstName": "Jean",
    "interests": ["Nouvelles collections", "Offres exclusives"],
    "frequency": "weekly",
    "source": "newsletter-page"
  }')

echo "Réponse: $RESPONSE"
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Test 2 RÉUSSI"
else
    echo "❌ Test 2 ÉCHOUÉ"
fi
echo ""

# Test 3 : Détection de doublon
echo "📝 Test 3 : Détection de doublon"
echo "---------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-footer@kamba.test",
    "source": "footer"
  }')

echo "Réponse: $RESPONSE"
if echo "$RESPONSE" | grep -q "déjà inscrit"; then
    echo "✅ Test 3 RÉUSSI (doublon détecté)"
else
    echo "❌ Test 3 ÉCHOUÉ (doublon non détecté)"
fi
echo ""

# Test 4 : Validation email invalide
echo "📝 Test 4 : Validation email invalide"
echo "--------------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email-invalide",
    "source": "footer"
  }')

echo "Réponse: $RESPONSE"
if echo "$RESPONSE" | grep -q "invalide"; then
    echo "✅ Test 4 RÉUSSI (email invalide détecté)"
else
    echo "❌ Test 4 ÉCHOUÉ"
fi
echo ""

# Test 5 : Désabonnement
echo "📝 Test 5 : Désabonnement"
echo "-------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/newsletter/unsubscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-footer@kamba.test"
  }')

echo "Réponse: $RESPONSE"
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Test 5 RÉUSSI"
else
    echo "❌ Test 5 ÉCHOUÉ"
fi
echo ""

# Résumé
echo "=========================================="
echo "🏁 Tests terminés"
echo ""
echo "⚠️  Vérifie maintenant :"
echo "1. Google Sheet Newsletter → nouvelles lignes ajoutées"
echo "2. Ta boîte mail → emails de bienvenue reçus"
echo "3. Les logs du serveur → confirmations d'envoi"
echo ""
echo "📖 Pour plus d'infos, lis NEWSLETTER_README.md"
