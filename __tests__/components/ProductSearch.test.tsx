import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductSearch from '../../components/Search/ProductSearch';
import { useRouter } from 'next/router';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock useDebounce to return the value immediately for testing
jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));

// Mock ProductCard component
jest.mock('../../components/ProductCard', () => {
  return function MockProductCard({ product }: { product: any }) {
    return <div data-testid={`product-${product.id}`}>{product.name}</div>;
  };
});

const mockRouter = {
  push: jest.fn(),
  query: {},
  pathname: '/search',
};

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: ['Description 1'],
    price: 100,
    image: 'test1.jpg',
    category: 'BENGA CLASSIC',
    colors: ['Red', 'Blue'],
    sizes: ['S', 'M', 'L'],
    inStock: true,
    featured: false,
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: ['Description 2'],
    price: 200,
    image: 'test2.jpg',
    category: 'OTA BENGA',
    colors: ['Green'],
    sizes: ['M', 'L'],
    inStock: true,
    featured: true,
  },
];

const mockSearchResponse = {
  success: true,
  data: {
    products: mockProducts,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 2,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 12,
    },
    searchParams: {
      query: 'test',
      category: undefined,
      priceMin: undefined,
      priceMax: undefined,
      inStock: undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    },
  },
};

describe('ProductSearch', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input and initial state', () => {
    render(<ProductSearch />);

    expect(screen.getByPlaceholderText('Rechercher par nom, description...')).toBeInTheDocument();
    expect(screen.getByText('Filtres')).toBeInTheDocument();
    expect(screen.getByText('Commencez votre recherche')).toBeInTheDocument();
    expect(screen.getByText('Tapez un mot-clé pour rechercher des produits.')).toBeInTheDocument();
  });

  it('should perform search when typing in search input', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockSearchResponse),
    });

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products/search?query=test')
      );
    });

    await waitFor(() => {
      expect(screen.getByText('2 résultat(s) trouvé(s)')).toBeInTheDocument();
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
    });
  });

  it('should show loading state during search', async () => {
    // Mock a delayed response
    (fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        json: () => Promise.resolve(mockSearchResponse)
      }), 100))
    );

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    expect(screen.getByText('Recherche en cours...')).toBeInTheDocument();
  });

  it('should toggle filters panel', async () => {
    render(<ProductSearch />);

    const filtersButton = screen.getByText('Filtres');
    
    // Filters panel should not be visible initially
    expect(screen.queryByText('Catégorie')).not.toBeInTheDocument();

    // Click to open filters
    await user.click(filtersButton);
    expect(screen.getByText('Catégorie')).toBeInTheDocument();
    expect(screen.getByText('Prix minimum')).toBeInTheDocument();
    expect(screen.getByText('Prix maximum')).toBeInTheDocument();
    expect(screen.getByText('Trier par')).toBeInTheDocument();

    // Click to close filters
    await user.click(filtersButton);
    await waitFor(() => {
      expect(screen.queryByText('Catégorie')).not.toBeInTheDocument();
    });
  });

  it('should apply category filter', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockSearchResponse),
    });

    render(<ProductSearch />);

    // Open filters
    await user.click(screen.getByText('Filtres'));
    
    // Type in search input first
    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    // Select category
    const categorySelect = screen.getByDisplayValue('Toutes les catégories');
    await user.selectOptions(categorySelect, 'BENGA CLASSIC');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=BENGA%20CLASSIC')
      );
    });
  });

  it('should apply price filters', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockSearchResponse),
    });

    render(<ProductSearch />);

    // Open filters and add search query
    await user.click(screen.getByText('Filtres'));
    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    // Set price range
    const priceMinInput = screen.getByPlaceholderText('0');
    const priceMaxInput = screen.getByPlaceholderText('1000');
    
    await user.clear(priceMinInput);
    await user.type(priceMinInput, '50');
    await user.clear(priceMaxInput);
    await user.type(priceMaxInput, '150');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('priceMin=50&priceMax=150')
      );
    });
  });

  it('should apply sorting options', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockSearchResponse),
    });

    render(<ProductSearch />);

    await user.click(screen.getByText('Filtres'));
    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    const sortSelect = screen.getByDisplayValue('Nom (A-Z)');
    await user.selectOptions(sortSelect, 'price-desc');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sortBy=price&sortOrder=desc')
      );
    });
  });

  it('should apply stock filter', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockSearchResponse),
    });

    render(<ProductSearch />);

    await user.click(screen.getByText('Filtres'));
    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    const stockCheckbox = screen.getByLabelText('Produits en stock uniquement');
    await user.click(stockCheckbox);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('inStock=true')
      );
    });
  });

  it('should clear search', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockSearchResponse),
    });

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('2 résultat(s) trouvé(s)')).toBeInTheDocument();
    });

    // Clear search
    const clearButton = screen.getByRole('button', { name: '' }); // X button
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.getByText('Commencez votre recherche')).toBeInTheDocument();
  });

  it('should show no results message', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: {
          products: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit: 12,
          },
        },
      }),
    });

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('Aucun résultat trouvé')).toBeInTheDocument();
      expect(screen.getByText('Essayez de modifier vos critères de recherche.')).toBeInTheDocument();
    });
  });

  it('should show error message on search failure', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        success: false,
        message: 'Erreur de recherche',
      }),
    });

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Erreur de recherche')).toBeInTheDocument();
    });
  });

  it('should handle network errors', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText('Rechercher par nom, description...');
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
    });
  });
});