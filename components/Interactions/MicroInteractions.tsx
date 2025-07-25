import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import styles from './MicroInteractions.module.css';

// Bouton avec feedback haptique
interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function InteractiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Effet de ripple
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Supprimer le ripple après l'animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    // Feedback haptique
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`${styles.interactiveButton} ${styles[variant]} ${styles[size]} ${className || ''}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: isPressed 
          ? '0 2px 8px rgba(0,0,0,0.2)' 
          : '0 4px 16px rgba(0,0,0,0.1)'
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
    >
      {/* Ripple Effect */}
      <div className={styles.rippleContainer}>
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className={styles.ripple}
              style={{
                left: ripple.x,
                top: ripple.y
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Contenu */}
      <div className={styles.buttonContent}>
        {loading ? (
          <motion.div
            className={styles.loadingSpinner}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ) : (
          children
        )}
      </div>

      {/* Shimmer effect on hover */}
      <motion.div
        className={styles.shimmer}
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.button>
  );
}

// Carte produit avec interactions avancées
interface InteractiveCardProps {
  children: React.ReactNode;
  onFavorite?: () => void;
  onQuickView?: () => void;
  isFavorite?: boolean;
  className?: string;
}

export function InteractiveCard({
  children,
  onFavorite,
  onQuickView,
  isFavorite = false,
  className
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.interactiveCard} ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Gradient de fond qui suit la souris */}
      <motion.div
        className={styles.mouseGradient}
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
        }}
        animate={{
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* Contenu principal */}
      {children}

      {/* Actions flottantes */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={styles.floatingActions}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <InteractiveButton
              variant="ghost"
              size="sm"
              onClick={onFavorite}
              className={isFavorite ? styles.favoriteActive : ''}
            >
              <motion.span
                animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                ❤️
              </motion.span>
            </InteractiveButton>

            <InteractiveButton
              variant="ghost"
              size="sm"
              onClick={onQuickView}
            >
              👁️
            </InteractiveButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur de loading/interaction */}
      <motion.div
        className={styles.interactionIndicator}
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

// Input avec feedback visuel avancé
interface InteractiveInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export function InteractiveInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  success,
  icon
}: InteractiveInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  
  const borderColor = error 
    ? '#EF4444' 
    : success 
    ? '#10B981' 
    : isFocused 
    ? '#6366F1' 
    : '#E5E7EB';

  return (
    <div className={styles.inputContainer}>
      <motion.div
        className={styles.inputWrapper}
        animate={{
          borderColor,
          boxShadow: isFocused 
            ? `0 0 0 3px ${borderColor}20` 
            : '0 1px 3px rgba(0,0,0,0.1)'
        }}
        transition={{ duration: 0.2 }}
      >
        {icon && (
          <motion.div
            className={styles.inputIcon}
            animate={{
              color: borderColor,
              scale: isFocused ? 1.1 : 1
            }}
          >
            {icon}
          </motion.div>
        )}

        <div className={styles.inputField}>
          <motion.label
            className={styles.inputLabel}
            animate={{
              y: isFocused || value ? -20 : 0,
              scale: isFocused || value ? 0.85 : 1,
              color: borderColor
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>

          <input
            type={type}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (!hasTyped) setHasTyped(true);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? placeholder : ''}
            className={styles.input}
          />
        </div>

        {/* Indicateurs de statut */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className={styles.successIcon}
            >
              ✓
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={styles.errorIcon}
            >
              ⚠️
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Message d'erreur avec animation */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.errorMessage}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre de progression (pour mots de passe) */}
      {type === 'password' && hasTyped && (
        <motion.div
          className={styles.strengthBar}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.strengthFill}
            animate={{
              width: `${Math.min(100, (value.length / 8) * 100)}%`,
              backgroundColor: value.length < 4 
                ? '#EF4444' 
                : value.length < 8 
                ? '#F59E0B' 
                : '#10B981'
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// Toggle switch animé
interface InteractiveToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function InteractiveToggle({
  checked,
  onChange,
  label,
  size = 'md'
}: InteractiveToggleProps) {
  return (
    <div className={styles.toggleContainer}>
      <motion.button
        className={`${styles.toggle} ${styles[size]} ${checked ? styles.checked : ''}`}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={styles.toggleThumb}
          animate={{
            x: checked ? '100%' : '0%',
            backgroundColor: checked ? '#10B981' : '#E5E7EB'
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}
        />
        
        {/* Effet de lueur */}
        <motion.div
          className={styles.toggleGlow}
          animate={{
            opacity: checked ? 1 : 0,
            scale: checked ? 1 : 0.8
          }}
        />
      </motion.button>

      {label && (
        <span className={styles.toggleLabel}>{label}</span>
      )}
    </div>
  );
}

// Notification toast avec interactions
interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({
  message,
  type,
  onClose,
  duration = 5000
}: ToastNotificationProps) {
  const progress = useMotionValue(0);
  const x = useMotionValue(0);
  
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    
    // Animation de progression
    const progressTimer = setInterval(() => {
      progress.set(progress.get() + (100 / (duration / 100)));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [duration, onClose, progress]);

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      onClose();
    } else {
      x.set(0);
    }
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <motion.div
      className={`${styles.toast} ${styles[type]}`}
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      style={{ x }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
    >
      <div className={styles.toastIcon}>{icons[type]}</div>
      <div className={styles.toastMessage}>{message}</div>
      
      <InteractiveButton
        variant="ghost"
        size="sm"
        onClick={onClose}
        className={styles.toastClose}
      >
        ✕
      </InteractiveButton>

      {/* Barre de progression */}
      <motion.div
        className={styles.toastProgress}
        style={{
          scaleX: useTransform(progress, [0, 100], [1, 0])
        }}
      />
    </motion.div>
  );
}