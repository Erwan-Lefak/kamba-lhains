import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../../lib/pwa';

interface OfflineIndicatorProps {
  className?: string;
  showOnlineStatus?: boolean;
  autoHide?: boolean;
  hideDelay?: number;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = '',
  showOnlineStatus = false,
  autoHide = true,
  hideDelay = 3000,
}) => {
  const { isOnline } = usePWA();
  const [showStatus, setShowStatus] = useState(false);
  const [previousOnlineState, setPreviousOnlineState] = useState(isOnline);

  useEffect(() => {
    // Show status when online state changes
    if (isOnline !== previousOnlineState) {
      setShowStatus(true);
      setPreviousOnlineState(isOnline);

      // Auto-hide after delay if going online
      if (autoHide && isOnline) {
        const timer = setTimeout(() => {
          setShowStatus(false);
        }, hideDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, previousOnlineState, autoHide, hideDelay]);

  // Always show if offline, or if configured to show online status
  const shouldShow = !isOnline || (showOnlineStatus && showStatus);

  if (!shouldShow) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`
          fixed top-4 left-1/2 transform -translate-x-1/2 z-50
          px-4 py-2 rounded-lg shadow-lg
          ${isOnline 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
          }
          ${className}
        `}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          {/* Status icon */}
          <div className="flex-shrink-0">
            {isOnline ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* Status text */}
          <span className="text-sm font-medium">
            {isOnline ? 'Connexion rétablie' : 'Mode hors ligne'}
          </span>

          {/* Loading indicator for offline */}
          {!isOnline && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Update notification component
interface UpdateNotificationProps {
  className?: string;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  className = '',
}) => {
  const { updateAvailable, skipWaiting } = usePWA();
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setShowUpdate(true);
    }
  }, [updateAvailable]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await skipWaiting();
      // Reload the page to get the new version
      window.location.reload();
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`
          fixed bottom-4 right-4 z-50
          bg-blue-600 text-white rounded-lg shadow-lg p-4
          max-w-sm w-full mx-4
          ${className}
        `}
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          {/* Update icon */}
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className="font-medium text-white mb-1">
              Mise à jour disponible
            </h4>
            <p className="text-blue-100 text-sm mb-3">
              Une nouvelle version de l'application est disponible.
            </p>

            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="
                  bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-medium
                  hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                "
              >
                {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
              
              <button
                onClick={handleDismiss}
                className="
                  text-blue-100 hover:text-white px-3 py-1.5 rounded text-sm
                  focus:outline-none focus:ring-2 focus:ring-white
                  transition-colors duration-200
                "
              >
                Plus tard
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="
              flex-shrink-0 text-blue-200 hover:text-white
              focus:outline-none focus:ring-2 focus:ring-white rounded
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Combined PWA status component
interface PWAStatusProps {
  className?: string;
  showInstallPrompt?: boolean;
  showOfflineIndicator?: boolean;
  showUpdateNotification?: boolean;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({
  className = '',
  showInstallPrompt = true,
  showOfflineIndicator = true,
  showUpdateNotification = true,
}) => {
  return (
    <div className={className}>
      {showOfflineIndicator && <OfflineIndicator />}
      {showUpdateNotification && <UpdateNotification />}
      {showInstallPrompt && (
        <div className="hidden">
          {/* InstallPrompt will show itself when appropriate */}
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;