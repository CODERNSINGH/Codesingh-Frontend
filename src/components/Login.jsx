import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { API_ENDPOINTS } from '../config/api';
import { AuthContext } from '../contexts/AuthContext';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH_LOGIN,
        { email: username, password }
      );
      // Backend returns: { success: true, message: "...", data: { accessToken, refreshToken, user } }
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      const { accessToken, refreshToken, user } = response.data.data;
      
      if (!accessToken || !user) {
        throw new Error('Invalid response from server');
      }
      
      // Use AuthContext login function to update state
      login(accessToken, user);
      
      // Also store refresh token separately
      localStorage.setItem('refreshToken', refreshToken);
      
      if (onLogin) onLogin(accessToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96 animate-fade-in">
        <h2 className="text-3xl mb-6 font-extrabold text-center text-blue-700">Welcome Back</h2>
        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="pl-10 w-full p-3 border rounded-lg focus:outline-blue-500 focus:ring-2 focus:ring-blue-200"
            required
            autoFocus
          />
        </div>
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pl-10 pr-10 w-full p-3 border rounded-lg focus:outline-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
          <button type="button" className="absolute right-3 top-3 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <div className="flex items-center justify-center text-red-500 mb-3"><span className="mr-2">❌</span>{error}</div>}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? <span className="flex items-center justify-center"><ClipLoader size={20} color="#fff" className="mr-2" /> Logging in...</span> : 'Login'}
        </button>
        <div className="mt-5 text-center">
          <span>Don't have an account? </span>
          <button type="button" className="text-blue-600 underline font-semibold" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
