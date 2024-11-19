import React, { useState, useEffect, useRef } from 'react';
    import { FaSearch, FaTimesCircle } from 'react-icons/fa';

    interface CSOSearchProps {
      organizations: any[];
      onSearch: (results: any[]) => void;
    }

    const CSOSearch: React.FC<CSOSearchProps> = ({ organizations, onSearch }) => {
      const [searchTerm, setSearchTerm] = useState('');
      const [suggestions, setSuggestions] = useState<any[]>([]);
      const [recentSearches, setRecentSearches] = useState<string[]>([]);
      const searchInputRef = useRef<HTMLInputElement>(null);

      // Load recent searches from localStorage
      useEffect(() => {
        const saved = localStorage.getItem('recentCSOSearches');
        if (saved) {
          setRecentSearches(JSON.parse(saved).slice(0, 5));
        }
      }, []);

      // Handle search input changes
      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Generate suggestions
        if (value.length > 1) {
          const filteredSuggestions = organizations.filter(org => 
            org.name.toLowerCase().includes(value.toLowerCase()) ||
            org.country.toLowerCase().includes(value.toLowerCase()) ||
            org.expertise.some((exp: string) => 
              exp.toLowerCase().includes(value.toLowerCase())
            )
          ).slice(0, 5);

          setSuggestions(filteredSuggestions);
        } else {
          setSuggestions([]);
        }
      };

      // Perform search
      const performSearch = (term?: string) => {
        const searchTermToUse = term || searchTerm;
        
        // Filter organizations
        const results = organizations.filter(org => 
          org.name.toLowerCase().includes(searchTermToUse.toLowerCase()) ||
          org.country.toLowerCase().includes(searchTermToUse.toLowerCase()) ||
          org.expertise.some((exp: string) => 
            exp.toLowerCase().includes(searchTermToUse.toLowerCase())
          )
        );

        // Update recent searches
        if (searchTermToUse) {
          const updatedRecent = [
            searchTermToUse,
            ...recentSearches.filter(s => s !== searchTermToUse)
          ].slice(0, 5);
          
          setRecentSearches(updatedRecent);
          localStorage.setItem('recentCSOSearches', JSON.stringify(updatedRecent));
        }

        // Call parent search handler
        onSearch(results);
        setSuggestions([]);
      };

      // Handle search submission
      const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch();
      };

      // Clear search
      const clearSearch = () => {
        setSearchTerm('');
        setSuggestions([]);
        onSearch(organizations);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      };

      return (
        <div className="relative mb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher une organisation..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-africa-secondary"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <FaTimesCircle 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                />
              )}
            </div>
          </form>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
              {suggestions.map(suggestion => (
                <div 
                  key={suggestion.id}
                  onClick={() => {
                    setSearchTerm(suggestion.name);
                    performSearch(suggestion.name);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.name} - {suggestion.country}
                </div>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchTerm && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Recherches récentes</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(search => (
                  <button
                    key={search}
                    onClick={() => {
                      setSearchTerm(search);
                      performSearch(search);
                    }}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };

    export default CSOSearch;
