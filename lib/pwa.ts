// PWA utilities and offline functionality
import React from 'react';
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallationState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

class PWAManager {
  private installPrompt: BeforeInstallPromptEvent | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializePWA();
  }

  private initializePWA() {
    if (typeof window === 'undefined') return;

    // Register service worker
    this.registerServiceWorker();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e as BeforeInstallPromptEvent;
      this.emit('installable', true);
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.emit('installed', true);
    });

    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.emit('standalone', true);
    }

    // Listen for online/offline changes
    window.addEventListener('online', () => this.emit('online', true));
    window.addEventListener('offline', () => this.emit('offline', true));
  }

  private async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('Service Worker registered:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.emit('updateAvailable', registration);
            }
          });
        }
      });

      // Handle background sync registration
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        this.emit('backgroundSyncAvailable', true);
      }

      // Handle push notifications
      if ('PushManager' in window) {
        this.emit('pushAvailable', true);
      }

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      this.emit('registrationFailed', error);
    }
  }

  // Install the PWA
  async install(): Promise<boolean> {
    if (!this.installPrompt) {
      throw new Error('PWA is not installable');
    }

    try {
      await this.installPrompt.prompt();
      const result = await this.installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        this.installPrompt = null;
        this.emit('installAccepted', true);
        return true;
      } else {
        this.emit('installDismissed', true);
        return false;
      }
    } catch (error) {
      console.error('Installation failed:', error);
      this.emit('installError', error);
      return false;
    }
  }

  // Get installation state
  getInstallationState(): PWAInstallationState {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    const platform = this.detectPlatform();

    return {
      isInstallable: Boolean(this.installPrompt),
      isInstalled: isStandalone,
      isStandalone,
      installPrompt: this.installPrompt,
      platform,
    };
  }

  private detectPlatform(): 'ios' | 'android' | 'desktop' | 'unknown' {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else if (/windows|mac|linux/.test(userAgent)) {
      return 'desktop';
    }
    
    return 'unknown';
  }

  // Background sync
  async scheduleBackgroundSync(tag: string, data?: any): Promise<void> {
    if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      throw new Error('Background sync not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Store data for sync if provided
    if (data) {
      await this.storeOfflineData(`pending-${tag}`, data);
    }
    
    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
    }
  }

  // Push notifications
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    this.emit('notificationPermission', permission);
    return permission;
  }

  async subscribeToPush(vapidKey: string): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey),
      });

      this.emit('pushSubscribed', subscription);
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      this.emit('pushSubscriptionFailed', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Offline storage
  async storeOfflineData(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('kamba-offline', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline-data'], 'readwrite');
        const store = transaction.objectStore('offline-data');
        
        const putRequest = store.put({ key, data, timestamp: Date.now() });
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('offline-data')) {
          db.createObjectStore('offline-data', { keyPath: 'key' });
        }
      };
    });
  }

  async getOfflineData(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('kamba-offline', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline-data'], 'readonly');
        const store = transaction.objectStore('offline-data');
        
        const getRequest = store.get(key);
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          resolve(result ? result.data : null);
        };
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  // Network status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // App updates
  async skipWaiting(): Promise<void> {
    if (!navigator.serviceWorker.controller) return;
    
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// Singleton instance
export const pwaManager = new PWAManager();

// React hooks for PWA functionality
export const usePWA = () => {
  const [installationState, setInstallationState] = React.useState<PWAInstallationState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    installPrompt: null,
    platform: 'unknown',
  });

  const [isOnline, setIsOnline] = React.useState(true);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    // Update installation state
    const updateState = () => {
      setInstallationState(pwaManager.getInstallationState());
    };

    // Set initial state
    updateState();
    setIsOnline(pwaManager.isOnline());

    // Event listeners
    const handleInstallable = () => updateState();
    const handleInstalled = () => updateState();
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    pwaManager.on('installable', handleInstallable);
    pwaManager.on('installed', handleInstalled);
    pwaManager.on('online', handleOnline);
    pwaManager.on('offline', handleOffline);
    pwaManager.on('updateAvailable', handleUpdateAvailable);

    return () => {
      pwaManager.off('installable', handleInstallable);
      pwaManager.off('installed', handleInstalled);
      pwaManager.off('online', handleOnline);
      pwaManager.off('offline', handleOffline);
      pwaManager.off('updateAvailable', handleUpdateAvailable);
    };
  }, []);

  const install = React.useCallback(async () => {
    try {
      await pwaManager.install();
    } catch (error) {
      console.error('Installation failed:', error);
    }
  }, []);

  const scheduleBackgroundSync = React.useCallback(async (tag: string, data?: any) => {
    try {
      await pwaManager.scheduleBackgroundSync(tag, data);
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }, []);

  const requestNotifications = React.useCallback(async () => {
    try {
      return await pwaManager.requestNotificationPermission();
    } catch (error) {
      console.error('Notification permission failed:', error);
      return 'denied' as NotificationPermission;
    }
  }, []);

  return {
    ...installationState,
    isOnline,
    updateAvailable,
    install,
    scheduleBackgroundSync,
    requestNotifications,
    skipWaiting: pwaManager.skipWaiting,
  };
};

// Offline action utilities
export const offlineActions = {
  // Store action for later sync
  async storeFavorite(productId: string, action: 'add' | 'remove') {
    const favorites = await pwaManager.getOfflineData('pending-favorites') || [];
    favorites.push({
      productId,
      action,
      timestamp: Date.now(),
    });
    
    await pwaManager.storeOfflineData('pending-favorites', favorites);
    await pwaManager.scheduleBackgroundSync('favorite-product');
  },

  // Store analytics data
  async storeAnalytics(eventData: any) {
    const analytics = await pwaManager.getOfflineData('pending-analytics') || [];
    analytics.push({
      ...eventData,
      timestamp: Date.now(),
    });
    
    await pwaManager.storeOfflineData('pending-analytics', analytics);
    await pwaManager.scheduleBackgroundSync('analytics');
  },

  // Store form submission
  async storeFormSubmission(action: string, method: string, data: any) {
    const forms = await pwaManager.getOfflineData('pending-forms') || [];
    forms.push({
      action,
      method,
      data,
      timestamp: Date.now(),
    });
    
    await pwaManager.storeOfflineData('pending-forms', forms);
    await pwaManager.scheduleBackgroundSync('form-submission');
  },
};

export default pwaManager;