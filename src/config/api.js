// API Configuration
const API_BASE_URL = 'https://final-backend-of-codesingh.onrender.com';
// const API_BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  COURSES: `${API_BASE_URL}/api/courses/`,
  LECTURES: `${API_BASE_URL}/api/lectures/`,
  COURSE_LECTURES: (courseId) => `${API_BASE_URL}/api/courses/${courseId}/lectures/`,
  COURSE_DETAIL: (courseId) => `${API_BASE_URL}/api/courses/${courseId}/`,
  LECTURE_DETAIL: (lectureId) => `${API_BASE_URL}/api/lectures/${lectureId}/`,
  LOGIN: `${API_BASE_URL}/api/users/login/`,
  REGISTER: `${API_BASE_URL}/api/users/register/`,
};

export default API_BASE_URL;
