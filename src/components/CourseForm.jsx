import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { ArrowLeft, Save, X } from 'lucide-react';

const CourseForm = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user, accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: false
  });

  const isEdit = Boolean(courseId);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
      navigate('/');
      return;
    }

    if (isEdit) {
      fetchCourse();
    }
  }, [user, navigate, courseId, isEdit]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.get(`${API_ENDPOINTS.COURSES}/${courseId}`, { headers });
      const course = response.data.data || response.data;
      setFormData({
        title: course.title || '',
        description: course.description || '',
        isPublished: course.isPublished || false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      
      if (isEdit) {
        await axios.put(`${API_ENDPOINTS.COURSES}/${courseId}`, formData, { headers });
      } else {
        await axios.post(API_ENDPOINTS.COURSES, formData, { headers });
      }
      
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading course..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Admin</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update course information' : 'Add a new course to the platform'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <X className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter course title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Enter course description"
              />
            </div>

            {/* Published Status */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-3 block text-sm font-medium text-gray-700">
                Publish this course
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
              >
                {saving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? 'Saving...' : (isEdit ? 'Update Course' : 'Create Course')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
