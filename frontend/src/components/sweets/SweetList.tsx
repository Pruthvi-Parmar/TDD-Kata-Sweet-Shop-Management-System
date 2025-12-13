import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sweet } from '../../types';
import SweetCard from './SweetCard';

const SweetList = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/sweets');
      setSweets(response.data.sweets);
      setError(null);
    } catch {
      setError('Failed to load sweets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handlePurchase = async (id: string) => {
    try {
      await api.post(`/sweets/${id}/purchase`);
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to purchase');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading sweets...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (sweets.length === 0) {
    return <div className="empty-message">No sweets available</div>;
  }

  return (
    <div className="sweet-list">
      <h2>Our Sweets</h2>
      <div className="sweet-grid">
        {sweets.map(sweet => (
          <SweetCard 
            key={sweet._id} 
            sweet={sweet} 
            onPurchase={handlePurchase}
          />
        ))}
      </div>
    </div>
  );
};

export default SweetList;

