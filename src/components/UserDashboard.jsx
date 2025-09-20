import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { AuthContext } from '../contexts/AuthContext.jsx';

const UserDashboard = () => {
  const { user, accessToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.USERS, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Access denied. Admins only.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDashboard;
