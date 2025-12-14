// frontend/src/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from './api';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '', // For password confirmation
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
            setError('Passwords do not match.');
            return;
        }

        try {
            // ================================================
            // *** CRITICAL FIX: Passing the full formData object. ***
            // ================================================
            await registerUser(formData); 
            
            setSuccess('Registration successful! Redirecting to login...');
            
            // Clear form data after success
            setFormData({ username: '', email: '', password: '', password2: '' }); 
            
            // Redirect to the login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (e) {
            // Display error from the backend (e.g., username already taken or "This field is required")
            setError(e.message || 'Registration failed. Please check server logs.');
        }
    };

    return (
        <div style={styles.loginContainer}>
            
            {/* LEFT SIDE: Register Form (Dark Background) */}
            <div style={styles.loginFormWrapper}>
                
                <h2 style={styles.title}>Create Your Account</h2>
                <p style={styles.subtitle}>
                    Join the Candy Stop! Fill out the details below.
                </p>

                {success ? (
                    <div style={styles.successBox}>
                        <p>{success}</p>
                        <Link to="/login" style={styles.successLink}>Click here to Login immediately</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        
                        {/* Username Input */}
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your desired username"
                            required
                            style={styles.input}
                        />

                        {/* Email Input */}
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            required
                            style={styles.input}
                        />
                        
                        {/* Password Input */}
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            style={styles.input}
                        />

                        {/* Confirm Password Input */}
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            style={styles.input}
                        />

                        {error && <p style={styles.errorText}>{error}</p>}

                        {/* Sign Up Button */}
                        <button type="submit" style={styles.signInButton}>
                            Sign Up
                        </button>
                    </form>
                )}


                <p style={{ marginTop: '20px' }}>
                    Already have an account? 
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Login here</Link>
                </p>

            </div>

            {/* RIGHT SIDE: Image/Marketing Column (Same as Login) */}
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
                <Link to="/" style={styles.backButton}>
                    Back to Home →
                </Link>
            </div>
        </div>
    );
}

// 2. STYLES (Copied from Login.jsx for consistency)
const styles = {
    loginContainer: {
        display: 'flex',
        minHeight: '80vh',
        maxWidth: '1000px',
        margin: '50px auto',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
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
        marginBottom: '5px',
    },
    subtitle: {
        color: '#999',
        fontSize: '0.9em',
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
        marginBottom: '5px',
        marginTop: '15px',
    },
    input: {
        width: '100%',
        padding: '12px 10px',
        backgroundColor: 'var(--color-background)', 
        border: '1px solid #444',
        color: 'var(--color-text-light)',
        borderRadius: '5px',
        boxSizing: 'border-box',
    },
    signInButton: { // Used for "Sign Up" here
        width: '100%',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-background)',
        padding: '15px',
        fontWeight: 'bold',
        borderRadius: '5px',
        marginTop: '20px',
        marginBottom: '10px',
        border: 'none',
    },
    errorText: {
        color: 'var(--color-danger)',
        marginTop: '10px',
    },
    imageColumn: {
        flex: 1,
        backgroundColor: '#f5f5f5', 
        backgroundImage: 'url(sweet_shop_side_image.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px',
        color: 'white', 
    },
    imageOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        padding: '20px',
        borderRadius: '5px',
        alignSelf: 'flex-end',
        textAlign: 'left',
        maxWidth: '80%',
        marginTop: 'auto', 
    },
    imageTitle: {
        color: '#ccc',
        fontSize: '1em',
        fontWeight: 'normal',
        margin: '0 0 5px 0',
    },
    imageSlogan: {
        fontSize: '2em',
        color: 'var(--color-primary)', 
        margin: '5px 0 15px 0',
    },
    imageText: {
        color: '#ddd',
        fontSize: '0.9em',
        lineHeight: 1.5,
        marginBottom: '10px',
    },
    divider: {
        width: '50px',
        height: '2px',
        backgroundColor: 'var(--color-primary)',
        margin: '10px 0',
    },
    backButton: {
        alignSelf: 'flex-end',
        color: 'var(--color-primary)',
        textDecoration: 'none',
        fontWeight: 'bold',
        backgroundColor: 'var(--color-surface)',
        padding: '8px 15px',
        borderRadius: '5px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    // Styles for success message
    successBox: {
        backgroundColor: 'rgba(50, 205, 50, 0.2)', // Light green tint
        border: '1px solid limegreen',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '350px',
        color: 'white',
        margin: '20px 0',
        textAlign: 'center',
    },
    successLink: {
        color: 'var(--color-primary)',
        fontWeight: 'bold',
        marginTop: '10px',
        display: 'block',
        textDecoration: 'none',
    },
};