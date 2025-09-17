import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CourseDashboard from './components/CourseDashboard';
import LecturePlayer from './components/LecturePlayer';
import './App.css';
import OnlineCompiler from './components/OnlineCompiler';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Header />
        <main className="">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playground" element={<OnlineCompiler />} />
            <Route path="/course/:courseId" element={<CourseDashboard />} />
            <Route path="/course/:courseId/lecture/:lectureId" element={<LecturePlayer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
