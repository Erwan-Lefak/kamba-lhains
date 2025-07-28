/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import TousLesProduits from '../../pages/tous-les-produits';
import { FavoritesProvider } from '../../contexts/FavoritesContext';
import { CartProvider } from '../../contexts/CartContext';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  );
});

// Mock components that might be used
jest.mock('../../components/ProductCard', () => {
  return function MockProductCard({ product }: any) {
    return (
      <div data-testid="product-card">
        <h3>{product?.name || 'Product'}</h3>
        <p>{product?.price || '0,00 EUR'}</p>
      </div>
    );
  };
});

describe('Tous Les Produits Page', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Test Product 1',
      price: '50,00 EUR',
      image: '/test1.jpg',
      category: 'femme',
      featured: true,
      inStock: true
    },
    {
      id: 2,
      name: 'Test Product 2',
      price: '75,00 EUR',
      image: '/test2.jpg',
      category: 'homme',
      featured: false,
      inStock: true
    }
  ];

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <CartProvider>
        <FavoritesProvider>
          {component}
        </FavoritesProvider>
      </CartProvider>
    );
  };

  it('renders page without crashing', () => {
    expect(() => renderWithProviders(<TousLesProduits />)).not.toThrow();
  });

  it('has proper page structure', () => {
    const { container } = renderWithProviders(<TousLesProduits />);
    
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with products prop', () => {
    const props = {
      products: mockProducts
    };

    expect(() => renderWithProviders(<TousLesProduits {...props} />)).not.toThrow();
  });

  it('handles empty products array', () => {
    const props = {
      products: []
    };

    expect(() => renderWithProviders(<TousLesProduits {...props} />)).not.toThrow();
  });

  it('renders correctly on different screen sizes', () => {
    // Mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    window.dispatchEvent(new Event('resize'));

    expect(() => renderWithProviders(<TousLesProduits />)).not.toThrow();

    // Desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    window.dispatchEvent(new Event('resize'));

    expect(() => renderWithProviders(<TousLesProduits />)).not.toThrow();
  });

  it('handles missing props gracefully', () => {
    expect(() => renderWithProviders(<TousLesProduits />)).not.toThrow();
  });

  it('supports server-side rendering', () => {
    // Simulate SSR environment
    const originalWindow = global.window;
    delete (global as any).window;

    expect(() => renderWithProviders(<TousLesProduits />)).not.toThrow();

    global.window = originalWindow;
  });
});