import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Mode hors ligne - Kamba Lhains</title>
        <meta name="description" content="Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Offline icon */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          >
            <div className="relative mx-auto w-24 h-24">
              {/* WiFi icon with slash */}
              <svg
                className="w-24 h-24 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
              
              {/* Slash overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-0.5 bg-red-500 rotate-45 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Mode hors ligne
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Vous êtes actuellement hors ligne. Vérifiez votre connexion Internet 
              et réessayez. Certaines fonctionnalités peuvent être disponibles en mode hors ligne.
            </p>

            {/* Action buttons */}
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="
                  w-full bg-blue-600 hover:bg-blue-700 text-white
                  py-3 px-6 rounded-lg font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors duration-200
                "
              >
                Réessayer
              </button>

              <button
                onClick={() => window.history.back()}
                className="
                  w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                  text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                  transition-colors duration-200
                "
              >
                Retour
              </button>
            </div>
          </motion.div>

          {/* Offline tips */}
          <motion.div
            className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💡 Conseils pour le mode hors ligne
            </h2>
            
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Les pages récemment visitées sont disponibles hors ligne
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Vos favoris sont sauvegardés localement
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Les actions seront synchronisées à la reconnexion
              </li>
            </ul>
          </motion.div>

          {/* Network status indicator */}
          <motion.div
            className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Vérification de la connexion...</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Auto-retry when back online */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('online', function() {
              setTimeout(function() {
                window.location.reload();
              }, 1000);
            });
          `,
        }}
      />
    </>
  );
};

export default OfflinePage;