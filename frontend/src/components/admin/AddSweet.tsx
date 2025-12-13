import { useState } from 'react';
import api from '../../services/api';

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  quantity?: string;
  general?: string;
}

interface AddSweetProps {
  onSuccess: () => void;
}

const AddSweet = ({ onSuccess }: AddSweetProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be positive';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/sweets', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        quantity: parseInt(formData.quantity)
      });
      setFormData({ name: '', description: '', price: '', category: '', quantity: '' });
      onSuccess();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrors({ general: err.response?.data?.message || 'Failed to add sweet' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-sweet-form">
      <h3>Add New Sweet</h3>

      {errors.general && <div className="error-message">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Adding...' : 'Add Sweet'}
        </button>
      </form>
    </div>
  );
};

export default AddSweet;

