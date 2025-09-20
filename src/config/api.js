// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://codesingh-backend.vercel.app' 
  : 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  USERS: `${API_BASE_URL}/api/users/`,
  USER_DETAIL: (id) => `${API_BASE_URL}/api/users/${id}`,
  COURSES: `${API_BASE_URL}/api/courses/`,
  COURSE_DETAIL: (id) => `${API_BASE_URL}/api/courses/${id}`,
  COURSE_LECTURES: (courseId) => `${API_BASE_URL}/api/courses/${courseId}/lectures`,
  LECTURES: `${API_BASE_URL}/api/lectures/`,
  LECTURE_DETAIL: (id) => `${API_BASE_URL}/api/lectures/${id}`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;
