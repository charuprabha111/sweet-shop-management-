// frontend/src/App.jsx (FINAL CORRECTED VERSION)

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import Login from "./Login";
import Register from "./Register";
import Sweets from "./Sweets";
import candyLogo from './candy logo.png'; 

// === NEW HELPER FUNCTION FOR SAFE LOCAL STORAGE READING ===
const getInitialIsAdmin = () => {
    const storedValue = localStorage.getItem("isAdmin");
    if (!storedValue) {
        // Handle null/non-existent value
        return false;
    }
    // Handle the expected JSON booleans 'true' or 'false'
    try {
        return JSON.parse(storedValue);
    } catch (e) {
        // Handle crash cases (like "undefined" being stored)
        console.error("Failed to parse isAdmin from localStorage:", storedValue, e);
        return false;
    }
};
// ========================================================

export default function App() {
    // 1. LoggedIn: Simple check (!! operator converts value to boolean)
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );
    
    // 2. IsAdmin: Use the new safe helper function
    const [isAdmin, setIsAdmin] = useState(getInitialIsAdmin());
    
    
    // Handler passed to Login component
    const handleLoginSuccess = (is_admin) => {
        setLoggedIn(true);
        // Ensure boolean is stored as a proper string
        localStorage.setItem("isAdmin", String(is_admin)); 
        setIsAdmin(is_admin);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin"); 
        setLoggedIn(false);
        setIsAdmin(false);
    };

    return (
        <BrowserRouter>
            <div style={{ textAlign: "center", padding: "20px" }}>
                
                {/* GLOBAL HEADER/LOGO - RENDERED ON ALL PAGES */}
                <header style={{ marginBottom: "30px", padding: "10px", backgroundColor: "var(--color-surface)", borderRadius: "8px" }}>
                    <img 
                        src={candyLogo} 
                        alt="Candy Stop Sugar Rush Logo" 
                        style={{ width: "100px", height: "auto", marginBottom: "10px" }}
                    />
                    <h1 style={{ color: "var(--color-text-light)", fontSize: "2.5em", margin: "0" }}>
                        CANDY SHOP 
                        <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>
                            {' '}MANAGEMENT
                        </span>
                    </h1>
                    {loggedIn && <p style={{ color: "var(--color-primary)", margin: "5px 0 0 0" }}>
                        Logged in as: {isAdmin ? "Admin" : "Standard User"}
                    </p>}
                </header>

                {/* LOGOUT BUTTON - RENDERED ON ALL LOGGED IN PAGES */}
                {loggedIn && (
                    <button 
                        onClick={handleLogout} 
                        className="btn-danger" 
                        style={{ position: 'absolute', top: '20px', right: '20px' }}
                    >
                        Logout
                    </button>
                )}

                {/* ROUTE DEFINITIONS */}
                <Routes>
                    {/* Home/Sweets Route (Requires Login) */}
                    <Route 
                        path="/" 
                        element={
                            loggedIn 
                                ? <Sweets isAdmin={isAdmin} /> 
                                : <Navigate to="/login" /> // Redirect to login if not logged in
                        } 
                    />
                    
                    {/* Login Route (If logged in, redirects to home) */}
                    <Route 
                        path="/login" 
                        element={
                            loggedIn 
                                ? <Navigate to="/" /> 
                                : <Login onLoginSuccess={handleLoginSuccess} /> // <-- Pass only the login handler
                        } 
                    />
                    
                    {/* Register Route (If logged in, redirects to home) */}
                    <Route 
                        path="/register" 
                        element={
                            loggedIn 
                                ? <Navigate to="/" /> 
                                : <Register /> // <-- Register component is standalone
                        } 
                    />

                </Routes>
            </div>
        </BrowserRouter>
    );
}