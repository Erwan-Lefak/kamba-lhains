import React, { useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

// Screen reader only text component
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// Skip link component
export const SkipLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
}> = ({ href, children, className = '' }) => (
  <a
    href={href}
    className={`
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
      bg-blue-600 text-white px-4 py-2 rounded-md z-50
      focus:outline-none focus:ring-4 focus:ring-blue-300
      ${className}
    `}
  >
    {children}
  </a>
);

// Live region component for dynamic announcements
interface LiveRegionProps {
  children: React.ReactNode;
  level?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'text' | 'all' | 'additions' | 'additions removals' | 'additions text' | 'removals' | 'removals additions' | 'removals text' | 'text additions' | 'text removals';
  busy?: boolean;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  level = 'polite',
  atomic = true,
  relevant = 'all',
  busy = false,
  className = 'sr-only',
}) => (
  <div
    aria-live={level}
    aria-atomic={atomic}
    aria-relevant={relevant}
    aria-busy={busy}
    className={className}
  >
    {children}
  </div>
);

// Progress announcer component
interface ProgressAnnouncerProps {
  value: number;
  max: number;
  label?: string;
  announceInterval?: number; // Announce every N percent
}

export const ProgressAnnouncer: React.FC<ProgressAnnouncerProps> = ({
  value,
  max,
  label = 'Progression',
  announceInterval = 10,
}) => {
  const { announce } = useAccessibility();
  const lastAnnouncedRef = useRef(0);

  useEffect(() => {
    const percentage = Math.round((value / max) * 100);
    const intervalReached = Math.floor(percentage / announceInterval) * announceInterval;

    if (intervalReached > lastAnnouncedRef.current || percentage === 100) {
      lastAnnouncedRef.current = intervalReached;
      announce(`${label}: ${percentage}%`);
    }
  }, [value, max, label, announceInterval, announce]);

  return null;
};

// Form field with enhanced accessibility
interface AccessibleFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

export const AccessibleField: React.FC<AccessibleFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  description,
  required = false,
  placeholder,
  autoComplete,
  className = '',
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(' ');

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <>
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            <ScreenReaderOnly>(requis)</ScreenReaderOnly>
          </>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={ariaDescribedBy || undefined}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error 
            ? 'border-red-300 text-red-900 placeholder-red-300' 
            : 'border-gray-300 dark:border-gray-600'
          }
          dark:bg-gray-700 dark:text-white
        `}
      />

      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  );
};

// Table with enhanced accessibility
interface AccessibleTableProps {
  caption: string;
  headers: string[];
  rows: string[][];
  className?: string;
}

export const AccessibleTable: React.FC<AccessibleTableProps> = ({
  caption,
  headers,
  rows,
  className = '',
}) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <caption className="sr-only">{caption}</caption>
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              scope="col"
              className="
                px-6 py-3 text-left text-xs font-medium
                text-gray-500 dark:text-gray-300 uppercase tracking-wider
              "
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Modal with accessibility features
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { announce } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      announce(`Modal ouvert: ${title}`);
      // Focus the modal
      modalRef.current?.focus();
    }
  }, [isOpen, title, announce]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          className={`
            relative bg-white dark:bg-gray-800 rounded-lg shadow-xl
            max-w-lg w-full p-6 transform transition-all
            focus:outline-none focus:ring-4 focus:ring-blue-300
            ${className}
          `}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="mb-4">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            {children}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            aria-label="Fermer la modal"
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
    </div>
  );
};

// Breadcrumb navigation with accessibility
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface AccessibleBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const AccessibleBreadcrumb: React.FC<AccessibleBreadcrumbProps> = ({
  items,
  className = '',
}) => (
  <nav aria-label="Fil d'Ariane" className={className}>
    <ol className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400" aria-hidden="true">/</span>
          )}
          {item.current ? (
            <span
              className="text-gray-500 dark:text-gray-400"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <a
              href={item.href}
              className="
                text-blue-600 hover:text-blue-800 dark:text-blue-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 rounded
              "
            >
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default ScreenReaderOnly;