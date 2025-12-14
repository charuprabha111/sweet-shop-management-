// frontend/src/Search.jsx
import React, { useState } from 'react';

export default function Search({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Call the search handler passed from Sweets.jsx
    onSearch(query); 
  };

  return (
    <form onSubmit={handleSearch} style={{ margin: '20px 0', padding: '10px 0', borderTop: '1px solid #555', borderBottom: '1px solid #555', maxWidth: '700px', margin: '20px auto' }}>
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, or price..."
            style={{ width: '300px', padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" className="btn-primary">Search</button>
        {/* Button to clear the search and reload all sweets */}
        {query && (
            <button 
                type="button" 
                onClick={() => { setQuery(''); onSearch(''); }}
                className="action-button btn-management"
            >
                Clear Search
            </button>
        )}
    </form>
  );
}