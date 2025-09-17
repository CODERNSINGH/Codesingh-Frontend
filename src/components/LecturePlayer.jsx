// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   BookOpen, 
//   ArrowLeft, 
//   ExternalLink, 
//   Code, 
//   Play,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   FileText,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import axios from 'axios';
// import LoadingSpinner from './LoadingSpinner';
// import { API_ENDPOINTS } from '../config/api';

// const LecturePlayer = () => {
//   const { courseId, lectureId } = useParams();
//   const navigate = useNavigate();
//   const [lecture, setLecture] = useState(null);
//   const [course, setCourse] = useState(null);
//   const [allLectures, setAllLectures] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [serverConnected, setServerConnected] = useState(false);

//   useEffect(() => {
//     fetchLectureData();
//   }, [courseId, lectureId]);

//   const fetchLectureData = async () => {
//     try {
//       setLoading(true);
//       const [lectureResponse, courseResponse, lecturesResponse] = await Promise.all([
//         axios.get(API_ENDPOINTS.LECTURE_DETAIL(lectureId)),
//         axios.get(API_ENDPOINTS.COURSE_DETAIL(courseId)),
//         axios.get(API_ENDPOINTS.COURSE_LECTURES(courseId))
//       ]);
      
//       setLecture(lectureResponse.data);
//       setCourse(courseResponse.data);
//       setAllLectures(lecturesResponse.data);
//       setServerConnected(true);
      
//       // Find current lecture index
//       const index = lecturesResponse.data.findIndex(l => l.id === parseInt(lectureId));
//       setCurrentIndex(index >= 0 ? index : 0);
//     } catch (err) {
//       console.error('Error fetching lecture data:', err);
//       setServerConnected(false);
//       setError('Server connection failed. Cannot access lecture content.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigateToLecture = (direction) => {
//     if (!serverConnected) {
//       alert('Cannot navigate lectures while offline. Please connect to the server first.');
//       return;
//     }
    
//     const newIndex = direction === 'next' 
//       ? Math.min(currentIndex + 1, allLectures.length - 1)
//       : Math.max(currentIndex - 1, 0);
    
//     if (newIndex !== currentIndex) {
//       navigate(`/course/${courseId}/lecture/${allLectures[newIndex].id}`);
//     }
//   };

//   const getYouTubeEmbedUrl = (url) => {
//     // Convert YouTube URL to embed URL
//     const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
//     return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <LoadingSpinner size="xl" text="Loading lecture content..." />
//       </div>
//     );
//   }

//   if (!serverConnected) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-4">
//           <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <AlertCircle className="h-12 w-12 text-red-500" />
//           </div>
//           <h3 className="text-2xl font-semibold text-gray-900 mb-3">Server Connection Failed</h3>
//           <p className="text-gray-600 text-lg mb-6">
//             Cannot access lecture content while offline. Please connect to the server first.
//           </p>
//           <div className="space-y-3">
//             <button
//               onClick={fetchLectureData}
//               className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
//             >
//               Try Connecting Again
//             </button>
//             <button
//               onClick={() => navigate(`/course/${courseId}`)}
//               className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
//             >
//               Back to Course
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!lecture || !course) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <BookOpen className="h-12 w-12 text-gray-400" />
//           </div>
//           <h3 className="text-2xl font-semibold text-gray-900 mb-3">Lecture not found</h3>
//           <p className="text-gray-600 text-lg mb-6">The lecture you are looking for does not exist.</p>
//           <button
//             onClick={() => navigate(`/course/${courseId}`)}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Back to Course
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Course Navigation Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-4">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => navigate(`/course/${courseId}`)}
//                 className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//                 <span className="font-medium">Back to Course</span>
//               </button>
//               <div className="hidden sm:block text-gray-400">|</div>
//               <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
//                 {course.title}
//               </h1>
//             </div>
            
//             {/* Navigation Arrows */}
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => navigateToLecture('prev')}
//                 disabled={currentIndex === 0}
//                 className={`p-2 rounded-md transition-colors ${
//                   currentIndex === 0 
//                     ? 'text-gray-400 cursor-not-allowed' 
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 <ChevronLeft className="h-5 w-5" />
//               </button>
//               <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
//                 {currentIndex + 1} of {allLectures.length}
//               </span>
//               <button
//                 onClick={() => navigateToLecture('next')}
//                 disabled={currentIndex === allLectures.length - 1}
//                 className={`p-2 rounded-md transition-colors ${
//                   currentIndex === allLectures.length - 1 
//                     ? 'text-gray-400 cursor-not-allowed' 
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 <ChevronRight className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-3 space-y-6">
//             {/* Video Player */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="relative">
//                 {/* Video Container with 16:9 aspect ratio */}
//                 <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
//                   <iframe
//                     src={getYouTubeEmbedUrl(lecture.youtube_url)}
//                     title={lecture.title}
//                     className="absolute top-0 left-0 w-full h-full"
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                   />
//                 </div>
                
//                 {/* Video Controls Overlay */}
//                 {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
//                   <div className="flex items-center justify-between text-white">
//                     <span className="text-sm font-medium">{lecture.title}</span>
//                     <div className="flex items-center space-x-2">
//                       <Clock className="h-4 w-4" />
//                       <span className="text-sm">Lecture {lecture.order}</span>
//                     </div>
//                   </div>
//                 </div> */}
//               </div>
//             </div>

//             {/* Lecture Info */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <h1 className="text-3xl font-bold text-gray-900 leading-tight">
//                   {lecture.title}
//                 </h1>
//                 <div className="flex items-center space-x-2 text-sm text-gray-500">
//                   <Clock className="h-4 w-4" />
//                   <span>Lecture {lecture.order}</span>
//                 </div>
//               </div>
//               <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-code:text-blue-600 prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-700 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:text-gray-600">
//                 <ReactMarkdown 
//                   remarkPlugins={[remarkGfm]}
//                   components={{
//                     code({ node, inline, className, children, ...props }) {
//                       const match = /language-(\w+)/.exec(className || '');
//                       return !inline && match ? (
//                         <SyntaxHighlighter
//                           style={tomorrow}
//                           language={match[1]}
//                           PreTag="div"
//                           className="rounded-lg"
//                           {...props}
//                         >
//                           {String(children).replace(/\n$/, '')}
//                         </SyntaxHighlighter>
//                       ) : (
//                         <code className="bg-gray-100 text-blue-600 px-2 py-1 rounded text-sm font-mono" {...props}>
//                           {children}
//                         </code>
//                       );
//                     },
//                     table({ children }) {
//                       return (
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full divide-y divide-gray-200">
//                             {children}
//                           </table>
//                         </div>
//                       );
//                     },
//                     th({ children }) {
//                       return (
//                         <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           {children}
//                         </th>
//                       );
//                     },
//                     td({ children }) {
//                       return (
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
//                           {children}
//                         </td>
//                       );
//                     }
//                   }}
//                 >
//                   {lecture.description}
//                 </ReactMarkdown>
//               </div>
//             </div>

//             {/* Code Snippet */}
//             {lecture.code && (
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
//                   <div className="flex items-center space-x-3">
//                     <Code className="h-5 w-5 text-blue-400" />
//                     <span className="text-gray-300 text-sm font-medium">Code Example</span>
//                     <div className="flex-1"></div>
//                     <div className="flex space-x-2">
//                       <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                       <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                     </div>
//                   </div>
//                 </div>
//                 <SyntaxHighlighter
//                   language="python"
//                   style={tomorrow}
//                   customStyle={{
//                     margin: 0,
//                     borderRadius: 0,
//                     fontSize: '15px',
//                     lineHeight: '1.6',
//                     padding: '24px'
//                   }}
//                 >
//                   {lecture.code}
//                 </SyntaxHighlighter>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Course Info */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
//                   <BookOpen className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Course Overview</h3>
//                   <p className="text-sm text-gray-500">Current Course</p>
//                 </div>
//               </div>
//               <h4 className="font-bold text-gray-900 mb-3 text-lg">{course.title}</h4>
//               <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
//                 {course.description}
//               </p>
//               <button
//                 onClick={() => navigate(`/course/${courseId}`)}
//                 className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 View All Lectures
//               </button>
//             </div>

//             {/* Lecture Navigation */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
//                   <Play className="h-5 w-5 text-white" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900">Lecture Navigation</h3>
//               </div>
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {allLectures.map((lec, index) => (
//                   <button
//                     key={lec.id}
//                     onClick={() => navigate(`/course/${courseId}/lecture/${lec.id}`)}
//                     className={`w-full text-left p-3 rounded-lg transition-colors ${
//                       lec.id === parseInt(lectureId)
//                         ? 'bg-blue-50 text-blue-700 border border-blue-200'
//                         : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
//                         lec.id === parseInt(lectureId)
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-200 text-gray-600'
//                       }`}>
//                         {index + 1}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <span className="text-sm font-medium truncate block">{lec.title}</span>
//                         {lec.id === parseInt(lectureId) && (
//                           <span className="text-xs text-blue-600">Current</span>
//                         )}
//                       </div>
//                       {lec.id === parseInt(lectureId) && (
//                         <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
//                       )}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LecturePlayer; 



// Platform theme colors and icons
const PLATFORM_THEMES = {
  leetcode: {
    name: 'LeetCode',
    color: 'bg-yellow-400 text-black hover:bg-yellow-500',
    icon: (
      <svg className="h-5 w-5 mr-2" viewBox="0 0 32 32" fill="none"><path d="M25.5 6.5L6.5 25.5" stroke="#FFA116" strokeWidth="3" strokeLinecap="round"/><path d="M19 6.5H25.5V13" stroke="#FFA116" strokeWidth="3" strokeLinecap="round"/></svg>
    )
  },
  geeksforgeeks: {
    name: 'GeeksforGeeks',
    color: 'bg-green-600 text-white hover:bg-green-700',
    icon: (
      <svg className="h-5 w-5 mr-2" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#2F8D46"/><text x="16" y="21" textAnchor="middle" fontSize="13" fill="#fff">GfG</text></svg>
    )
  },
  codeforces: {
    name: 'Codeforces',
    color: 'bg-blue-500 text-white hover:bg-blue-600',
    icon: (
      <svg className="h-5 w-5 mr-2" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#1F8ACB"/><text x="16" y="21" textAnchor="middle" fontSize="11" fill="#fff">CF</text></svg>
    )
  },
  hackerrank: {
    name: 'HackerRank',
    color: 'bg-green-800 text-white hover:bg-green-900',
    icon: (
      <svg className="h-5 w-5 mr-2" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="6" fill="#2EC866"/><text x="16" y="21" textAnchor="middle" fontSize="11" fill="#fff">HR</text></svg>
    )
  },
  default: {
    name: 'Question',
    color: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    icon: <ExternalLink className="h-5 w-5 mr-2" />
  }
};

function getPlatformTheme(url) {
  if (!url) return PLATFORM_THEMES.default;
  if (url.includes('leetcode.com')) return PLATFORM_THEMES.leetcode;
  if (url.includes('geeksforgeeks.org')) return PLATFORM_THEMES.geeksforgeeks;
  if (url.includes('codeforces.com')) return PLATFORM_THEMES.codeforces;
  if (url.includes('hackerrank.com')) return PLATFORM_THEMES.hackerrank;
  return PLATFORM_THEMES.default;
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowLeft, 
  ExternalLink, 
  Code, 
  Play,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { API_ENDPOINTS } from '../config/api';

const LecturePlayer = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
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
      const [lectureResponse, courseResponse, lecturesResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.LECTURE_DETAIL(lectureId)),
        axios.get(API_ENDPOINTS.COURSE_DETAIL(courseId)),
        axios.get(API_ENDPOINTS.COURSE_LECTURES(courseId))
      ]);
      
      setLecture(lectureResponse.data);
      setCourse(courseResponse.data);
      setAllLectures(lecturesResponse.data);
      setServerConnected(true);
      
      // Find current lecture index
      const index = lecturesResponse.data.findIndex(l => l.id === parseInt(lectureId));
      setCurrentIndex(index >= 0 ? index : 0);
    } catch (err) {
      console.error('Error fetching lecture data:', err);
      setServerConnected(false);
      setError('Server connection failed. Cannot access lecture content.');
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
    // Convert YouTube URL to embed URL
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
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
            <AlertCircle className="h-12 w-12 text-red-500" />
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
            <BookOpen className="h-12 w-12 text-gray-400" />
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
                <ArrowLeft className="h-5 w-5" />
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
                <ChevronLeft className="h-5 w-5" />
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
                <ChevronRight className="h-5 w-5" />
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
                    src={getYouTubeEmbedUrl(lecture.youtube_url)}
                    title={lecture.title}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Video Controls Overlay */}
                {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm font-medium">{lecture.title}</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Lecture {lecture.order}</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Questions Section */}
            {lecture.questions && Array.isArray(lecture.questions) && lecture.questions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Practice Questions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lecture.questions.map((q, idx) => {
                    // q can be a string (url) or an object { url, title }
                    let url = q.url || q;
                    let title = q.title || getPlatformTheme(url).name;
                    const theme = getPlatformTheme(url);
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center px-4 py-3 rounded-lg font-medium shadow-sm transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${theme.color}`}
                      >
                        {theme.icon}
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
                  <Clock className="h-4 w-4" />
                  <span>Lecture {lecture.order}</span>
                </div>
              </div>
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-code:text-blue-600 prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-700 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:text-gray-600">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-100 text-blue-600 px-2 py-1 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                          {children}
                        </td>
                      );
                    }
                  }}
                >
                  {lecture.description}
                </ReactMarkdown>
              </div>
            </div>

            

            {/* Code Snippet */}
            {lecture.code && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Code className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-300 text-sm font-medium">Code Example</span>
                    <div className="flex-1"></div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <SyntaxHighlighter
                  language="python"
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: '15px',
                    lineHeight: '1.6',
                    padding: '24px'
                  }}
                >
                  {lecture.code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
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
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Lecture Navigation</h3>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allLectures.map((lec, index) => (
                  <button
                    key={lec.id}
                    onClick={() => navigate(`/course/${courseId}/lecture/${lec.id}`)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      lec.id === parseInt(lectureId)
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        lec.id === parseInt(lectureId)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">{lec.title}</span>
                        {lec.id === parseInt(lectureId) && (
                          <span className="text-xs text-blue-600">Current</span>
                        )}
                      </div>
                      {lec.id === parseInt(lectureId) && (
                        <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      )}
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