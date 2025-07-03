import React from 'react';
import { ErrorState } from '../hooks/useErrorHandler';

interface ErrorAlertProps {
  error: ErrorState;
  onClose: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '400px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <h4 style={{
          margin: 0,
          color: '#c53030',
          fontSize: '16px'
        }}>
          Erreur
        </h4>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#c53030'
          }}
        >
          ×
        </button>
      </div>
      <p style={{
        margin: 0,
        color: '#742a2a',
        fontSize: '14px'
      }}>
        {error.message}
      </p>
      {error.code && (
        <p style={{
          margin: '8px 0 0 0',
          color: '#999',
          fontSize: '12px'
        }}>
          Code: {error.code}
        </p>
      )}
    </div>
  );
};

export default ErrorAlert;