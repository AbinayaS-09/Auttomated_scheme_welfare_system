import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// The UserRegister component provides a registration form for new users to create an account. It includes fields for name, email, password, confirm password, and a consent checkbox. The form data is managed using React's useState hook, and upon submission, it sends a POST request to the backend API to register the user. The component also handles validation (password match and consent) and displays error messages if registration fails. Upon successful registration, it redirects the user to the login page.
const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    consent: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.consent) {
      setError('Please accept terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'user',
          consent: formData.consent
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please login.');
        navigate('/user/login');
      } else {
        setError(data.error || 'Registration failed');
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
            <span>User Registration</span>
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
                <p className="text-xs text-gray-600">User Registration</p>
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

      {/* Registration Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-green-600 p-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-sm opacity-90">Join thousands of beneficiaries</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

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
                  placeholder="Create a password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to the <a href="#" className="text-orange-600 font-semibold">Terms & Conditions</a> and <a href="#" className="text-orange-600 font-semibold">Privacy Policy</a>. I consent to the collection and use of my personal information as per GDPR guidelines.
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-lg hover:from-orange-600 hover:to-green-700 transition-all font-bold text-lg shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/user/login')}
                    className="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Login Here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;