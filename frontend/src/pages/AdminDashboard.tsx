import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Sweet } from '../types';
import AddSweet from '../components/admin/AddSweet';
import UpdateSweet from '../components/admin/UpdateSweet';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchSweets();
  }, [isAdmin, navigate]);

  const fetchSweets = async () => {
    try {
      const response = await api.get('/sweets');
      setSweets(response.data.sweets);
    } catch {
      console.error('Failed to fetch sweets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;
    
    try {
      await api.delete(`/sweets/${id}`);
      fetchSweets();
    } catch {
      alert('Failed to delete sweet');
    }
  };

  const handleRestock = async (id: string) => {
    const quantity = prompt('Enter quantity to add:');
    if (!quantity) return;
    
    try {
      await api.post(`/sweets/${id}/restock`, { quantity: parseInt(quantity) });
      fetchSweets();
    } catch {
      alert('Failed to restock');
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchSweets();
  };

  const handleUpdateSuccess = () => {
    setEditingSweet(null);
    fetchSweets();
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button 
          onClick={() => setShowAddForm(true)} 
          className="btn-primary"
        >
          + Add New Sweet
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddSweet 
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {editingSweet && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UpdateSweet 
              sweet={editingSweet}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setEditingSweet(null)}
            />
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map(sweet => (
              <tr key={sweet._id}>
                <td>{sweet.name}</td>
                <td>{sweet.category}</td>
                <td>${sweet.price.toFixed(2)}</td>
                <td className={sweet.quantity < 10 ? 'low-stock' : ''}>
                  {sweet.quantity}
                </td>
                <td className="actions">
                  <button 
                    onClick={() => setEditingSweet(sweet)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleRestock(sweet._id)}
                    className="btn-restock"
                  >
                    Restock
                  </button>
                  <button 
                    onClick={() => handleDelete(sweet._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

