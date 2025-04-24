import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);

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
        onChange={(e) => setQuery(e.target.value)}
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