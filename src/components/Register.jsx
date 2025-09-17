import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { API_ENDPOINTS } from '../config/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_ENDPOINTS.REGISTER}`, {
        username,
        email,
        password,
      });
      setSuccess('Registration successful! You can now login.');
      setUsername('');
      setEmail('');
      setPassword('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96 animate-fade-in">
        <h2 className="text-3xl mb-6 font-extrabold text-center text-blue-700">Create Account</h2>
        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="pl-10 w-full p-3 border rounded-lg focus:outline-blue-500 focus:ring-2 focus:ring-blue-200"
            required
            autoFocus
          />
        </div>
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="pl-10 w-full p-3 border rounded-lg focus:outline-blue-500 focus:ring-2 focus:ring-blue-200"
            required
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
        {success && <div className="flex items-center justify-center text-green-600 mb-3"><span className="mr-2">✅</span>{success}</div>}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? <span className="flex items-center justify-center"><ClipLoader size={20} color="#fff" className="mr-2" /> Registering...</span> : 'Sign Up'}
        </button>
        <div className="mt-5 text-center">
          <span>Already have an account? </span>
          <button type="button" className="text-blue-600 underline font-semibold" onClick={() => navigate('/login')}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
