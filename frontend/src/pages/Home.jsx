import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-sm">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-1 px-4">
          <div className="max-w-7xl mx-auto flex justify-between text-xs">
            <span>भारत सरकार | Government of India</span>
            <span>स्वागत है | Welcome</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                ₹
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Scheme Portal</h1>
                <p className="text-sm text-gray-600">योजना पोर्टल - Empowering Every Citizen</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/user/login')}
                className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                User Login
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Government Schemes <span className="text-orange-600">Made for You</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Access hundreds of central and state government welfare schemes. Get personalized recommendations based on your profile and eligibility.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/user/register')}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-lg hover:from-orange-600 hover:to-green-700 transition-all font-bold text-lg shadow-lg"
              >
                Get Started →
              </button>
              <button
                onClick={() => navigate('/user/login')}
                className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition-all font-bold text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-orange-200 to-green-200 rounded-3xl shadow-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🇮🇳</div>
                <p className="text-2xl font-bold text-gray-800">Digital India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Portal?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
              <div className="text-5xl mb-4">🎯</div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Personalized Schemes</h4>
              <p className="text-gray-600">Get scheme recommendations tailored to your profile, location, and eligibility criteria.</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="text-5xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Quick Application</h4>
              <p className="text-gray-600">Apply to multiple schemes with a single profile. Fast, secure, and hassle-free.</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="text-5xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Secure & Verified</h4>
              <p className="text-gray-600">Your data is protected with bank-level security. Official government portal integration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-3xl p-12 text-white shadow-2xl">
          <h3 className="text-3xl font-bold text-center mb-12">Our Impact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-lg">Government Schemes</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">1M+</p>
              <p className="text-lg">Registered Users</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">50L+</p>
              <p className="text-lg">Applications Processed</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">28</p>
              <p className="text-lg">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-gray-600 mb-8">Join millions of Indians accessing government welfare schemes</p>
          
          <button
            onClick={() => navigate('/user/register')}
            className="px-12 py-5 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-lg hover:from-orange-600 hover:to-green-700 transition-all font-bold text-xl shadow-lg"
          >
            Create Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Scheme Portal</h4>
              <p className="text-sm text-gray-400">Making government schemes accessible to every citizen</p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="hover:text-white cursor-pointer">Browse Schemes</li>
                <li className="hover:text-white cursor-pointer">Eligibility Check</li>
                <li className="hover:text-white cursor-pointer">Application Status</li>
                <li className="hover:text-white cursor-pointer">Help Center</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="hover:text-white cursor-pointer">User Guide</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <p className="text-sm text-gray-400 mb-2">Helpline: 1800-XXX-XXXX</p>
              <p className="text-sm text-gray-400 mb-2">Email: support@schemes.gov.in</p>
              <p className="text-sm text-gray-400">Mon-Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2025 Government of India. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-2">Developed and maintained by National Informatics Centre</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;