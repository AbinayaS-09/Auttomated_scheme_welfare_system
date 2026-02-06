import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-sm">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-1 px-4">
          <div className="max-w-7xl mx-auto flex justify-between text-xs">
            <span>भारत सरकार | Government of India</span>
            <span>User Dashboard</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                ₹
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
                <p className="text-xs text-gray-600">Welcome, {profile?.name || 'User'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/user/profile')}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-xl p-8 text-white mb-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard!</h2>
          <p className="text-lg opacity-90">Explore government schemes tailored for you</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">Available Schemes</p>
            <p className="text-4xl font-bold text-blue-600">150+</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">Applications Submitted</p>
            <p className="text-4xl font-bold text-green-600">{profile?.applicationCount || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">Eligible Schemes</p>
            <p className="text-4xl font-bold text-orange-600">
              {profile?.profileComplete ? '45+' : '0'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">Profile Status</p>
            <p className={`text-lg font-bold ${profile?.profileComplete ? 'text-green-600' : 'text-yellow-600'}`}>
              {profile?.profileComplete ? 'Complete' : 'Incomplete'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/user/profile')}
              className="p-6 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition-all text-left"
            >
              <div className="text-4xl mb-3">👤</div>
              <h4 className="font-bold text-gray-800 mb-2">Complete Profile</h4>
              <p className="text-sm text-gray-600">Update your information to find eligible schemes</p>
            </button>
            
            <button className="p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-all text-left">
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="font-bold text-gray-800 mb-2">Browse Schemes</h4>
              <p className="text-sm text-gray-600">Explore available government welfare schemes</p>
            </button>
            
            <button className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-left">
              <div className="text-4xl mb-3">📋</div>
              <h4 className="font-bold text-gray-800 mb-2">Track Applications</h4>
              <p className="text-sm text-gray-600">Check status of your scheme applications</p>
            </button>
          </div>
        </div>

        {/* Featured Schemes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Featured Schemes</h3>
          
          <div className="space-y-4">
            <div className="p-5 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Pradhan Mantri Awas Yojana</h4>
                  <p className="text-sm text-gray-600 mb-3">Housing for All - Financial assistance for home construction</p>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Housing</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Central Govt</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-sm">
                  Apply Now
                </button>
              </div>
            </div>

            <div className="p-5 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Ayushman Bharat - PM-JAY</h4>
                  <p className="text-sm text-gray-600 mb-3">Health insurance coverage up to ₹5 lakh per family</p>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">Healthcare</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Central Govt</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-sm">
                  Apply Now
                </button>
              </div>
            </div>

            <div className="p-5 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">PM Kisan Samman Nidhi</h4>
                  <p className="text-sm text-gray-600 mb-3">₹6000 per year direct benefit transfer to farmers</p>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Agriculture</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Central Govt</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-sm">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Government of India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserHome;