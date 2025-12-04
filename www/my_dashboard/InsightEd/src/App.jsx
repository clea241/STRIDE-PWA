// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import your pages
import Login from './Login';
import Register from './Register';
import EngineerDashboard from './modules/EngineerDashboard';
import SchoolHeadDashboard from './modules/SchoolHeadDashboard';
import HRDashboard from './modules/HRDashboard';
import AdminDashboard from './modules/AdminDashboard';
import UserProfile from './modules/UserProfile'; 
import Activity from './modules/Activity';    
import SchoolForms from './modules/SchoolForms';   

// 1. Create a sub-component for the actual routes
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        // mode="wait" ensures the old page fades out BEFORE the new one fades in
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
                <Route path="/schoolhead-dashboard" element={<SchoolHeadDashboard />} />
                <Route path="/hr-dashboard" element={<HRDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/school-forms" element={<SchoolForms />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/activities" element={<Activity />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;