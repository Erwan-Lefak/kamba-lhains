#!/bin/bash

set -e

echo "🔐 Configuration des secrets Google Cloud Secret Manager..."
echo ""

# Source .env.local
if [ ! -f .env.local ]; then
    echo "❌ Fichier .env.local introuvable!"
    exit 1
fi

export $(cat .env.local | grep -v '^#' | xargs)

# Fonction pour créer ou mettre à jour un secret
create_or_update_secret() {
    local secret_name=$1
    local secret_value=$2

    echo "📝 Traitement du secret: $secret_name"

    # Vérifier si le secret existe
    if gcloud secrets describe "$secret_name" &>/dev/null; then
        echo "  ↪ Secret existant, ajout d'une nouvelle version..."
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=-
    else
        echo "  ↪ Création du secret..."
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=-
    fi

    echo "  ✅ $secret_name configuré"
}

# Créer les secrets
create_or_update_secret "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
create_or_update_secret "DATABASE_URL" "$DATABASE_URL"
create_or_update_secret "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
create_or_update_secret "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
create_or_update_secret "JWT_SECRET" "$JWT_SECRET"
create_or_update_secret "ADMIN_PASSWORD" "$ADMIN_PASSWORD"

echo ""
echo "✅ Tous les secrets ont été créés avec succès!"
echo ""
echo "📋 Variables publiques (à définir lors du déploiement):"
echo "   - NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   - ADMIN_EMAIL=$ADMIN_EMAIL"
echo ""
echo "🎉 Configuration terminée!"
