// frontend/src/EditSweetForm.jsx
import React, { useState } from 'react';
import { updateSweet } from './api';

export default function EditSweetForm({ sweet, onUpdateComplete, onCancel }) {
  // Initialize form data with the sweet details passed from the parent
  const [formData, setFormData] = useState({
    id: sweet.id, // Keep the ID for the PUT request
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
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

    // Ensure price/quantity are numbers for the backend
    const sweetData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
    };

    try {
      // Call the PUT API function
      await updateSweet(formData.id, sweetData);
      
      // Notify parent component to refresh list and hide the form
      onUpdateComplete(); 

    } catch (e) {
      setErr(`Error updating sweet: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid orange', padding: '15px', marginTop: '10px', display: 'inline-block' }}>
        <h4>Edit Sweet ID: {sweet.id}</h4>
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" disabled={loading} style={{ backgroundColor: 'green', color: 'white' }}>
                    {loading ? 'Updating...' : 'Save Changes'}
                </button>
                <button type="button" onClick={onCancel} disabled={loading} style={{ backgroundColor: '#555', color: 'white' }}>
                    Cancel
                </button>
            </div>
            {err && <p style={{ color: 'red', margin: 0 }}>{err}</p>}
        </form>
    </div>
  );
}