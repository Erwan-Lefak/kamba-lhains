import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import styles from './SmartSearchBar.module.css';

interface SearchSuggestion {
  term: string;
  score: number;
  type: 'product' | 'category' | 'brand' | 'trend';
  highlight?: string;
}

interface SmartSearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  sessionId?: string;
  className?: string;
}

interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  colors?: string[];
  rating?: number;
}

export default function SmartSearchBar({
  placeholder = "Rechercher des vêtements...",
  initialQuery = "",
  onSearch,
  showFilters = true,
  sessionId,
  className
}: SmartSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Debounced autocomplete
  const debouncedAutocomplete = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        if (searchQuery.length >= 2) {
          setIsLoading(true);
          try {
            const response = await fetch(`/api/ai/autocomplete?q=${encodeURIComponent(searchQuery)}&limit=8`);
            const data = await response.json();
            
            if (data.success) {
              setSuggestions(data.data.suggestions);
              setShowSuggestions(true);
            }
          } catch (error) {
            console.error('Autocomplete error:', error);
          } finally {
            setIsLoading(false);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);
    },
    []
  );

  useEffect(() => {
    debouncedAutocomplete(query);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debouncedAutocomplete]);

  // Gestion des touches clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      
      if (onSearch) {
        onSearch(query.trim());
      } else {
        // Navigation vers page de résultats
        const searchParams = new URLSearchParams({
          q: query.trim(),
          ...buildFilterParams()
        });
        
        router.push(`/search?${searchParams.toString()}`);
      }
    }
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.term);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Recherche immédiate avec la suggestion
    if (onSearch) {
      onSearch(suggestion.term);
    } else {
      const searchParams = new URLSearchParams({
        q: suggestion.term,
        ...buildFilterParams()
      });
      
      router.push(`/search?${searchParams.toString()}`);
    }
  };

  const buildFilterParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    
    if (filters.category) params.category = filters.category;
    if (filters.priceRange) {
      params.minPrice = filters.priceRange[0].toString();
      params.maxPrice = filters.priceRange[1].toString();
    }
    if (filters.colors && filters.colors.length > 0) {
      params.colors = filters.colors.join(',');
    }
    if (filters.rating) params.rating = filters.rating.toString();
    
    return params;
  };

  // Recherche vocale
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsVoiceSearch(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsVoiceSearch(false);
        
        // Recherche automatique après reconnaissance vocale
        setTimeout(() => {
          if (onSearch) {
            onSearch(transcript);
          } else {
            const searchParams = new URLSearchParams({
              q: transcript,
              ...buildFilterParams()
            });
            router.push(`/search?${searchParams.toString()}`);
          }
        }, 500);
      };
      
      recognition.onerror = () => {
        setIsVoiceSearch(false);
      };
      
      recognition.onend = () => {
        setIsVoiceSearch(false);
      };
      
      recognition.start();
    }
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'product': return '🛍️';
      case 'category': return '📂';
      case 'brand': return '🏷️';
      case 'trend': return '🔥';
      default: return '🔍';
    }
  };

  return (
    <div className={`${styles.smartSearchBar} ${className || ''}`}>
      {/* Barre de recherche principale */}
      <div className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
          <div className={styles.searchIcon}>
            🔍
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className={styles.searchInput}
            autoComplete="off"
          />
          
          {/* Boutons d'action */}
          <div className={styles.actionButtons}>
            {/* Recherche vocale */}
            <button
              type="button"
              onClick={startVoiceSearch}
              className={`${styles.voiceButton} ${isVoiceSearch ? styles.listening : ''}`}
              title="Recherche vocale"
            >
              {isVoiceSearch ? '🎤' : '🎙️'}
            </button>
            
            {/* Filtres */}
            {showFilters && (
              <button
                type="button"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`${styles.filterButton} ${showFiltersPanel ? styles.active : ''}`}
                title="Filtres"
              >
                ⚙️
              </button>
            )}
            
            {/* Bouton de recherche */}
            <button
              type="button"
              onClick={handleSearch}
              className={styles.searchButton}
              disabled={!query.trim()}
            >
              Rechercher
            </button>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner} />
          </div>
        )}
      </div>

      {/* Suggestions d'autocomplétion */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            className={styles.suggestions}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={`${suggestion.term}-${index}`}
                className={`${styles.suggestion} ${
                  selectedIndex === index ? styles.selected : ''
                }`}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                whileHover={{ backgroundColor: '#f3f4f6' }}
              >
                <span className={styles.suggestionIcon}>
                  {getSuggestionIcon(suggestion.type)}
                </span>
                <span 
                  className={styles.suggestionText}
                  dangerouslySetInnerHTML={{
                    __html: suggestion.highlight || suggestion.term
                  }}
                />
                <span className={styles.suggestionType}>
                  {suggestion.type}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panneau de filtres */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div
            className={styles.filtersPanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.filtersContent}>
              {/* Filtre de catégorie */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Catégorie</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    category: e.target.value || undefined
                  })}
                  className={styles.filterSelect}
                >
                  <option value="">Toutes les catégories</option>
                  <option value="robes">Robes</option>
                  <option value="tops">Tops & Blouses</option>
                  <option value="pantalons">Pantalons</option>
                  <option value="accessoires">Accessoires</option>
                </select>
              </div>

              {/* Filtre de prix */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Prix</label>
                <div className={styles.priceRange}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange?.[0] || ''}
                    onChange={(e) => {
                      const min = parseInt(e.target.value) || 0;
                      setFilters({
                        ...filters,
                        priceRange: [min, filters.priceRange?.[1] || 1000]
                      });
                    }}
                    className={styles.priceInput}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange?.[1] || ''}
                    onChange={(e) => {
                      const max = parseInt(e.target.value) || 1000;
                      setFilters({
                        ...filters,
                        priceRange: [filters.priceRange?.[0] || 0, max]
                      });
                    }}
                    className={styles.priceInput}
                  />
                </div>
              </div>

              {/* Filtre de couleurs */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Couleurs</label>
                <div className={styles.colorFilters}>
                  {['noir', 'blanc', 'rouge', 'bleu', 'vert', 'beige'].map(color => (
                    <button
                      key={color}
                      className={`${styles.colorFilter} ${
                        filters.colors?.includes(color) ? styles.selected : ''
                      }`}
                      onClick={() => {
                        const currentColors = filters.colors || [];
                        const newColors = currentColors.includes(color)
                          ? currentColors.filter(c => c !== color)
                          : [...currentColors, color];
                        
                        setFilters({
                          ...filters,
                          colors: newColors.length > 0 ? newColors : undefined
                        });
                      }}
                      style={{ backgroundColor: color === 'noir' ? '#000' : color }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions des filtres */}
              <div className={styles.filterActions}>
                <button
                  onClick={() => setFilters({})}
                  className={styles.clearFilters}
                >
                  Effacer les filtres
                </button>
                <button
                  onClick={() => setShowFiltersPanel(false)}
                  className={styles.applyFilters}
                >
                  Appliquer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .${styles.smartSearchBar} {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .${styles.searchContainer} {
          position: relative;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
        }

        .${styles.searchContainer}:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .${styles.inputWrapper} {
          display: flex;
          align-items: center;
          padding: 0 16px;
        }

        .${styles.searchIcon} {
          color: #6b7280;
          margin-right: 12px;
          font-size: 18px;
        }

        .${styles.searchInput} {
          flex: 1;
          border: none;
          outline: none;
          padding: 16px 0;
          font-size: 16px;
          color: #1f2937;
          background: transparent;
        }

        .${styles.searchInput}::placeholder {
          color: #9ca3af;
        }

        .${styles.actionButtons} {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .${styles.voiceButton}, .${styles.filterButton} {
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .${styles.voiceButton}:hover, .${styles.filterButton}:hover {
          background: #f3f4f6;
        }

        .${styles.voiceButton}.${styles.listening} {
          background: #fee2e2;
          color: #dc2626;
          animation: pulse 1s infinite;
        }

        .${styles.filterButton}.${styles.active} {
          background: #dbeafe;
          color: #2563eb;
        }

        .${styles.searchButton} {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .${styles.searchButton}:hover:not(:disabled) {
          background: #2563eb;
        }

        .${styles.searchButton}:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .${styles.loadingIndicator} {
          position: absolute;
          top: 50%;
          right: 60px;
          transform: translateY(-50%);
        }

        .${styles.spinner} {
          width: 16px;
          height: 16px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .${styles.suggestions} {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
        }

        .${styles.suggestion} {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s;
        }

        .${styles.suggestion}:last-child {
          border-bottom: none;
        }

        .${styles.suggestion}.${styles.selected} {
          background: #f3f4f6;
        }

        .${styles.suggestionIcon} {
          margin-right: 12px;
          font-size: 16px;
        }

        .${styles.suggestionText} {
          flex: 1;
          color: #1f2937;
        }

        .${styles.suggestionText} mark {
          background: #fef3c7;
          color: #92400e;
          padding: 0 2px;
          border-radius: 2px;
        }

        .${styles.suggestionType} {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 500;
        }

        .${styles.filtersPanel} {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          margin-top: 8px;
          overflow: hidden;
        }

        .${styles.filtersContent} {
          padding: 20px;
        }

        .${styles.filterGroup} {
          margin-bottom: 16px;
        }

        .${styles.filterLabel} {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .${styles.filterSelect} {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #1f2937;
        }

        .${styles.priceRange} {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .${styles.priceInput} {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #1f2937;
        }

        .${styles.colorFilters} {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .${styles.colorFilter} {
          padding: 6px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 12px;
          text-transform: capitalize;
          transition: all 0.2s;
        }

        .${styles.colorFilter}.${styles.selected} {
          border-color: #3b82f6;
          background: #dbeafe;
          color: #1d4ed8;
        }

        .${styles.filterActions} {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .${styles.clearFilters} {
          padding: 8px 16px;
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .${styles.clearFilters}:hover {
          background: #f9fafb;
          color: #374151;
        }

        .${styles.applyFilters} {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .${styles.applyFilters}:hover {
          background: #2563eb;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @media (max-width: 768px) {
          .${styles.actionButtons} {
            gap: 4px;
          }
          
          .${styles.searchButton} {
            padding: 8px 12px;
            font-size: 14px;
          }
          
          .${styles.filterActions} {
            flex-direction: column;
          }
          
          .${styles.clearFilters}, .${styles.applyFilters} {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}