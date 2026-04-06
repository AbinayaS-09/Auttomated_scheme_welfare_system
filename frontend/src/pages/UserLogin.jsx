import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// The UserLogin component provides a login form for users to access their accounts. It includes fields for email and password, and manages form data using React's useState hook. Upon submission, it sends a POST request to the backend API to authenticate the user. If successful, it stores the authentication token and user role in localStorage and redirects the user to their profile page. If authentication fails, it displays an error message. The component also includes navigation links for registration and password recovery.
const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'user');
        navigate('/user/profile');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-sm">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-1 px-4">
          <div className="max-w-7xl mx-auto flex justify-between text-xs">
            <span>भारत सरकार | Government of India</span>
            <span>User Portal</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                ₹
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Scheme Portal</h1>
                <p className="text-xs text-gray-600">User Login</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-green-600 p-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-sm opacity-90">Login to access your account</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Forgot Password?
                </a>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-lg hover:from-orange-600 hover:to-green-700 transition-all font-bold text-lg shadow-lg disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/user/register')}
                    className="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Register Now
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default UserLogin;