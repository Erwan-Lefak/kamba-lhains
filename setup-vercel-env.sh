#!/bin/bash

echo "🔧 Configuration des variables d'environnement Vercel"
echo ""
echo "Exécute ces commandes pour configurer les variables sur Vercel:"
echo ""

echo "# Stripe Configuration"
echo "vercel env add STRIPE_SECRET_KEY production"
echo "vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production"
echo "vercel env add STRIPE_WEBHOOK_SECRET production"
echo ""

echo "# Google Sheets"
echo "vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_ID production"
echo "vercel env add GOOGLE_SHEETS_ORDERS_ID production"
echo "vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production"
echo "vercel env add GOOGLE_PRIVATE_KEY production"
echo ""

echo "Valeurs à utiliser:"
echo "STRIPE_SECRET_KEY: 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"
echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_live_51PxoVLGYHWAvqsEveOwpIHu5pxbQAXhqqbAJUarct6PjQfZC7vCkko9qWCTlg1z92eMKdAGWJMKx6iZj6R0SBvfx00zwLFFhfJ"
echo "STRIPE_WEBHOOK_SECRET: whsec_b9bOdPWO1JfOH1kRUV4QGESKWu1sy8kN"
echo "NEXT_PUBLIC_GOOGLE_SHEETS_ID: 1aJFCzh7-gpZZbRYMfSUO6rATWampbnfOaVJQ6wkTV4s"
echo "GOOGLE_SHEETS_ORDERS_ID: 1FPDQ0PiIdHe-y5WZhLmatJ3QLpEfzth6K7zo8GYf1dY"
echo "GOOGLE_SERVICE_ACCOUNT_EMAIL: kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com"
