import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../../lib/pwa';

interface InstallPromptProps {
  className?: string;
  variant?: 'banner' | 'modal' | 'button';
  autoShow?: boolean;
  showDelay?: number;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  className = '',
  variant = 'banner',
  autoShow = true,
  showDelay = 5000,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  
  const { 
    isInstallable, 
    isInstalled, 
    isStandalone, 
    platform, 
    install 
  } = usePWA();

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setIsDismissed(true);
        return;
      }
    }

    // Auto-show after delay if installable and not dismissed
    if (autoShow && isInstallable && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isDismissed, autoShow, showDelay]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await install();
      setShowPrompt(false);
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = (permanent = false) => {
    setShowPrompt(false);
    setIsDismissed(true);
    
    if (permanent) {
      localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    }
  };

  // Don't show if already installed or not installable
  if (isInstalled || isStandalone || !isInstallable || isDismissed) {
    return null;
  }

  const getPlatformInstructions = () => {
    switch (platform) {
      case 'ios':
        return {
          title: 'Installer Kamba Lhains',
          description: 'Ajoutez l\'application à votre écran d\'accueil pour un accès rapide.',
          instructions: [
            'Appuyez sur le bouton de partage',
            'Sélectionnez "Ajouter à l\'écran d\'accueil"',
            'Appuyez sur "Ajouter"'
          ],
          icon: '📱'
        };
      case 'android':
        return {
          title: 'Installer l\'application',
          description: 'Obtenez l\'expérience complète avec l\'application native.',
          instructions: [
            'Appuyez sur "Installer"',
            'Confirmez l\'installation',
            'Profitez de l\'application'
          ],
          icon: '🤖'
        };
      default:
        return {
          title: 'Installer l\'application',
          description: 'Accédez facilement à Kamba Lhains depuis votre bureau.',
          instructions: [
            'Cliquez sur "Installer"',
            'Confirmez l\'installation',
            'Lancez l\'application'
          ],
          icon: '💻'
        };
    }
  };

  const platformInfo = getPlatformInstructions();

  if (variant === 'button') {
    return (
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`
          inline-flex items-center px-4 py-2 rounded-lg
          bg-blue-600 hover:bg-blue-700 text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${className}
        `}
      >
        {isInstalling ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Installation...
          </>
        ) : (
          <>
            <span className="mr-2">{platformInfo.icon}</span>
            Installer l'app
          </>
        )}
      </button>
    );
  }

  if (variant === 'modal') {
    return (
      <AnimatePresence>
        {showPrompt && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleDismiss()}
            />

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                className={`
                  relative bg-white dark:bg-gray-800 rounded-xl shadow-xl
                  max-w-md w-full p-6 ${className}
                `}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close button */}
                <button
                  onClick={() => handleDismiss()}
                  className="
                    absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Content */}
                <div className="text-center">
                  <div className="text-4xl mb-4">{platformInfo.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {platformInfo.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {platformInfo.description}
                  </p>

                  {platform === 'ios' ? (
                    <div className="text-left mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Pour installer sur iOS :
                      </p>
                      <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {platformInfo.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={handleInstall}
                        disabled={isInstalling}
                        className="
                          w-full bg-blue-600 hover:bg-blue-700 text-white
                          py-3 px-4 rounded-lg font-medium
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-colors duration-200
                        "
                      >
                        {isInstalling ? 'Installation...' : 'Installer maintenant'}
                      </button>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDismiss(false)}
                      className="
                        flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                        text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-gray-500
                        transition-colors duration-200
                      "
                    >
                      Plus tard
                    </button>
                    <button
                      onClick={() => handleDismiss(true)}
                      className="
                        flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                        text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-gray-500
                        transition-colors duration-200
                      "
                    >
                      Ne plus demander
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Banner variant (default)
  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          className={`
            fixed bottom-0 left-0 right-0 z-40
            bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700
            shadow-lg p-4 ${className}
          `}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{platformInfo.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {platformInfo.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {platformInfo.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {platform !== 'ios' && (
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="
                    bg-blue-600 hover:bg-blue-700 text-white
                    px-4 py-2 rounded-lg font-medium
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                  "
                >
                  {isInstalling ? 'Installation...' : 'Installer'}
                </button>
              )}
              
              <button
                onClick={() => handleDismiss()}
                className="
                  text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                  p-2 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-gray-500
                  transition-colors duration-200
                "
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;