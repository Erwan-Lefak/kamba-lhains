import { NextApiRequest, NextApiResponse } from 'next';
import { smartSearch } from '../../../lib/ai/smart-search';

interface SearchApiRequest {
  q: string; // Query term
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  brands?: string[];
  rating?: number;
  sort?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
  sessionId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return handleSearch(req, res);
  } else if (req.method === 'POST') {
    return handleAdvancedSearch(req, res);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}

async function handleSearch(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      colors,
      sizes,
      brands,
      rating,
      sort,
      limit,
      offset,
      sessionId
    } = req.query as any;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }

    // Construire les filtres
    const filters: any = {};
    
    if (category) filters.category = category;
    if (minPrice || maxPrice) {
      filters.priceRange = [
        minPrice ? parseFloat(minPrice) : 0,
        maxPrice ? parseFloat(maxPrice) : 10000
      ];
    }
    if (colors) {
      filters.colors = Array.isArray(colors) ? colors : [colors];
    }
    if (sizes) {
      filters.sizes = Array.isArray(sizes) ? sizes : [sizes];
    }
    if (brands) {
      filters.brands = Array.isArray(brands) ? brands : [brands];
    }
    if (rating) {
      filters.rating = parseFloat(rating);
    }

    // Effectuer la recherche
    const searchResults = await smartSearch.search({
      term: q,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      sort: sort || 'relevance',
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0
    }, sessionId);

    res.status(200).json({
      success: true,
      data: searchResults
    });

  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

async function handleAdvancedSearch(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query, sessionId, type } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    let results;

    switch (type) {
      case 'image':
        if (!query.imageUrl) {
          return res.status(400).json({
            success: false,
            error: 'imageUrl is required for image search'
          });
        }
        results = await smartSearch.searchByImage(query.imageUrl);
        break;

      case 'voice':
        if (!query.audioBlob) {
          return res.status(400).json({
            success: false,
            error: 'audioBlob is required for voice search'
          });
        }
        results = await smartSearch.searchByVoice(query.audioBlob);
        break;

      default:
        // Recherche textuelle standard
        results = await smartSearch.search(query, sessionId);
    }

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Advanced search API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}