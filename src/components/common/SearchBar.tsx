import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import Button from './Button';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  className?: string;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
  className = '',
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState(initialValue);

  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      onSearch(value);
    },
    debounceMs
  );

  useEffect(() => {
    if (initialValue !== query) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full rounded-lg border border-gray-300 bg-white overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder={placeholder}
        className="flex-grow px-4 py-3 text-gray-700 focus:outline-none"
      />
      <Button
        type="submit"
        variant="primary"
        className="rounded-none py-3 px-5"
        aria-label="Search"
      >
        <Search size={20} />
      </Button>
    </form>
  );
};

export default SearchBar;