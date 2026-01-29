import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError } from '../types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError) => void;
  level?: 'page' | 'component' | 'critical';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError: AppError = {
      code: error.name || 'UNKNOWN_ERROR',
      message: error.message,
      details: {
        componentStack: errorInfo.componentStack,
        level: this.props.level || 'component'
      },
      timestamp: new Date().toISOString(),
      stack: error.stack
    };

    // Log en console pour le développement
    console.error('🚨 Error Boundary captured:', appError);

    // Envoyer l'erreur au service de monitoring en production
    if (process.env.NODE_ENV === 'production' && this.props.onError) {
      this.props.onError(appError);
    }

    // Analytics d'erreur
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: this.props.level === 'critical'
      });
    }

    this.setState({ error, errorInfo, errorId: appError.timestamp });
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        errorId: undefined 
      });
    } else {
      // Trop de tentatives, rediriger ou afficher un message différent
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private renderFallback() {
    const { level = 'component' } = this.props;

    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Fallback différent selon le niveau
    switch (level) {
      case 'critical':
        return (
          <div className="error-boundary critical">
            <div className="error-content">
              <h1>⚠️ Erreur Critique</h1>
              <p>Une erreur critique s'est produite. L'application doit être rechargée.</p>
              <button onClick={this.handleReload} className="retry-button primary">
                Recharger la page
              </button>
            </div>
          </div>
        );

      case 'page':
        return (
          <div className="error-boundary page">
            <div className="error-content">
              <h2>🔧 Erreur de Page</h2>
              <p>Cette page rencontre un problème. Vous pouvez réessayer ou retourner à l'accueil.</p>
              <div className="error-actions">
                <button onClick={this.handleRetry} className="retry-button">
                  Réessayer ({this.maxRetries - this.retryCount} tentatives restantes)
                </button>
                <a href="/" className="home-link">
                  Retour à l'accueil
                </a>
              </div>
            </div>
          </div>
        );

      default: // component
        return (
          <div className="error-boundary component">
            <div className="error-content">
              <h3>⚡ Erreur de Composant</h3>
              <p>Ce composant rencontre un problème temporaire.</p>
              <button 
                onClick={this.handleRetry} 
                className="retry-button small"
                disabled={this.retryCount >= this.maxRetries}
              >
                {this.retryCount >= this.maxRetries ? 'Trop de tentatives' : 'Réessayer'}
              </button>
            </div>

            {/* Détails en mode développement */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>🔍 Détails de l'erreur (développement)</summary>
                <div className="error-debug">
                  <h4>Erreur:</h4>
                  <pre>{this.state.error.toString()}</pre>
                  
                  <h4>Stack Trace:</h4>
                  <pre>{this.state.error.stack}</pre>
                  
                  <h4>Component Stack:</h4>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                  
                  <h4>Error ID:</h4>
                  <code>{this.state.errorId}</code>
                </div>
              </details>
            )}
          </div>
        );
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          {this.renderFallback()}
          <style jsx>{`
            .error-boundary {
              padding: 2rem;
              text-align: center;
              background: #fff;
              border-radius: 8px;
              margin: 1rem;
            }

            .error-boundary.critical {
              background: #fee;
              border: 2px solid #f87171;
              color: #dc2626;
            }

            .error-boundary.page {
              background: #fef3c7;
              border: 2px solid #f59e0b;
              color: #92400e;
              min-height: 300px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .error-boundary.component {
              background: #f3f4f6;
              border: 1px solid #d1d5db;
              color: #374151;
              font-size: 0.9rem;
            }

            .error-content h1, .error-content h2, .error-content h3 {
              margin-bottom: 1rem;
            }

            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-top: 1.5rem;
            }

            .retry-button {
              padding: 0.75rem 1.5rem;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 500;
              transition: background-color 0.2s;
            }

            .retry-button:hover:not(:disabled) {
              background: #2563eb;
            }

            .retry-button:disabled {
              background: #9ca3af;
              cursor: not-allowed;
            }

            .retry-button.primary {
              background: #dc2626;
            }

            .retry-button.primary:hover {
              background: #b91c1c;
            }

            .retry-button.small {
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
            }

            .home-link {
              padding: 0.75rem 1.5rem;
              background: #6b7280;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              transition: background-color 0.2s;
            }

            .home-link:hover {
              background: #4b5563;
            }

            .error-details {
              margin-top: 2rem;
              text-align: left;
              border-top: 1px solid #e5e7eb;
              padding-top: 1rem;
            }

            .error-debug {
              background: #f9fafb;
              padding: 1rem;
              border-radius: 4px;
              font-size: 0.8rem;
            }

            .error-debug h4 {
              margin: 1rem 0 0.5rem 0;
              color: #374151;
            }

            .error-debug pre {
              background: #1f2937;
              color: #f9fafb;
              padding: 0.75rem;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 0.75rem;
              line-height: 1.4;
            }

            .error-debug code {
              background: #e5e7eb;
              padding: 0.25rem 0.5rem;
              border-radius: 3px;
              font-family: 'Monaco', 'Menlo', monospace;
            }
          `}</style>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;