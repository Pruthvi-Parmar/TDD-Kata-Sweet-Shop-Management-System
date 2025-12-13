import { useState } from 'react';
import SweetList from '../components/sweets/SweetList';
import SearchBar from '../components/sweets/SearchBar';

interface SearchParams {
  name?: string;
  category?: string;
}

const Home = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Sweet Shop</h1>
        <p>Discover our delicious collection of handcrafted sweets</p>
      </div>
      
      <div className="content-section">
        <SearchBar onSearch={handleSearch} />
        <SweetList searchParams={{ search: searchParams.name || '', category: searchParams.category || '' }} />
      </div>
    </div>
  );
};

export default Home;

