import React from "react";
import "./loginPage.css";
import "/fonts/ubuntu.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch('http://localhost:5001/api/v1/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            console.log("Login successful:", data);
            // Store the token in local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);

            // Redirect to the jobs page
            navigate("/jobs");
        } catch (error) {
            console.error("Error during login:", error);
            setError("An unexpected error occurred");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2 className="login-title ubuntu-medium">Login</h2>

                <input 
                    type="text"
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="login-input ubuntu-regular-italic"
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input ubuntu-regular-italic"
                />

                <button className="login-button ubuntu-regular" onClick={handleSubmit}>Login</button>

                {error && <p className="login-error ubuntu-regular-italic">{error}</p>}
            </div>
        </div>
    );
}
