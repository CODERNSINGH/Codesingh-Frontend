import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CourseDashboard from './components/CourseDashboard';
import LecturePlayer from './components/LecturePlayer';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';
import OnlineCompiler from './components/OnlineCompiler';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import CourseForm from './components/CourseForm';
import LectureForm from './components/LectureForm';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Header />
        <main className="">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playground" element={<OnlineCompiler />} />
            <Route path="/course/:courseId" element={
              <ProtectedRoute>
                <CourseDashboard />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId/lecture/:lectureId" element={
              <ProtectedRoute>
                <LecturePlayer />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute roles={["admin", "instructor"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/new" element={
              <ProtectedRoute roles={["admin", "instructor"]}>
                <CourseForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/:courseId/edit" element={
              <ProtectedRoute roles={["admin", "instructor"]}>
                <CourseForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/lectures/new" element={
              <ProtectedRoute roles={["admin", "instructor"]}>
                <LectureForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/lectures/:lectureId/edit" element={
              <ProtectedRoute roles={["admin", "instructor"]}>
                <LectureForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={["admin"]}>
                <UserDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
