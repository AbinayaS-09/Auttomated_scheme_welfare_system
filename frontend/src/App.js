import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';//BrowserRouter = browser history, Routes = routes, Route = route, Navigate = navigate
import Home from './pages/Home';//Home page
import UserLogin from './pages/UserLogin';//User login page
import UserRegister from './pages/UserRegister';//User register page
import UserHome from './pages/UserHome';//User home page
import UserProfile from './pages/UserProfile';//User profile page
import UserAnalyticsPage from './pages/UserAnalyticsPage';//User analytics page
import AllSchemes from './pages/AllSchemes';//All schemes page
import EligibleSchemes from './pages/EligibleSchemes';//Eligible schemes page
import SchemeDetail from './pages/SchemeDetail';//Scheme detail page
import AdminLogin from './pages/AdminLogin';//Admin login page
import AdminRegister from './pages/AdminRegister';//Admin register page
import AdminHome from './pages/AdminHome';//Admin home page
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';//Admin analytics page


// Protected Route Component-->Protected Route = Only authorized users can access that page
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    // Redirect to login if no token
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/user/login'} />;
  }
  
  if (allowedRole && userRole !== allowedRole) {
    // Redirect to home if role doesn't match
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* User Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route 
          path="/user/home" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/profile" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/analytics" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserAnalyticsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/all-schemes" 
          element={
            <ProtectedRoute allowedRole="user">
              <AllSchemes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/schemes" 
          element={
            <ProtectedRoute allowedRole="user">
              <EligibleSchemes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/schemes/:id" 
          element={
            <ProtectedRoute allowedRole="user">
              <SchemeDetail />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route 
          path="/admin/home" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminAnalyticsPage />
            </ProtectedRoute>
          } 
        />

        {/* 404 Route - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;