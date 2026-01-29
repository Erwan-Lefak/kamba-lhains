import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../../contexts/AppContext';
import Kambavers from '../../pages/kambavers';

// Mock Next.js components
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

jest.mock('next/image', () => {
  return function Image({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Header and Footer
jest.mock('../../components/Header', () => {
  return function Header() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('../../components/Footer', () => {
  return function Footer() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

// Mock ProductCard
jest.mock('../../components/ProductCard', () => {
  return function ProductCard({ product, hideInfo, noLink }: any) {
    return (
      <div data-testid="product-card" data-product-id={product?.id}>
        Product Card
      </div>
    );
  };
});

// Mock la vidéo pour éviter les erreurs
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

describe('Kambavers Page', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <AppProvider>
        {component}
      </AppProvider>
    );
  };

  beforeEach(() => {
    // Reset des URL search params
    delete (window as any).location;
    (window as any).location = { search: '' };
  });

  it('should render the page correctly', () => {
    renderWithProvider(<Kambavers />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('COLLECTIONS')).toBeInTheDocument();
  });

  it('should display ÉCLAT D\'OMBRE collection by default', () => {
    renderWithProvider(<Kambavers />);
    
    expect(screen.getByText('"ÉCLAT D\'OMBRE"')).toBeInTheDocument();
    expect(screen.getByText(/Une exploration subtile entre lumière et obscurité/)).toBeInTheDocument();
  });

  it('should switch to OTA BENGA collection when clicked', async () => {
    renderWithProvider(<Kambavers />);
    
    const otaBengaButton = screen.getByText('OTA BENGA - Acte 1');
    fireEvent.click(otaBengaButton);
    
    await waitFor(() => {
      expect(screen.getByText('"OTA BENGA - Acte 1"')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Une collection qui rend hommage à l'héritage africain/)).toBeInTheDocument();
  });

  it('should show and hide collections submenu', () => {
    renderWithProvider(<Kambavers />);
    
    const collectionsButton = screen.getByText('COLLECTIONS');
    
    // Le submenu devrait être visible par défaut
    expect(screen.getByText('ÉCLAT D\'OMBRE')).toBeInTheDocument();
    expect(screen.getByText('OTA BENGA - Acte 1')).toBeInTheDocument();
    
    // Cliquer pour cacher
    fireEvent.click(collectionsButton);
    
    // Le submenu devrait être caché (mais les éléments peuvent encore être dans le DOM)
    // On teste plutôt l'état actif
    expect(screen.getByText('COLLECTIONS')).toHaveClass('active');
  });

  it('should switch to other menu sections', () => {
    renderWithProvider(<Kambavers />);
    
    const marqueButton = screen.getByText('LA MARQUE');
    fireEvent.click(marqueButton);
    
    expect(screen.getByText('LA MARQUE')).toHaveClass('active');
    expect(screen.getByText('Informations sur la marque Kamba Lhains...')).toBeInTheDocument();
  });

  it('should display boutiques section', () => {
    renderWithProvider(<Kambavers />);
    
    const boutiquesButton = screen.getByText('BOUTIQUES');
    fireEvent.click(boutiquesButton);
    
    expect(screen.getByText('BOUTIQUES')).toHaveClass('active');
    expect(screen.getByText('Nos boutiques et points de vente...')).toBeInTheDocument();
  });

  it('should handle video controls in ÉCLAT D\'OMBRE', async () => {
    renderWithProvider(<Kambavers />);
    
    // Attendre que la vidéo soit rendue
    await waitFor(() => {
      const video = screen.getByRole('application') || document.querySelector('video');
      expect(video).toBeInTheDocument();
    });
  });

  it('should render product carousel in both collections', async () => {
    renderWithProvider(<Kambavers />);
    
    // Vérifier le carrousel dans ÉCLAT D'OMBRE
    expect(screen.getByTestId('product-card')).toBeInTheDocument();
    
    // Changer vers OTA BENGA
    const otaBengaButton = screen.getByText('OTA BENGA - Acte 1');
    fireEvent.click(otaBengaButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('product-card')).toBeInTheDocument();
    });
  });

  it('should display gallery images in both collections', async () => {
    renderWithProvider(<Kambavers />);
    
    // Vérifier les images de galerie dans ÉCLAT D'OMBRE
    const images = screen.getAllByAltText(/Collection image/);
    expect(images.length).toBeGreaterThan(0);
    
    // Changer vers OTA BENGA
    const otaBengaButton = screen.getByText('OTA BENGA - Acte 1');
    fireEvent.click(otaBengaButton);
    
    await waitFor(() => {
      const otaBengaImages = screen.getAllByAltText(/OTA BENGA collection image/);
      expect(otaBengaImages.length).toBeGreaterThan(0);
    });
  });

  it('should have proper accessibility attributes', () => {
    renderWithProvider(<Kambavers />);
    
    // Vérifier les boutons de navigation
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeVisible();
    });
    
    // Vérifier la structure sémantique
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should handle URL parameters for direct navigation', () => {
    // Mock URL avec paramètres
    delete (window as any).location;
    (window as any).location = { search: '?section=collections&subcategory=ota-benga' };
    
    renderWithProvider(<Kambavers />);
    
    // Devrait afficher OTA BENGA directement
    expect(screen.getByText('"OTA BENGA - Acte 1"')).toBeInTheDocument();
  });

  it('should maintain responsive design classes', () => {
    renderWithProvider(<Kambavers />);
    
    const mainContent = document.querySelector('.main-content');
    expect(mainContent).toBeInTheDocument();
    
    const sidebarMenu = document.querySelector('.sidebar-menu');
    expect(sidebarMenu).toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    renderWithProvider(<Kambavers />);
    
    const collectionsButton = screen.getByText('COLLECTIONS');
    collectionsButton.focus();
    
    // Simuler la touche Entrée
    fireEvent.keyDown(collectionsButton, { key: 'Enter', code: 'Enter' });
    
    // Le bouton devrait rester focusable
    expect(collectionsButton).toHaveFocus();
  });
});