import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
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

      if (response.ok && data.user.role === 'admin') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'admin');
        navigate('/admin/home');
      } else if (response.ok && data.user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-green-600 shadow-sm">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-1 px-4">
          <div className="max-w-7xl mx-auto flex justify-between text-xs">
            <span>Government of India</span>
            <span>Admin Portal</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                🛡️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
                <p className="text-xs text-gray-600">System Administrator Login</p>
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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
            <div className="text-5xl mb-3">🔐</div>
            <h2 className="text-3xl font-bold mb-2">Admin Access</h2>
            <p className="text-sm opacity-90">Authorized Personnel Only</p>
          </div>

          <div className="p-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Warning:</strong> This is a restricted area. Unauthorized access is prohibited and will be logged.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@schemes.gov.in"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  placeholder="Enter admin password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Login as Admin'}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Need admin access?{' '}
                  <button
                    onClick={() => navigate('/admin/register')}
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Request Access
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          All admin activities are monitored and logged for security purposes
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Admin Portal</h4>
              <p className="text-sm text-gray-400">Secure access for system administrators</p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Security</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="hover:text-white cursor-pointer">Security Guidelines</li>
                <li className="hover:text-white cursor-pointer">Access Control</li>
                <li className="hover:text-white cursor-pointer">Audit Logs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <p className="text-sm text-gray-400 mb-2">IT Helpdesk: 1800-XXX-XXXX</p>
              <p className="text-sm text-gray-400">Email: admin@schemes.gov.in</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2025 Government of India - Admin Portal. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-2">🔒 Secure Connection - All activities are logged</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;