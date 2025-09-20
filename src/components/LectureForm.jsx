import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';

const LectureForm = () => {
  const navigate = useNavigate();
  const { lectureId, courseId } = useParams();
  const { user, accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    description: '',
    lectureType: 'Recorded',
    youtubeUrl: '',
    order: 1,
    courseId: courseId || '',
    questions: [''],
    code: ''
  });

  const isEdit = Boolean(lectureId);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
      navigate('/');
      return;
    }

    fetchCourses();
    if (isEdit) {
      fetchLecture();
    }
  }, [user, navigate, lectureId, isEdit]);

  const fetchCourses = async () => {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.get(API_ENDPOINTS.COURSES, { headers });
      setCourses(response.data.data || response.data || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const fetchLecture = async () => {
    try {
      setLoading(true);
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.get(`${API_ENDPOINTS.LECTURES}/${lectureId}`, { headers });
      const lecture = response.data.data || response.data;
      setFormData({
        title: lecture.title || '',
        topic: lecture.topic || '',
        description: lecture.description || '',
        lectureType: lecture.lectureType || 'Recorded',
        youtubeUrl: lecture.youtubeUrl || '',
        order: lecture.order || 1,
        courseId: lecture.courseId || courseId || '',
        questions: lecture.questions && lecture.questions.length > 0 ? lecture.questions : [''],
        code: lecture.code || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lecture');
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
      
      // Filter out empty questions
      const filteredQuestions = formData.questions.filter(q => q.trim() !== '');
      
      const submitData = {
        title: formData.title,
        topic: formData.topic,
        description: formData.description,
        lectureType: formData.lectureType,
        youtubeUrl: formData.youtubeUrl,
        questions: filteredQuestions,
        code: formData.code,
        order: parseInt(formData.order)
      };

      if (isEdit) {
        await axios.put(`${API_ENDPOINTS.LECTURES}/${lectureId}`, submitData, { headers });
      } else {
        await axios.post(`${API_ENDPOINTS.COURSES}/${formData.courseId}/lectures`, submitData, { headers });
      }
      
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lecture');
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

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        questions: newQuestions
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading lecture..." />
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
            {isEdit ? 'Edit Lecture' : 'Create New Lecture'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update lecture information' : 'Add a new lecture to a course'}
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

            {/* Course Selection (only for new lectures) */}
            {!isEdit && (
              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Lecture Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter lecture title"
              />
            </div>

            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter lecture topic"
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
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter lecture description"
              />
            </div>

            {/* Lecture Type and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lectureType" className="block text-sm font-medium text-gray-700 mb-2">
                  Lecture Type *
                </label>
                <select
                  id="lectureType"
                  name="lectureType"
                  value={formData.lectureType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Recorded">Recorded</option>
                  <option value="Live">Live</option>
                </select>
              </div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                  Order *
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* YouTube URL */}
            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Practice Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Practice Questions
              </label>
              <div className="space-y-3">
                {formData.questions.map((question, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Question ${index + 1}`}
                    />
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {/* Code Example */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Code Example
              </label>
              <textarea
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Enter code example..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? 'Saving...' : (isEdit ? 'Update Lecture' : 'Create Lecture')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LectureForm;
