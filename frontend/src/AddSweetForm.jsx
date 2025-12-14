// frontend/src/AddSweetForm.jsx
import React, { useState } from 'react';
import { createSweet } from './api';

export default function AddSweetForm({ onSweetCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');

    // Convert price/quantity to numbers for the backend
    const sweetData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
    };

    try {
      await createSweet(sweetData);
      
      // Clear form and notify parent component (Sweets.jsx) to refresh list
      setFormData({ name: '', category: '', price: '', quantity: '' });
      onSweetCreated(); 

    } catch (e) {
      setErr(`Error creating sweet: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px', marginBottom: '20px', display: 'inline-block' }}>
        <h4>Add New Sweet</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                required
            />
            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price (e.g., 5.99)"
                step="0.01"
                required
            />
            <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Sweet'}
            </button>
            {err && <p style={{ color: 'red', margin: 0 }}>{err}</p>}
        </form>
    </div>
  );
}