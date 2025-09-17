import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Users, AlertCircle } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { API_ENDPOINTS } from '../config/api';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [serverConnected, setServerConnected] = useState(false);
  const navigate = useNavigate();

  // Fake data for when server is not connected
  const fakeCourses = [
    {
      id: 1,
      title: "DSA - Using Python",
      startedDate: "15 Jan 2024, 10:00 am",
      status: "Enrolled",
      image: "dsa",
      buttonStyle: "primary"
    },
    {
      id: 2,
      title: "AI and ML - Machine Learning",
      startedDate: "20 Jan 2024, 2:30 pm",
      status: "Enrolled",
      image: "ai-ml"
    },
    {
      id: 3,
      title: "Full Stack Web Development",
      startedDate: "25 Jan 2024, 11:15 am",
      status: "Enrolled",
      image: "webdev"
    }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to fetch courses from server...');
      const response = await axios.get(API_ENDPOINTS.COURSES, {
        timeout: 10000 // 10 second timeout for hosted server
      });
      console.log('Server response:', response.data);


      // Transform the server data to match our expected format
      const transformedCourses = response.data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        startedDate: "Recently Added",
        status: "Available",
        image: course.thumbnail ? course.thumbnail : getCourseImageType(course.title),
        buttonStyle: "primary"
      }));

      console.log('Transformed courses:', transformedCourses);
      setCourses(transformedCourses);
      setServerConnected(true);
      console.log('Server connected successfully!');
    } catch (err) {
      console.error('Error fetching courses:', err);
      console.error('Error details:', err.response?.data || err.message);
      // Use fake data when server is not connected
      setCourses(fakeCourses);
      setServerConnected(false);
      setError('Server connection failed - showing offline courses');
    } finally {
      setLoading(false);
    }
  };

  const getCourseImageType = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('dsa') || lowerTitle.includes('data structure')) {
      return 'dsa';
    } else if (lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('machine learning')) {
      return 'ai-ml';
    } else if (lowerTitle.includes('full stack') || lowerTitle.includes('web development')) {
      return 'webdev';
    } else {
      return 'python';
    }
  };

  const handleCourseClick = (courseId) => {
    if (!serverConnected) {
      // Show error message when trying to access courses offline
      alert('Cannot access courses while offline. Please connect to the server first.');
      return;
    }
    navigate(`/course/${courseId}`);
  };

  const getCourseImage = (imageType) => {
    const images = {
      dsa: "bg-gradient-to-br from-green-400 to-blue-500",
      "ai-ml": "bg-gradient-to-br from-purple-400 to-pink-500",
      webdev: "bg-gradient-to-br from-orange-400 to-red-500",
      python: "bg-gradient-to-br from-blue-400 to-cyan-500",
      cpp: "bg-gradient-to-br from-green-400 to-teal-500",
      "newton-dark": "bg-gradient-to-br from-gray-800 to-gray-900",
      "newton-placement": "bg-gradient-to-br from-indigo-400 to-purple-500",
      psp: "bg-gradient-to-br from-orange-400 to-red-500",
      newton: "bg-gradient-to-br from-teal-400 to-blue-500"
    };
    return images[imageType] || "bg-gradient-to-br from-gray-400 to-gray-500";
  };

  const getCourseIcon = (imageType) => {
    const icons = {
      dsa: "📊",
      "ai-ml": "🤖",
      webdev: "🌐",
      python: "🔷",
      cpp: "⚙️",
      "newton-dark": "🎓",
      "newton-placement": "💼",
      psp: "📚",
      newton: "🎓"
    };
    return icons[imageType] || "📖";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Connecting to server..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner for server connection */}
        {serverConnected && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Server Connected Successfully
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  You can now access all course content and features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner for offline mode */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Server Connection Failed
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}. Some features may not work properly.
                </p>
                <button
                  onClick={fetchCourses}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
                >
                  Try connecting again →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'current'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Current Course
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'past'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Past Courses
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group ${!serverConnected ? 'opacity-75' : ''
                }`}
            >
              {/* Course Image */}
              <div
                className="h-32 relative flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${course.image})` }}
              >
                {/* <div className="text-4xl">{getCourseIcon(course.image)}</div> */}
              

              {/* Profile Picture Overlay */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xs font-medium text-gray-700">JD</span>
              </div>
            </div>

              {/* Course Content */ }
            < div className = "p-4" >
                <div className="text-xs text-gray-500 mb-2">
                  {serverConnected ? 'AVAILABLE' : 'STARTED'}: {course.startedDate}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                <div className="text-sm text-gray-600 mb-4">
                  {course.status}
                </div>

                {/* Continue Learning Button */ }
            < button
                  className = {`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${course.buttonStyle === 'primary'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : course.buttonStyle === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
                >
          {!serverConnected ? 'Coming Soon' : 'Continue Learning'} <ChevronRight className="inline h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  ))
}
        </div >

  {/* Empty State */ }
{
  courses.length === 0 && !loading && (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">No courses available</h3>
      <p className="text-gray-600 text-lg">Start your learning journey by enrolling in a course.</p>
    </div>
  )
}
      </div >
    </div >
  );
};

export default HomePage; 