import React, { useState } from 'react';
import Icon from './Icon';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Rechercher...",
  onSearch 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            pl-10 pr-10
            py-3 sm:py-4
            rounded-lg
            border border-gray-200
            text-base
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-africa-secondary focus:border-transparent
            transition-shadow
            shadow-sm hover:shadow-md
          "
        />
        <Icon 
          name="search" 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear search"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-transparent opacity-75 blur-xl" />
    </form>
  );
};

export default SearchBar;
