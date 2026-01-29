#!/usr/bin/env node

/**
 * Script de configuration DNS OVH pour Vercel
 *
 * Ce script configure automatiquement les enregistrements DNS nécessaires
 * pour pointer votre domaine OVH vers Vercel.
 *
 * Prérequis:
 * 1. Créer une application OVH API: https://eu.api.ovh.com/createApp/
 * 2. Installer les dépendances: npm install ovh readline-sync
 * 3. Avoir ajouté le domaine dans Vercel et récupéré les valeurs DNS
 */

const ovh = require('ovh');
const readline = require('readline-sync');

// Configuration - À REMPLIR
const CONFIG = {
  domain: 'kamba-lhains.com',
  ovhCredentials: {
    endpoint: 'ovh-eu', // 'ovh-eu', 'ovh-ca', 'ovh-us'
    appKey: process.env.OVH_APP_KEY || '',
    appSecret: process.env.OVH_APP_SECRET || '',
    consumerKey: process.env.OVH_CONSUMER_KEY || ''
  },
  // Enregistrements DNS pour Vercel
  dnsRecords: {
    // Pour le domaine principal (apex domain) - A record
    apex: {
      type: 'A',
      target: '76.76.21.21' // IP Vercel (vérifier dans les settings Vercel)
    },
    // Pour www - CNAME record
    www: {
      type: 'CNAME',
      target: 'cname.vercel-dns.com.'
    },
    // CAA record pour Let's Encrypt (SSL)
    caa: {
      type: 'CAA',
      target: '0 issue "letsencrypt.org"'
    }
  }
};

// Initialiser le client OVH
let ovhClient;

/**
 * Initialise le client OVH avec authentification
 */
async function initializeOVH() {
  console.log('\n🔧 Configuration de l\'API OVH\n');

  // Si les credentials ne sont pas dans les variables d'environnement
  if (!CONFIG.ovhCredentials.appKey || !CONFIG.ovhCredentials.appSecret) {
    console.log('⚠️  Credentials OVH manquants !');
    console.log('\nPour obtenir vos credentials:');
    console.log('1. Allez sur: https://eu.api.ovh.com/createApp/');
    console.log('2. Créez une application');
    console.log('3. Notez votre Application Key et Application Secret\n');

    CONFIG.ovhCredentials.appKey = readline.question('Application Key: ');
    CONFIG.ovhCredentials.appSecret = readline.question('Application Secret: ', {
      hideEchoBack: true
    });
  }

  // Créer le client OVH
  ovhClient = ovh({
    endpoint: CONFIG.ovhCredentials.endpoint,
    appKey: CONFIG.ovhCredentials.appKey,
    appSecret: CONFIG.ovhCredentials.appSecret,
    consumerKey: CONFIG.ovhCredentials.consumerKey
  });

  // Si pas de consumer key, générer une nouvelle
  if (!CONFIG.ovhCredentials.consumerKey) {
    console.log('\n🔑 Génération de la Consumer Key...\n');

    try {
      const { validationUrl, consumerKey } = await ovhClient.request('POST', '/auth/credential', {
        accessRules: [
          { method: 'GET', path: '/domain/zone/' + CONFIG.domain + '/*' },
          { method: 'POST', path: '/domain/zone/' + CONFIG.domain + '/*' },
          { method: 'DELETE', path: '/domain/zone/' + CONFIG.domain + '/*' },
          { method: 'PUT', path: '/domain/zone/' + CONFIG.domain + '/*' }
        ]
      });

      console.log('✅ Consumer Key générée:', consumerKey);
      console.log('\n⚠️  IMPORTANT: Validez cette clé en visitant:');
      console.log(validationUrl);
      console.log('\nAprès validation, ajoutez ces variables d\'environnement:');
      console.log(`export OVH_APP_KEY="${CONFIG.ovhCredentials.appKey}"`);
      console.log(`export OVH_APP_SECRET="${CONFIG.ovhCredentials.appSecret}"`);
      console.log(`export OVH_CONSUMER_KEY="${consumerKey}"`);

      readline.question('\nAppuyez sur Entrée après avoir validé...');

      CONFIG.ovhCredentials.consumerKey = consumerKey;

      // Recréer le client avec la consumer key
      ovhClient = ovh({
        endpoint: CONFIG.ovhCredentials.endpoint,
        appKey: CONFIG.ovhCredentials.appKey,
        appSecret: CONFIG.ovhCredentials.appSecret,
        consumerKey: CONFIG.ovhCredentials.consumerKey
      });
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la Consumer Key:', error.message);
      process.exit(1);
    }
  }

  console.log('✅ Client OVH initialisé\n');
}

/**
 * Liste les enregistrements DNS existants
 */
async function listDNSRecords() {
  console.log('📋 Enregistrements DNS actuels:\n');

  try {
    const recordIds = await ovhClient.request('GET', `/domain/zone/${CONFIG.domain}/record`);

    for (const id of recordIds.slice(0, 10)) { // Afficher les 10 premiers
      const record = await ovhClient.request('GET', `/domain/zone/${CONFIG.domain}/record/${id}`);
      console.log(`  ${record.subDomain || '@'} - ${record.fieldType} - ${record.target}`);
    }

    console.log(`\n  ... (${recordIds.length} enregistrements au total)\n`);
  } catch (error) {
    console.error('❌ Erreur lors de la liste des enregistrements:', error.message);
  }
}

/**
 * Supprime un enregistrement DNS existant
 */
async function deleteDNSRecord(subDomain, fieldType) {
  try {
    // Trouver l'ID de l'enregistrement
    const recordIds = await ovhClient.request('GET', `/domain/zone/${CONFIG.domain}/record`, {
      subDomain: subDomain || '',
      fieldType
    });

    if (recordIds.length > 0) {
      for (const id of recordIds) {
        await ovhClient.request('DELETE', `/domain/zone/${CONFIG.domain}/record/${id}`);
        console.log(`  ✅ Supprimé: ${subDomain || '@'} ${fieldType}`);
      }
    }
  } catch (error) {
    console.log(`  ⚠️  Impossible de supprimer ${subDomain || '@'} ${fieldType}: ${error.message}`);
  }
}

/**
 * Ajoute un enregistrement DNS
 */
async function addDNSRecord(subDomain, fieldType, target, ttl = 3600) {
  try {
    await ovhClient.request('POST', `/domain/zone/${CONFIG.domain}/record`, {
      subDomain: subDomain || '',
      fieldType,
      target,
      ttl
    });

    console.log(`  ✅ Ajouté: ${subDomain || '@'} ${fieldType} -> ${target}`);
  } catch (error) {
    console.error(`  ❌ Erreur lors de l'ajout de ${subDomain || '@'} ${fieldType}:`, error.message);
  }
}

/**
 * Rafraîchit la zone DNS
 */
async function refreshDNSZone() {
  try {
    await ovhClient.request('POST', `/domain/zone/${CONFIG.domain}/refresh`);
    console.log('✅ Zone DNS rafraîchie');
  } catch (error) {
    console.error('❌ Erreur lors du rafraîchissement:', error.message);
  }
}

/**
 * Configure les enregistrements DNS pour Vercel
 */
async function configureVercelDNS() {
  console.log('🚀 Configuration des enregistrements DNS pour Vercel\n');

  const confirm = readline.question(
    `Cette action va modifier les DNS de ${CONFIG.domain}. Continuer? (y/n): `
  );

  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Opération annulée');
    return;
  }

  console.log('\n📝 Suppression des anciens enregistrements (si existants)...\n');

  // Supprimer les anciens enregistrements A et CNAME si existants
  await deleteDNSRecord('', 'A');
  await deleteDNSRecord('www', 'CNAME');
  await deleteDNSRecord('', 'CAA');

  console.log('\n📝 Ajout des nouveaux enregistrements DNS...\n');

  // Ajouter l'enregistrement A pour le domaine principal
  await addDNSRecord('', CONFIG.dnsRecords.apex.type, CONFIG.dnsRecords.apex.target);

  // Ajouter l'enregistrement CNAME pour www
  await addDNSRecord('www', CONFIG.dnsRecords.www.type, CONFIG.dnsRecords.www.target);

  // Ajouter l'enregistrement CAA pour Let's Encrypt
  await addDNSRecord('', CONFIG.dnsRecords.caa.type, CONFIG.dnsRecords.caa.target);

  console.log('\n🔄 Rafraîchissement de la zone DNS...\n');
  await refreshDNSZone();

  console.log('\n✅ Configuration terminée !\n');
  console.log('⏱️  La propagation DNS peut prendre jusqu\'à 48 heures (généralement quelques minutes).\n');
  console.log('📌 Prochaines étapes:');
  console.log('   1. Allez sur Vercel Dashboard');
  console.log(`   2. Ajoutez le domaine: ${CONFIG.domain} et www.${CONFIG.domain}`);
  console.log('   3. Attendez que Vercel vérifie les DNS et génère le certificat SSL\n');
}

/**
 * Menu interactif
 */
async function showMenu() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   Configuration DNS OVH pour Vercel');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`Domaine: ${CONFIG.domain}\n`);
  console.log('Options:');
  console.log('  1. Lister les enregistrements DNS actuels');
  console.log('  2. Configurer les DNS pour Vercel');
  console.log('  3. Quitter\n');

  const choice = readline.question('Votre choix: ');

  switch (choice) {
    case '1':
      await listDNSRecords();
      await showMenu();
      break;
    case '2':
      await configureVercelDNS();
      await showMenu();
      break;
    case '3':
      console.log('👋 Au revoir !\n');
      process.exit(0);
      break;
    default:
      console.log('❌ Choix invalide');
      await showMenu();
  }
}

/**
 * Point d'entrée principal
 */
async function main() {
  try {
    await initializeOVH();
    await showMenu();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Lancer le script
main();
