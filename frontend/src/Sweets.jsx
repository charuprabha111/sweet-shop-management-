import React, { useEffect, useState } from "react";
import {
  getSweets,
  deleteSweet,
  searchSweets,
  purchaseSweet,
  restockSweet
} from "./api";

import AddSweetForm from "./AddSweetForm";
import EditSweetForm from "./EditSweetForm";
import Search from "./Search";

export default function Sweets({ isAdmin }) {
  const [sweets, setSweets] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingSweet, setEditingSweet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [restockAmount, setRestockAmount] = useState({});

  async function loadSweets(query = searchTerm) {
    setLoading(true);
    try {
      const data = query ? await searchSweets(query) : await getSweets();
      setSweets(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handlePurchase = async (id, name) => {
    if (!window.confirm(`Buy ${name}?`)) return;
    try {
      await purchaseSweet(id);
      loadSweets();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleRestock = async (id) => {
    const amt = parseInt(restockAmount[id]);
    if (!amt || amt <= 0) return;
    await restockSweet(id, amt);
    setRestockAmount({ ...restockAmount, [id]: "" });
    loadSweets();
  };

  useEffect(() => {
    loadSweets();
  }, [isAdmin]);

  if (loading) return <p>Loading sweets...</p>;

  return (
    <div style={styles.container}>
      {err && <p style={styles.error}>{err}</p>}

      <Search onSearch={(q) => loadSweets(q)} />

      {isAdmin && (
        editingSweet ? (
          <EditSweetForm
            sweet={editingSweet}
            onUpdateComplete={() => {
              setEditingSweet(null);
              loadSweets();
            }}
            onCancel={() => setEditingSweet(null)}
          />
        ) : (
          <AddSweetForm onSweetCreated={loadSweets} />
        )
      )}

      <div style={styles.grid}>
        {sweets.map((s) => (
          <div key={s.id} style={styles.card}>
            
            <h2 style={styles.name}>{s.name}</h2>
            <p style={styles.category}>{s.category}</p>

            <p style={styles.price}>₹ {s.price}</p>

            {isAdmin && (
              <p style={styles.stock}>Stock: {s.quantity}</p>
            )}

            <div style={styles.actions}>
              {!isAdmin && (
                <button style={styles.buyBtn}
                  onClick={() => handlePurchase(s.id, s.name)}>
                  Purchase
                </button>
              )}

              {isAdmin && (
                <>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={restockAmount[s.id] || ""}
                    onChange={(e) =>
                      setRestockAmount({ ...restockAmount, [s.id]: e.target.value })
                    }
                    style={styles.input}
                  />
                  <button onClick={() => handleRestock(s.id)}>Restock</button>
                  <button onClick={() => setEditingSweet(s)}>Edit</button>
                  <button onClick={() => deleteSweet(s.id).then(loadSweets)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    padding: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  card: {
    background: "rgba(0,0,0,0.7)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
    textAlign: "center",
  },
  name: {
    fontSize: "1.4rem",
    marginBottom: "5px",
    color: "#ff8c00",
  },
  category: {
    fontSize: "0.9rem",
    color: "#bbb",
  },
  price: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: "10px 0",
  },
  stock: {
    fontSize: "0.85rem",
    color: "#aaa",
  },
  actions: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  buyBtn: {
    background: "#ff7a18",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  input: {
    padding: "6px",
    borderRadius: "4px",
    border: "none",
  },
  error: {
    color: "red",
  },
};
