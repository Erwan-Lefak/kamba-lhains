import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  colorBlindnessMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  announcements: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  isScreenReaderActive: boolean;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: true,
  focusIndicators: true,
  colorBlindnessMode: 'none',
  fontSize: 'medium',
  announcements: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  // Detect system preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSettings(prev => ({ ...prev, reducedMotion: reducedMotionQuery.matches }));

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    // Detect high contrast
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setSettings(prev => ({ ...prev, highContrast: highContrastQuery.matches }));

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    // Detect screen reader
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasScreenReader = !!(
        window.navigator.userAgent.match(/NVDA|JAWS|VoiceOver|TalkBack/i) ||
        window.speechSynthesis ||
        document.querySelector('[aria-live]')
      );
      setIsScreenReaderActive(hasScreenReader);
      setSettings(prev => ({ ...prev, screenReader: hasScreenReader }));
    };

    detectScreenReader();

    // Load saved settings
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved accessibility settings');
      }
    }

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  // Apply settings to document
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply CSS custom properties based on settings
    root.style.setProperty('--font-size-base', 
      settings.fontSize === 'small' ? '14px' :
      settings.fontSize === 'large' ? '18px' :
      settings.fontSize === 'xl' ? '20px' : '16px'
    );

    // Apply classes for styling
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    root.classList.toggle('large-text', settings.largeText);
    root.classList.toggle('keyboard-navigation', settings.keyboardNavigation);
    root.classList.toggle('focus-indicators', settings.focusIndicators);
    root.classList.toggle(`colorblind-${settings.colorBlindnessMode}`, 
      settings.colorBlindnessMode !== 'none');

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Live region for announcements
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.announcements) return;

    const liveRegion = document.getElementById(`live-region-${priority}`);
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after announcement to allow repeated announcements
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        announce,
        isScreenReaderActive,
        resetSettings,
      }}
    >
      {children}
      
      {/* Live regions for screen reader announcements */}
      <div
        id="live-region-polite"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        id="live-region-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </AccessibilityContext.Provider>
  );
};