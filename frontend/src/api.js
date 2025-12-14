// frontend/src/api.js

const API_BASE = "http://127.0.0.1:8000/api";

// Helper function to get token from localStorage
function getToken() {
    return localStorage.getItem("token");
}

/**
 * Parses a non-ok response body. Tries to get JSON, but falls back to text.
 * Throws a standardized Error object.
 */
async function handleApiError(response, defaultMessage) {
    let errorData;
    let message = defaultMessage;

    try {
        errorData = await response.json();
    } catch (e) {
        // If it's not JSON (i.e., HTML page), throw a clear error.
        throw new Error(`API call failed with status ${response.status} and returned non-JSON data. Check backend console and URL.`);
    }

    // Attempt to extract detailed message from common Django/DRF fields
    if (errorData.detail) {
        message = errorData.detail;
    } else if (errorData.username) {
        message = `Username error: ${errorData.username[0]}`;
    } else if (errorData.password) {
        message = `Password error: ${errorData.password[0]}`;
    } else if (errorData.email) {
        message = `Email error: ${errorData.email[0]}`;
    }
    
    // Fallback to the status text if no detail is provided
    throw new Error(message);
}


// ===================================
// AUTHENTICATION
// ===================================

// LOGIN - ROBUST ERROR HANDLING
export async function loginUser({ username, password }) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        await handleApiError(res, "Login failed. Check credentials.");
    }
    
    const json = await res.json();

    // Store token on successful login
    if (json.access) {
        localStorage.setItem("token", json.access);
    }

    return json;
}

// REGISTER - ROBUST ERROR HANDLING
export async function registerUser({ username, email, password, password2 }) {
    const response = await fetch(`${API_BASE}/auth/register/`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, password2 }),
    });

    if (!response.ok) {
        await handleApiError(response, "Registration failed.");
    }
    
    // If successful, the backend might return the user or a success message
    return true; 
}


// ===================================
// CRUD (CREATE, READ, UPDATE, DELETE) & SEARCH
// ===================================

// GET SWEETS (READ All)
export async function getSweets() {
    const token = getToken();

    const res = await fetch(`${API_BASE}/sweets/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        await handleApiError(res, "Failed to fetch sweets.");
    }

    return await res.json();
}

// CREATE SWEET (POST)
export async function createSweet(sweetData) {
    const token = getToken();

    if (!token) {
        throw new Error("Authentication token missing. Please log in.");
    }

    const res = await fetch(`${API_BASE}/sweets/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(sweetData),
    });

    if (!res.ok) {
        await handleApiError(res, "Failed to create sweet.");
    }

    return await res.json();
}

// UPDATE SWEET (PUT)
export async function updateSweet(id, sweetData) {
    const token = getToken();

    if (!token) {
        throw new Error("Authentication token missing. Please log in.");
    }

    const res = await fetch(`${API_BASE}/sweets/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(sweetData),
    });

    if (!res.ok) {
        await handleApiError(res, "Failed to update sweet.");
    }

    return await res.json();
}

// DELETE SWEET
export async function deleteSweet(id) {
    const token = getToken();

    if (!token) {
        throw new Error("Authentication token missing. Please log in.");
    }

    const res = await fetch(`${API_BASE}/sweets/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (res.status === 204) {
        return true; // 204 No Content is standard for successful deletion
    }
    
    if (!res.ok) {
        await handleApiError(res, "Failed to delete sweet.");
    }
}

// SEARCH SWEETS
export async function searchSweets(query) {
    const token = getToken();
    
    // CORRECT: Uses the base endpoint and standard DRF 'search' parameter.
    const url = `${API_BASE}/sweets/?search=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        await handleApiError(res, "Failed to perform search.");
    }

    return await res.json();
}

// ===================================
// INVENTORY MANAGEMENT
// ===================================

// PURCHASE SWEET (Decrement by 1)
export async function purchaseSweet(id) {
    const token = getToken();
    if (!token) throw new Error("Authentication token missing.");

    const res = await fetch(`${API_BASE}/sweets/${id}/purchase/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            // FINAL FIX: Removed Content-Type and body to prevent 400 Bad Request on empty payload.
        },
    });

    if (!res.ok) {
        await handleApiError(res, "Purchase failed. Sweet may be out of stock or ID is invalid.");
    }

    return true; // Assuming a successful status code means success
}

// RESTOCK SWEET (Increment by amount)
export async function restockSweet(id, amount) {
    const token = getToken();
    if (!token) throw new Error("Authentication token missing.");

    const res = await fetch(`${API_BASE}/sweets/${id}/restock/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amount }),
    });

    if (!res.ok) {
        await handleApiError(res, "Restock failed.");
    }

    return true; // Assuming a successful status code means success
}