"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // On initial load, try to get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // You might want to redirect to login page here
    };
    
    // Function to check permission
    const hasPermission = (functionId) => {
        if (!user || !user.authorizedFunctions) {
            return false;
        }
        return user.authorizedFunctions.includes(functionId);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily access the context
export const useAuth = () => {
    return useContext(AuthContext);
};