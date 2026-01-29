#!/bin/bash

TOKEN="qcOXVdAGvrdmDaV9PJ2Vc3VQ"
PROJECT_ID="prj_bDn9pUqpbjfoSypJLjDQ0eOc4P0u"

# Function to add env variable
add_env() {
  local key=$1
  local value=$2
  local type=${3:-encrypted}
  
  echo "Adding $key..."
  curl -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"key\": \"$key\",
      \"value\": \"$value\",
      \"type\": \"$type\",
      \"target\": [\"production\"]
    }"
  echo ""
}

# Add all environment variables
add_env "STRIPE_SECRET_KEY" "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"
add_env "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "pk_live_51PxoVLGYHWAvqsEveOwpIHu5pxbQAXhqqbAJUarct6PjQfZC7vCkko9qWCTlg1z92eMKdAGWJMKx6iZj6R0SBvfx00zwLFFhfJ" "plain"
add_env "STRIPE_WEBHOOK_SECRET" "whsec_b9bOdPWO1JfOH1kRUV4QGESKWu1sy8kN"
add_env "NEXT_PUBLIC_GOOGLE_SHEETS_ID" "1aJFCzh7-gpZZbRYMfSUO6rATWampbnfOaVJQ6wkTV4s" "plain"
add_env "GOOGLE_SHEETS_ORDERS_ID" "1FPDQ0PiIdHe-y5WZhLmatJ3QLpEfzth6K7zo8GYf1dY"
add_env "GOOGLE_SERVICE_ACCOUNT_EMAIL" "kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com"

echo "✅ All variables added!"
