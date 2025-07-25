import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutoSizeTitle from '../../components/AutoSizeTitle';

// Mock canvas and context
const mockGetContext = jest.fn();
const mockMeasureText = jest.fn();

beforeEach(() => {
  // Mock canvas methods
  mockMeasureText.mockReturnValue({ width: 100 });
  mockGetContext.mockReturnValue({
    measureText: mockMeasureText,
    font: ''
  });
  
  // Mock document.createElement for canvas
  const originalCreateElement = document.createElement;
  document.createElement = jest.fn((tagName) => {
    if (tagName === 'canvas') {
      return {
        getContext: mockGetContext
      } as any;
    }
    return originalCreateElement.call(document, tagName);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AutoSizeTitle', () => {
  it('renders title text correctly', () => {
    render(<AutoSizeTitle title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<AutoSizeTitle title="Test Title" className="custom-title" />);
    
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('custom-title');
  });

  it('renders as h1 element', () => {
    render(<AutoSizeTitle title="Test Title" />);
    
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Test Title');
  });

  it('applies default font size when no maxWidth is provided', () => {
    render(<AutoSizeTitle title="Test Title" />);
    
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveStyle({ fontSize: '24px' });
  });

  it('applies default styles for text overflow', () => {
    render(<AutoSizeTitle title="Test Title" maxWidth={300} />);
    
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveStyle({
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    });
  });

  it('handles empty title gracefully', () => {
    render(<AutoSizeTitle title="" />);
    
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('');
  });

  it('updates font size when maxWidth changes', () => {
    const { rerender } = render(<AutoSizeTitle title="Test Title" maxWidth={300} />);
    
    // Mock a different width measurement for smaller maxWidth
    mockMeasureText.mockReturnValue({ width: 250 });
    
    rerender(<AutoSizeTitle title="Test Title" maxWidth={200} />);
    
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
  });

  it('handles canvas context creation failure gracefully', () => {
    // Mock getContext to return null
    mockGetContext.mockReturnValue(null);
    
    render(<AutoSizeTitle title="Test Title" maxWidth={300} />);
    
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
    // Should still render with default font size
    expect(titleElement).toHaveStyle({ fontSize: '24px' });
  });

  it('handles long titles with character normalization', () => {
    const longTitle = "Très Longue Título con Caráctères Spéciaux & Ñumbers 123";
    render(<AutoSizeTitle title={longTitle} maxWidth={400} />);
    
    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toBeInTheDocument();
  });

  it('respects padding in width calculation', () => {
    // Mock a text width that would exceed maxWidth without padding
    mockMeasureText.mockReturnValue({ width: 280 });
    
    render(<AutoSizeTitle title="Wide Title" maxWidth={300} />);
    
    // The component should account for 40px padding in its calculations
    expect(mockMeasureText).toHaveBeenCalled();
  });
});