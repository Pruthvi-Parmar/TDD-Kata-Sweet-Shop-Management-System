import { useState, useEffect, useCallback } from 'react';

interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

const categories = ['All', 'Chocolate', 'Fudge', 'Candy', 'Cookies', 'Cakes'];

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const triggerSearch = useCallback((name: string, cat: string) => {
    const params: SearchParams = {};
    if (name) params.name = name;
    if (cat && cat !== 'All') params.category = cat;
    onSearch(params);
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerSearch(searchTerm, category);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, category, triggerSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setCategory('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search sweets..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <select
        value={category}
        onChange={handleCategoryChange}
        className="category-select"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button 
        onClick={handleClear}
        className="btn-clear"
        type="button"
      >
        Clear
      </button>
    </div>
  );
};

export default SearchBar;

