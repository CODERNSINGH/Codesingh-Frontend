import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Bell, Search, Menu, X } from 'lucide-react';
import ComingSoon from './ComingSoon';

const getUser = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  return { username: 'User' }; // Replace with actual username if decoding JWT
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonConfig, setComingSoonConfig] = useState({});
  const user = getUser();

  const navigation = [
    { name: 'Explore', href: '/', current: location.pathname === '/', comingSoon: false },
    { name: 'Playground', href: '/playground', current: location.pathname === '/playground', comingSoon: false },
  ];

  const handleNavigationClick = (item) => {
    if (item.comingSoon) {
      setComingSoonConfig({
        title: `${item.name} Coming Soon`,
        description: `The ${item.name.toLowerCase()} feature is under development and will be available soon!`
      });
      setShowComingSoon(true);
    } else {
      navigate(item.href);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Dashboard */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
              <span className="text-xl font-bold text-gray-900">CodeSingh</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <span>Dashboard</span>
            </button>
          </div>
          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigationClick(item)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
          {/* Right side - Search, Notifications, User */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowComingSoon(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowComingSoon(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{user.username[0]}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <span className="block px-4 py-2 text-sm text-gray-700">Signed in as <b>{user.username}</b></span>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors mr-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigationClick(item);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    item.current
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        )}
        {/* Coming Soon Modal */}
        {showComingSoon && (
          <ComingSoon
            {...comingSoonConfig}
            onClose={() => setShowComingSoon(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;