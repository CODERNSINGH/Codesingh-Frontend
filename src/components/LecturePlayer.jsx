import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const LecturePlayer = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);
  const [lecture, setLecture] = useState(null);
  const [course, setCourse] = useState(null);
  const [allLectures, setAllLectures] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverConnected, setServerConnected] = useState(false);

  useEffect(() => {
    fetchLectureData();
  }, [courseId, lectureId]);

  const fetchLectureData = async () => {
    try {
      setLoading(true);
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const [lectureResponse, courseResponse, lecturesResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.LECTURE_DETAIL(lectureId), { headers }),
        axios.get(API_ENDPOINTS.COURSE_DETAIL(courseId), { headers }),
        axios.get(API_ENDPOINTS.COURSE_LECTURES(courseId), { headers })
      ]);
      
      // Extract data from API response format: { success: true, data: {...} }
      const lectureData = lectureResponse.data.data || lectureResponse.data;
      const courseData = courseResponse.data.data || courseResponse.data;
      const lecturesData = lecturesResponse.data.data || lecturesResponse.data || [];
      
      setLecture(lectureData);
      setCourse(courseData);
      setAllLectures(lecturesData);
      setServerConnected(true);
      
      const index = lecturesData.findIndex(l => l.id === lectureId);
      setCurrentIndex(index >= 0 ? index : 0);
    } catch (err) {
      setServerConnected(false);
      setError(err.response?.data?.message || 'Server connection failed. Cannot access lecture content.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLecture = (direction) => {
    if (!serverConnected) {
      alert('Cannot navigate lectures while offline. Please connect to the server first.');
      return;
    }
    const newIndex = direction === 'next'
      ? Math.min(currentIndex + 1, allLectures.length - 1)
      : Math.max(currentIndex - 1, 0);
    if (newIndex !== currentIndex) {
      navigate(`/course/${courseId}/lecture/${allLectures[newIndex].id}`);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading lecture content..." />
      </div>
    );
  }

  if (!serverConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {/* <AlertCircle className="h-12 w-12 text-red-500" /> */}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Server Connection Failed</h3>
          <p className="text-gray-600 text-lg mb-6">
            Cannot access lecture content while offline. Please connect to the server first.
          </p>
          <div className="space-y-3">
            <button
              onClick={fetchLectureData}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Try Connecting Again
            </button>
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lecture || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {/* <BookOpen className="h-12 w-12 text-gray-400" /> */}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Lecture not found</h3>
          <p className="text-gray-600 text-lg mb-6">The lecture you are looking for does not exist.</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                {/* <ArrowLeft className="h-5 w-5" /> */}
                <span className="font-medium">Back to Course</span>
              </button>
              <div className="hidden sm:block text-gray-400">|</div>
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {course.title}
              </h1>
            </div>
            {/* Navigation Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateToLecture('prev')}
                disabled={currentIndex === 0}
                className={`p-2 rounded-md transition-colors ${
                  currentIndex === 0 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {/* <ChevronLeft className="h-5 w-5" /> */}
              </button>
              <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                {currentIndex + 1} of {allLectures.length}
              </span>
              <button
                onClick={() => navigateToLecture('next')}
                disabled={currentIndex === allLectures.length - 1}
                className={`p-2 rounded-md transition-colors ${
                  currentIndex === allLectures.length - 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {/* <ChevronRight className="h-5 w-5" /> */}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                {/* Video Container with 16:9 aspect ratio */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={getYouTubeEmbedUrl(lecture.youtubeUrl)}
                    title={lecture.title}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Questions Section */}
            {lecture.questions && Array.isArray(lecture.questions) && lecture.questions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  {/* <FileText className="h-5 w-5 text-blue-500" /> */}
                  <h3 className="text-lg font-semibold text-gray-900">Practice Questions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lecture.questions.map((q, idx) => {
                    let url = q.url || q;
                    let title = q.title || 'Question';
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-3 rounded-lg font-medium shadow-sm transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200 text-gray-800 hover:bg-gray-300"
                      >
                        <span className="truncate">{title}</span>
                        <span className="sr-only">Open question in new tab</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lecture Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {lecture.title}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {/* <Clock className="h-4 w-4" /> */}
                  <span>Lecture {lecture.order}</span>
                </div>
              </div>
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-code:text-blue-600 prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-700 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:text-gray-600">
                {/* Markdown rendering for description */}
                <div>{lecture.description}</div>
              </div>
            </div>

            {/* Code Snippet */}
            {lecture.code && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    {/* <Code className="h-5 w-5 text-blue-400" /> */}
                    <span className="text-gray-300 text-sm font-medium">Code Example</span>
                    <div className="flex-1"></div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <pre style={{margin:0, borderRadius:0, fontSize:'15px', lineHeight:'1.6', padding:'24px', background:'#2d2d2d', color:'#fff'}}>
                  {lecture.code}
                </pre>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                {/* <BookOpen className="h-5 w-5 text-white" /> */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Course Overview</h3>
                  <p className="text-sm text-gray-500">Current Course</p>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">{course.title}</h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {course.description}
              </p>
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Lectures
              </button>
            </div>

            {/* Lecture Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                {/* <Play className="h-5 w-5 text-white" /> */}
                <h3 className="text-lg font-semibold text-gray-900">Lecture Navigation</h3>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allLectures.map((lec, index) => (
                  <button
                    key={lec.id}
                    onClick={() => navigate(`/course/${courseId}/lecture/${lec.id}`)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      lec.id === lectureId
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        lec.id === lectureId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">{lec.title}</span>
                        {lec.id === lectureId && (
                          <span className="text-xs text-blue-600">Current</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePlayer;