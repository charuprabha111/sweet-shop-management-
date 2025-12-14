// frontend/src/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from './api';

// ✅ SAME IMAGE USED IN LOGIN
import sweetImg from './sweet.jpg';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return;
        }

        try {
            await registerUser(formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Registration failed. Try another username.');
        }
    };

    return (
        <div style={styles.loginContainer}>

            {/* LEFT SIDE */}
            <div style={styles.loginFormWrapper}>
                <h2 style={styles.title}>Create Your Account</h2>
                <p style={styles.subtitle}>Join the Candy Stop!</p>

                {success ? (
                    <p style={styles.successText}>{success}</p>
                ) : (
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

                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
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

                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />

                        {error && <p style={styles.errorText}>{error}</p>}

                        <button type="submit" style={styles.signInButton}>
                            Sign Up
                        </button>
                    </form>
                )}

                <p style={{ marginTop: '20px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'orange', fontWeight: 'bold' }}>
                        Login here
                    </Link>
                </p>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div style={styles.imageColumn}>
                <div style={styles.imageOverlay}>
                    <h2 style={styles.imageTitle}>Morning Rise</h2>
                    <h1 style={styles.imageSlogan}>Indulge Your Sweet Candy Tooth!</h1>
                    <p style={styles.imageText}>
                        Discover the perfect harmony of classic candies and craft coated almonds.
                    </p>
                    <div style={styles.divider}></div>
                </div>

                <Link to="/" style={styles.backButton}>
                    Back to Home →
                </Link>
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
        backgroundColor: '#1e1e1e',
        padding: '50px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
    },
    title: {
        marginBottom: '10px',
    },
    subtitle: {
        color: '#aaa',
        marginBottom: '30px',
    },
    form: {
        width: '100%',
        maxWidth: '350px',
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginTop: '15px',
        fontWeight: 'bold',
    },
    input: {
        padding: '12px',
        marginTop: '5px',
        borderRadius: '5px',
        border: '1px solid #444',
        backgroundColor: '#111',
        color: 'white',
    },
    signInButton: {
        marginTop: '25px',
        padding: '15px',
        backgroundColor: 'orange',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    errorText: {
        color: 'red',
        marginTop: '10px',
    },
    successText: {
        color: 'lightgreen',
        fontSize: '1.1em',
    },

    imageColumn: {
        flex: 1,
        backgroundImage: `url(${sweetImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px',
    },
    imageOverlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '25px',
        borderRadius: '8px',
        maxWidth: '80%',
    },
    imageTitle: {
        color: '#ccc',
    },
    imageSlogan: {
        color: 'orange',
        fontSize: '2em',
    },
    imageText: {
        color: '#ddd',
    },
    divider: {
        width: '50px',
        height: '2px',
        backgroundColor: 'orange',
        marginTop: '10px',
    },
    backButton: {
        alignSelf: 'flex-end',
        color: 'orange',
        textDecoration: 'none',
        backgroundColor: '#1e1e1e',
        padding: '8px 15px',
        borderRadius: '5px',
        fontWeight: 'bold',
    },
};
