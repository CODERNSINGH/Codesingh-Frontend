import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  FileText, 
  Trophy, 
  Menu, 
  X, 
  Play,
  ChevronRight,
  Clock,
  Users,
  BarChart3,
  Target,
  ArrowLeft,
  AlertCircle,
  Radio
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import ComingSoon from './ComingSoon';
import OnlineCompiler from './OnlineCompiler';
// import AddLectureForm from './AddLectureForm';
import { API_ENDPOINTS } from '../config/api';

const CourseDashboard = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonConfig, setComingSoonConfig] = useState({});
  const [activeMainTab, setActiveMainTab] = useState('lectures');

  // Lock body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [sidebarOpen]);

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseResponse, lecturesResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.COURSE_DETAIL(courseId)),
        axios.get(API_ENDPOINTS.COURSE_LECTURES(courseId))
      ]);
      
      setCourse(courseResponse.data);
      setLectures(lecturesResponse.data);
      setServerConnected(true);
    } catch (err) {
      console.error('Error fetching course data:', err);
      setServerConnected(false);
      setError('Server connection failed. Cannot access course content.');
    } finally {
      setLoading(false);
    }
  };

  const handleLectureClick = (lectureId) => {
    if (!serverConnected) {
      alert('Cannot access lectures while offline. Please connect to the server first.');
      return;
    }
    navigate(`/course/${courseId}/lecture/${lectureId}`);
  };

  const handleSidebarItemClick = (item) => {
    if (item.label === 'Lectures') {
      setActiveMainTab('lectures');
      return;
    }
    if (item.label === 'Online Compiler') {
      setActiveMainTab('compiler');
      return;
    }
    // Show coming soon for other features
    // setComingSoonConfig({
    //   title: `${item.label} Coming Soon`,
    //   description: `The ${item.label.toLowerCase()} feature is under development and will be available soon!`
    // });
    // setShowComingSoon(true);
  };

  const sidebarItems = [
    { icon: BookOpen, label: 'Lectures', color: 'blue', count: lectures.length },
    { icon: Code, label: 'Online Compiler', color: 'green', count: 0 },
    { icon: FileText, label: 'Assignments', color: 'purple', count: 0 },
    { icon: Trophy, label: 'Contests', color: 'amber', count: 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading course content..." />
      </div>
    );
  }

  if (!serverConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Server Connection Failed</h3>
          <p className="text-gray-600 text-lg mb-6">
            Cannot access course content while offline. Please connect to the server first.
          </p>
          <div className="space-y-3">
            <button
              onClick={fetchCourseData}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Try Connecting Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Course not found</h3>
          <p className="text-gray-600 text-lg mb-6">The course you are looking for does not exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // Separate live lectures
  const liveLectures = lectures.filter(l => l.lecture_type === 'Live');
  const recordedLectures = lectures.filter(l => l.lecture_type !== 'Live');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Course Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Courses</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 truncate max-w-md">
              {course.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-[100] w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            {/* Course Info */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{course.title}</h2>
                  <p className="text-sm text-gray-500">Course Dashboard</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-3">
                {sidebarItems.map((item) => {
                  const colorClasses = {
                    blue: 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm',
                    green: 'bg-green-50 text-green-700 border-green-200 shadow-sm',
                    purple: 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm',
                    amber: 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm',
                  };

                  const iconColorClasses = {
                    blue: 'text-blue-600',
                    green: 'text-green-600',
                    purple: 'text-purple-600',
                    amber: 'text-amber-600',
                  };

                  // Highlight active tab
                  const isActive = (activeMainTab === 'lectures' && item.label === 'Lectures') || (activeMainTab === 'compiler' && item.label === 'Online Compiler');

                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => handleSidebarItemClick(item)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 border
                          ${isActive
                            ? colorClasses[item.color]
                            : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200 hover:shadow-sm'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className={`h-5 w-5 ${isActive ? iconColorClasses[item.color] : 'text-gray-500'}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.count > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              isActive 
                                ? 'bg-white/70 text-gray-700' 
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {item.count}
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Course Stats */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-700 font-medium">Your Progress</span>
                  <span className="font-bold text-gray-900">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-xs text-gray-600 text-center">
                  Start learning to track your progress
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeMainTab === 'lectures' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-6">
                    {/* <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div> */}
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Course Lectures</h2>
                      <p className="text-gray-600 text-lg">Master the concepts step by step</p>
                    </div>
                  </div>
                  
                  {/* Course Stats Cards */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Lectures</p>
                          <p className="text-2xl font-bold text-gray-900">{lectures.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Target className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Your Progress</p>
                          <p className="text-2xl font-bold text-gray-900">0%</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Difficulty</p>
                          <p className="text-2xl font-bold text-gray-900">{course.level || 'Beginner'}</p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Live Lectures Section */}
                {liveLectures.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <Radio className="h-4 w-4 text-white animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Live Sessions</h3>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        {liveLectures.length} Active
                      </span>
                    </div>
                    <div className="space-y-4">
                      {liveLectures.map((lecture, idx) => (
                        <div
                          key={lecture.id}
                          onClick={() => handleLectureClick(lecture.id)}
                          className="group bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-200 p-6 hover:border-red-400 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                        >
                          {/* Live indicator with animation */}
                          <div className="absolute top-4 right-4 flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow-sm">
                              LIVE
                            </span>
                          </div>
                          
                          {/* Subtle background animation */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="flex items-start space-x-4 relative z-10">
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Radio className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors line-clamp-2">
                                {lecture.title}
                              </h4>
                              <div className="text-sm text-red-600 font-medium mb-2">{lecture.topic}</div>
                              <p className="text-gray-700 text-sm mb-3 line-clamp-2 leading-relaxed">
                                {lecture.description}
                              </p>
                              <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4" />
                                  <span>Started {lecture.upload_date ? new Date(lecture.upload_date).toLocaleString() : 'recently'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4" />
                                  <span className="text-red-600 font-medium">Join Live Session</span>
                                </div>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recorded Lectures Section */}
                {recordedLectures.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Course Content</h3>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {recordedLectures.length} Lectures
                      </span>
                    </div>
                    <div className="space-y-4">
                      {recordedLectures.map((lecture, index) => (
                        <div
                          key={lecture.id}
                          onClick={() => handleLectureClick(lecture.id)}
                          className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                              <span className="text-white font-bold text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {lecture.title}
                              </h4>
                              <div className="text-sm text-blue-600 font-medium mb-2">{lecture.topic}</div>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                                {lecture.description}
                              </p>
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{lecture.upload_date ? new Date(lecture.upload_date).toLocaleString() : `Lecture ${lecture.order}`}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4" />
                                  <span>Self-paced</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-sm">
                                <Play className="h-6 w-6 text-white ml-0.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {lectures.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">No lectures available yet</h3>
                    <p className="text-gray-600 text-lg">Lectures will be added soon! Check back later.</p>
                  </div>
                )}
            </div>
          )}
          {activeMainTab === 'compiler' && (
            <div className="w-full h-full flex items-center justify-center bg-transparent">
              <div className="w-full h-full"><OnlineCompiler /></div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[90] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <ComingSoon 
          {...comingSoonConfig} 
          onClose={() => setShowComingSoon(false)} 
        />
      )}
    </div>
  );
};

export default CourseDashboard;