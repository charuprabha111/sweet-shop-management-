// frontend/src/Sweets.jsx (Final Version - Conditional Rendering with Clean Spacing)

import React, { useEffect, useState } from "react";
import { getSweets, deleteSweet, searchSweets, purchaseSweet, restockSweet } from "./api"; 
import AddSweetForm from "./AddSweetForm"; 
import EditSweetForm from "./EditSweetForm"; 
import Search from "./Search"; 

// Receive isAdmin status as a prop
export default function Sweets({ isAdmin }) { 
    const [sweets, setSweets] = useState([]);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);
    // Admin-only state, only used if isAdmin is true
    const [editingSweet, setEditingSweet] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [restockAmount, setRestockAmount] = useState({});

    async function loadSweets(query = searchTerm) {
        setErr("");
        setLoading(true);
        try {
            let data = query ? await searchSweets(query) : await getSweets();
            setSweets(data);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    // STANDARD USER ACTION
    const handlePurchase = async (id, name) => {
        setErr("");
        if (!window.confirm(`Confirm purchase of 1 x ${name}?`)) return;

        try {
            await purchaseSweet(id); 
            loadSweets();
        } catch (e) {
            setErr(`Purchase failed for ${name}: ${e.message}`);
            loadSweets();
        }
    };

    // ADMIN ACTION
    const handleRestock = async (id, name) => {
        setErr("");
        if (!isAdmin) {
            setErr("Error: Only Admins can restock inventory.");
            return; 
        }
        const amount = parseInt(restockAmount[id]) || 0; 
        if (amount <= 0 || isNaN(amount)) {
            setErr("Restock amount must be a positive number.");
            return;
        }
        if (!window.confirm(`Confirm restock of ${amount} x ${name}?`)) return;
        try {
            await restockSweet(id, amount);
            setRestockAmount(prev => ({ ...prev, [id]: '' }));
            loadSweets();
        } catch (e) {
            setErr(`Restock failed for ${name}. Error: ${e.message}`);
            loadSweets(); 
        }
    };
    
    // ADMIN ACTION
    const handleDelete = async (id, name) => {
        if (!isAdmin) {
            setErr("Error: Only Admins can delete a sweet.");
            return; 
        }
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        setLoading(true);
        try {
            await deleteSweet(id);
            loadSweets(); 
        } catch (e) {
            setErr(`Delete failed: ${e.message}`);
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        loadSweets(query); 
    };

    const handleActionComplete = () => {
        setEditingSweet(null);
        loadSweets();
    };

    const handleEdit = (sweet) => {
        if (!isAdmin) {
            setErr("Error: Only Admins can edit a sweet.");
            return; 
        }
        setEditingSweet(sweet);
    };


    useEffect(() => {
        loadSweets();
    }, [isAdmin]);

    if (loading) return <p>Loading sweets...</p>;

    return (
        <div>
            {err && <div style={{ color: "red", marginBottom: '10px' }}>Error: {err}</div>}

            <Search onSearch={handleSearch} />

            {/* RENDER ADD/EDIT FORMS ONLY IF ADMIN */}
            {isAdmin && (
                editingSweet ? (
                    <EditSweetForm 
                        sweet={editingSweet} 
                        onUpdateComplete={handleActionComplete} 
                        onCancel={() => setEditingSweet(null)}
                    />
                ) : (
                    <AddSweetForm onSweetCreated={handleActionComplete} />
                )
            )}
            
            <h3>Sweets List ({sweets.length} results {searchTerm && `for "${searchTerm}"`})</h3>
            {sweets.length === 0 && !searchTerm ? (
                <p>No sweets available. {isAdmin && "Add one above!"}</p>
            ) : sweets.length === 0 && searchTerm ? (
                <p>No results found for "{searchTerm}".</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {sweets.map((s) => (
                        <li 
                            key={s.id} 
                            style={{ 
                                borderBottom: '1px dotted #444', 
                                padding: '10px 0', 
                                textAlign: 'left', 
                                maxWidth: '700px', 
                                margin: '0 auto', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            }}>
                            
                            {/* Sweet Details */}
                            <span>
                                <strong>{s.name}</strong> ({s.category}) – ₹{s.price} (Qty: **{s.quantity}**)
                            </span>
                            
                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                
                                {/* PURCHASE BUTTON: Show ONLY if the user is NOT an admin */}
                                {!isAdmin && (
                                    <button 
                                        onClick={() => handlePurchase(s.id, s.name)}
                                        className="action-button btn-primary">
                                        Purchase (-1)
                                    </button>
                                )}
                                
                                {/* ADMIN ACTIONS (Only rendered if isAdmin is true) */}
                                {isAdmin && (
                                    <>
                                        <input
                                            type="number"
                                            min="1"
                                            className="restock-input" 
                                            value={restockAmount[s.id] || ''}
                                            onChange={(e) => setRestockAmount(prev => ({ ...prev, [s.id]: e.target.value }))}
                                            placeholder="Amt"
                                        />
                                        <button 
                                            onClick={() => handleRestock(s.id, s.name)}
                                            className="action-button btn-restock">
                                            Restock
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleEdit(s)}
                                            className="action-button btn-management">
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(s.id, s.name)}
                                            className="action-button btn-danger">
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}