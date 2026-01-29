import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from './AccessibilityProvider';

interface AccessibilityPanelProps {
  className?: string;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, announce, resetSettings } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    announce(isOpen ? 'Panneau d\'accessibilité fermé' : 'Panneau d\'accessibilité ouvert');
  };

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value);
    announce(`${key} ${value ? 'activé' : 'désactivé'}`);
  };

  return (
    <>
      {/* Accessibility trigger button */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={`
          fixed bottom-4 right-4 z-50
          w-14 h-14 rounded-full
          bg-blue-600 hover:bg-blue-700
          text-white shadow-lg
          focus:outline-none focus:ring-4 focus:ring-blue-300
          transition-all duration-200
          ${className || ''}
        `}
        aria-label={isOpen ? 'Fermer le panneau d\'accessibilité' : 'Ouvrir le panneau d\'accessibilité'}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            id="accessibility-panel"
            className="
              fixed bottom-20 right-4 z-50
              w-80 max-w-[calc(100vw-2rem)]
              bg-white dark:bg-gray-800
              rounded-lg shadow-xl border
              border-gray-200 dark:border-gray-700
            "
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-labelledby="accessibility-panel-title"
            aria-describedby="accessibility-panel-description"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 
                  id="accessibility-panel-title"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  Accessibilité
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="
                    p-1 rounded-md text-gray-400 hover:text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  aria-label="Fermer le panneau"
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
              <p 
                id="accessibility-panel-description"
                className="text-sm text-gray-600 dark:text-gray-300 mt-1"
              >
                Personnalisez votre expérience de navigation
              </p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Taille du texte
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="
                    w-full p-2 border border-gray-300 rounded-md
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  "
                  aria-describedby="font-size-description"
                >
                  <option value="small">Petit</option>
                  <option value="medium">Normal</option>
                  <option value="large">Grand</option>
                  <option value="xl">Très grand</option>
                </select>
                <p id="font-size-description" className="text-xs text-gray-500">
                  Ajuste la taille du texte sur tout le site
                </p>
              </div>

              {/* Color Blindness Mode */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mode daltonisme
                </label>
                <select
                  value={settings.colorBlindnessMode}
                  onChange={(e) => handleSettingChange('colorBlindnessMode', e.target.value)}
                  className="
                    w-full p-2 border border-gray-300 rounded-md
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  "
                >
                  <option value="none">Aucun</option>
                  <option value="protanopia">Protanopie</option>
                  <option value="deuteranopia">Deutéranopie</option>
                  <option value="tritanopia">Tritanopie</option>
                </select>
              </div>

              {/* Toggle Settings */}
              <div className="space-y-3">
                <ToggleOption
                  id="high-contrast"
                  label="Contraste élevé"
                  description="Améliore la visibilité du texte et des éléments"
                  checked={settings.highContrast}
                  onChange={(checked) => handleSettingChange('highContrast', checked)}
                />

                <ToggleOption
                  id="reduced-motion"
                  label="Réduire les animations"
                  description="Diminue ou supprime les animations"
                  checked={settings.reducedMotion}
                  onChange={(checked) => handleSettingChange('reducedMotion', checked)}
                />

                <ToggleOption
                  id="large-text"
                  label="Texte agrandi"
                  description="Augmente la taille du texte principal"
                  checked={settings.largeText}
                  onChange={(checked) => handleSettingChange('largeText', checked)}
                />

                <ToggleOption
                  id="focus-indicators"
                  label="Indicateurs de focus"
                  description="Affiche des bordures visibles lors de la navigation au clavier"
                  checked={settings.focusIndicators}
                  onChange={(checked) => handleSettingChange('focusIndicators', checked)}
                />

                <ToggleOption
                  id="announcements"
                  label="Annonces vocales"
                  description="Active les notifications pour les lecteurs d'écran"
                  checked={settings.announcements}
                  onChange={(checked) => handleSettingChange('announcements', checked)}
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  resetSettings();
                  announce('Paramètres d\'accessibilité réinitialisés');
                }}
                className="
                  w-full p-2 mt-4
                  text-sm font-medium text-gray-700 dark:text-gray-300
                  border border-gray-300 dark:border-gray-600
                  rounded-md hover:bg-gray-50 dark:hover:bg-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              >
                Réinitialiser les paramètres
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Toggle Option Component
interface ToggleOptionProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="
            w-4 h-4 text-blue-600 border-gray-300 rounded
            focus:ring-2 focus:ring-blue-500
            dark:border-gray-600 dark:focus:ring-blue-600
          "
          aria-describedby={`${id}-description`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          {label}
        </label>
        <p
          id={`${id}-description`}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default AccessibilityPanel;