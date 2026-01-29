import { FullConfig } from '@playwright/test';

/**
 * Teardown global pour les tests E2E
 * Nettoie l'environnement après tous les tests
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Nettoyage après les tests E2E...');
  
  try {
    // Nettoyer les fichiers temporaires
    await cleanupTempFiles();
    
    // Générer le rapport de performance
    await generatePerformanceReport();
    
    // Nettoyer les données de test
    await cleanupTestData();
    
    // Archiver les résultats de test
    await archiveTestResults();
    
    console.log('✅ Teardown global terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors du teardown global:', error);
    // Ne pas faire échouer les tests pour des erreurs de nettoyage
  }
}

/**
 * Nettoyage des fichiers temporaires
 */
async function cleanupTempFiles() {
  console.log('🗑️ Nettoyage des fichiers temporaires...');
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    // Nettoyer les screenshots temporaires
    const tempScreenshotsDir = path.join(process.cwd(), 'test-results', 'temp-screenshots');
    try {
      await fs.rmdir(tempScreenshotsDir, { recursive: true });
    } catch (e) {
      // Le dossier n'existe peut-être pas
    }
    
    // Nettoyer les traces temporaires
    const tempTracesDir = path.join(process.cwd(), 'test-results', 'temp-traces');
    try {
      await fs.rmdir(tempTracesDir, { recursive: true });
    } catch (e) {
      // Le dossier n'existe peut-être pas
    }
    
    console.log('✅ Fichiers temporaires nettoyés');
  } catch (error) {
    console.warn('⚠️ Impossible de nettoyer certains fichiers temporaires:', error.message);
  }
}

/**
 * Génération du rapport de performance
 */
async function generatePerformanceReport() {
  console.log('📊 Génération du rapport de performance...');
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const resultsFile = path.join(process.cwd(), 'test-results', 'results.json');
    
    try {
      const resultsContent = await fs.readFile(resultsFile, 'utf8');
      const results = JSON.parse(resultsContent);
      
      // Analyser les résultats de performance
      const performanceTests = results.suites?.filter((suite: any) => 
        suite.title.includes('performance') || suite.title.includes('Performance')
      ) || [];
      
      const performanceReport = {
        timestamp: new Date().toISOString(),
        totalPerformanceTests: performanceTests.length,
        passedTests: performanceTests.filter((test: any) => test.outcome === 'passed').length,
        failedTests: performanceTests.filter((test: any) => test.outcome === 'failed').length,
        averageTestDuration: performanceTests.reduce((acc: number, test: any) => 
          acc + (test.duration || 0), 0) / performanceTests.length,
        criticalIssues: performanceTests.filter((test: any) => 
          test.title.includes('critical') && test.outcome === 'failed'
        ).length
      };
      
      // Sauvegarder le rapport
      const reportFile = path.join(process.cwd(), 'test-results', 'performance-report.json');
      await fs.writeFile(reportFile, JSON.stringify(performanceReport, null, 2));
      
      console.log('✅ Rapport de performance généré');
      console.log(`📈 Tests de performance: ${performanceReport.passedTests}/${performanceReport.totalPerformanceTests} réussis`);
      
      if (performanceReport.criticalIssues > 0) {
        console.warn(`⚠️ ${performanceReport.criticalIssues} problème(s) critique(s) détecté(s)`);
      }
      
    } catch (e) {
      console.log('ℹ️ Aucun fichier de résultats trouvé pour le rapport de performance');
    }
    
  } catch (error) {
    console.warn('⚠️ Erreur lors de la génération du rapport de performance:', error.message);
  }
}

/**
 * Nettoyage des données de test
 */
async function cleanupTestData() {
  console.log('🗃️ Nettoyage des données de test...');
  
  try {
    // Si nous utilisions une base de données de test, nous la nettoierions ici
    // Pour l'instant, nous utilisons localStorage, donc pas de nettoyage nécessaire
    
    // Nettoyer les fichiers de cache de test si ils existent
    const fs = require('fs').promises;
    const path = require('path');
    
    const cacheFiles = [
      path.join(process.cwd(), '.test-cache'),
      path.join(process.cwd(), 'test-data.json'),
      path.join(process.cwd(), 'test-user-sessions.json')
    ];
    
    for (const file of cacheFiles) {
      try {
        await fs.unlink(file);
      } catch (e) {
        // Le fichier n'existe peut-être pas
      }
    }
    
    console.log('✅ Données de test nettoyées');
    
  } catch (error) {
    console.warn('⚠️ Erreur lors du nettoyage des données de test:', error.message);
  }
}

/**
 * Archivage des résultats de test
 */
async function archiveTestResults() {
  console.log('📦 Archivage des résultats de test...');
  
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // Créer un dossier d'archive avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveDir = path.join(process.cwd(), 'test-archives', `tests-${timestamp}`);
    
    // S'assurer que le dossier d'archive existe
    await fs.mkdir(archiveDir, { recursive: true });
    
    // Fichiers à archiver
    const filesToArchive = [
      'test-results/results.json',
      'test-results/junit.xml',
      'test-results/performance-report.json'
    ];
    
    for (const file of filesToArchive) {
      const sourcePath = path.join(process.cwd(), file);
      const fileName = path.basename(file);
      const destPath = path.join(archiveDir, fileName);
      
      try {
        await fs.copyFile(sourcePath, destPath);
      } catch (e) {
        // Le fichier n'existe peut-être pas
      }
    }
    
    // Créer un résumé de l'exécution
    const summary = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      testCommand: process.argv.join(' '),
      duration: Date.now() - (global as any).testStartTime || 0
    };
    
    await fs.writeFile(
      path.join(archiveDir, 'test-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('✅ Résultats archivés dans:', archiveDir);
    
  } catch (error) {
    console.warn('⚠️ Erreur lors de l\'archivage:', error.message);
  }
}

export default globalTeardown;