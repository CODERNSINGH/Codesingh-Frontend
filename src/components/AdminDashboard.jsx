import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BarChart3,
  Play,
  FileText,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      
      const [coursesResponse, lecturesResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.COURSES, { headers }),
        axios.get(API_ENDPOINTS.LECTURES, { headers })
      ]);

      setCourses(coursesResponse.data.data || coursesResponse.data || []);
      setLectures(lecturesResponse.data.data || lecturesResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      await axios.delete(`${API_ENDPOINTS.COURSES}/${courseId}`, { headers });
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('Are you sure you want to delete this lecture? This action cannot be undone.')) {
      return;
    }

    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      await axios.delete(`${API_ENDPOINTS.LECTURES}/${lectureId}`, { headers });
      setLectures(lectures.filter(l => l.id !== lectureId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete lecture');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading admin dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { name: 'Total Courses', value: courses.length, icon: BookOpen, color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { name: 'Total Lectures', value: lectures.length, icon: Play, color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { name: 'Published Courses', value: courses.filter(c => c.isPublished).length, icon: BarChart3, color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    { name: 'Live Lectures', value: lectures.filter(l => l.lectureType === 'Live').length, icon: FileText, color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage courses, lectures, and content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'courses', name: 'Courses', icon: BookOpen },
                { id: 'lectures', name: 'Lectures', icon: Play },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your course content and settings</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/courses/new')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Course</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lectures
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{course.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              course.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lectures.filter(l => l.courseId === course.id).length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Course"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                title="View Course"
                              >
                                <Play className="h-4 w-4" />
                              </button>
                              {user.role === 'admin' && (
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Course"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lectures Tab */}
            {activeTab === 'lectures' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Lectures</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage lecture content, videos, and questions</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/lectures/new')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Lecture</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lectures.map((lecture) => {
                        const course = courses.find(c => c.id === lecture.courseId);
                        return (
                          <tr key={lecture.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{lecture.title}</div>
                              <div className="text-sm text-gray-500">{lecture.topic}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {course ? course.title : 'Unknown Course'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                lecture.lectureType === 'Live' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {lecture.lectureType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lecture.order}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => navigate(`/admin/lectures/${lecture.id}/edit`)}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Lecture"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => navigate(`/course/${lecture.courseId}/lecture/${lecture.id}`)}
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                  title="View Lecture"
                                >
                                  <Play className="h-4 w-4" />
                                </button>
                                {user.role === 'admin' && (
                                  <button
                                    onClick={() => handleDeleteLecture(lecture.id)}
                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Lecture"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
