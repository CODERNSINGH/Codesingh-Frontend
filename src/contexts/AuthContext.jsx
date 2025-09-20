import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData && userData !== 'undefined' && userData !== 'null') {
      setAccessToken(token);
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('AuthContext - error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
