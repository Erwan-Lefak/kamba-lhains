import { NextApiRequest, NextApiResponse } from 'next';
import { smartSearch } from '../../../lib/ai/smart-search';

interface AutocompleteResponse {
  success: boolean;
  data?: {
    suggestions: Array<{
      term: string;
      score: number;
      type: 'product' | 'category' | 'brand' | 'trend';
      highlight?: string;
    }>;
    metadata: {
      query: string;
      responseTime: number;
      totalSuggestions: number;
    };
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AutocompleteResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const startTime = Date.now();

  try {
    const { q, limit } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }

    if (q.length < 1) {
      return res.status(200).json({
        success: true,
        data: {
          suggestions: [],
          metadata: {
            query: q,
            responseTime: Date.now() - startTime,
            totalSuggestions: 0
          }
        }
      });
    }

    const maxLimit = Math.min(parseInt(limit as string) || 8, 20);
    
    // Obtenir les suggestions de l'engine de recherche
    const suggestions = await smartSearch.autocomplete(q, maxLimit);
    
    // Enrichir les suggestions avec highlighting
    const enrichedSuggestions = suggestions.map(suggestion => ({
      ...suggestion,
      highlight: highlightMatch(suggestion.term, q)
    }));

    const responseTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      data: {
        suggestions: enrichedSuggestions,
        metadata: {
          query: q,
          responseTime,
          totalSuggestions: suggestions.length
        }
      }
    });

  } catch (error) {
    console.error('Autocomplete API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Met en évidence les parties correspondantes dans la suggestion
 */
function highlightMatch(suggestion: string, query: string): string {
  const queryLower = query.toLowerCase();
  const suggestionLower = suggestion.toLowerCase();
  
  const index = suggestionLower.indexOf(queryLower);
  
  if (index === -1) {
    return suggestion;
  }
  
  const before = suggestion.substring(0, index);
  const match = suggestion.substring(index, index + query.length);
  const after = suggestion.substring(index + query.length);
  
  return `${before}<mark>${match}</mark>${after}`;
}