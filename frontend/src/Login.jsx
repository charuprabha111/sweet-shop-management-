import React, { useState } from 'react';
import { loginUser } from './api';
import { Link } from 'react-router-dom';

// ✅ IMAGE IS IN src/sweet.jpg (same folder level)
import sweetImg from './sweet.jpg';

export default function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await loginUser(formData);
            onLoginSuccess(response.is_admin);
        } catch (e) {
            setError(e.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={styles.loginContainer}>

            {/* LEFT SIDE */}
            <div style={styles.loginFormWrapper}>
                <h2 style={styles.title}>Welcome to Candy Stop</h2>
                <p style={styles.subtitle}>
                    Please enter your username and password to sign in.
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <button type="submit" style={styles.signInButton}>
                        Sign In
                    </button>

                    {error && <p style={styles.errorText}>{error}</p>}
                </form>

                <p style={{ marginTop: '20px' }}>
                    Don’t have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                        Register
                    </Link>
                </p>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div style={styles.imageColumn}>
                <div style={styles.imageOverlay}>
                    <h2 style={styles.imageTitle}>Morning Rise</h2>
                    <h1 style={styles.imageSlogan}>Indulge Your Sweet Candy Tooth!</h1>
                    <p style={styles.imageText}>
                        Discover the perfect harmony of classic candies and craft coated almonds,
                        wrapped to ensure a sweet sugar rush.
                    </p>
                    <div style={styles.divider}></div>
                </div>
            </div>
        </div>
    );
}

/* ================= STYLES ================= */

const styles = {
    loginContainer: {
        display: 'flex',
        minHeight: '80vh',
        maxWidth: '1000px',
        margin: '50px auto',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    },
    loginFormWrapper: {
        flex: 1,
        backgroundColor: 'var(--color-surface)',
        padding: '50px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        color: 'var(--color-text-light)',
    },
    subtitle: {
        color: '#999',
        marginBottom: '30px',
    },
    form: {
        width: '100%',
        maxWidth: '350px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    label: {
        color: 'var(--color-text-light)',
        fontWeight: 'bold',
        marginTop: '15px',
    },
    input: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'var(--color-background)',
        border: '1px solid #444',
        color: 'var(--color-text-light)',
        borderRadius: '5px',
    },
    signInButton: {
        width: '100%',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-background)',
        padding: '15px',
        fontWeight: 'bold',
        borderRadius: '5px',
        border: 'none',
        marginTop: '20px',
    },
    errorText: {
        color: 'var(--color-danger)',
        marginTop: '10px',
    },

    /* IMAGE COLUMN */
    imageColumn: {
        flex: 1,
        backgroundImage: `url(${sweetImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '30px',
    },
    imageOverlay: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        padding: '25px',
        borderRadius: '8px',
        maxWidth: '85%',
    },
    imageTitle: {
        color: '#ccc',
        fontSize: '1em',
    },
    imageSlogan: {
        fontSize: '2em',
        color: 'var(--color-primary)',
    },
    imageText: {
        color: '#ddd',
        fontSize: '0.9em',
    },
    divider: {
        width: '50px',
        height: '2px',
        backgroundColor: 'var(--color-primary)',
        marginTop: '10px',
    },
};
