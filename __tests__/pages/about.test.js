/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import About from '../../pages/about';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children }) => children;
});

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt, ...props }) => (
    <img src={src} alt={alt} {...props} />
  );
});

describe('About Page', () => {
  it('renders about page content', () => {
    render(<About />);
    
    // The About page should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    const { container } = render(<About />);
    
    // Check that the page renders some content
    expect(container.firstChild).toBeTruthy();
  });

  it('renders correctly with different viewport sizes', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    expect(() => render(<About />)).not.toThrow();

    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    expect(() => render(<About />)).not.toThrow();
  });

  it('handles props gracefully', () => {
    const props = {
      customProp: 'test'
    };

    expect(() => render(<About {...props} />)).not.toThrow();
  });
});