// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import your pages
import Login from './Login';
import Register from './Register';
<<<<<<< HEAD
import EngineerDashboard from './modules/EngineerDashboard'; 
import SchoolHeadDashboard from './modules/SchoolHeadDashboard'; 
import HRDashboard from './modules/HRDashboard'; 
import AdminDashboard from './modules/AdminDashboard'; 
=======
import EngineerDashboard from './modules/EngineerDashboard';
import SchoolHeadDashboard from './modules/SchoolHeadDashboard';
import HRDashboard from './modules/HRDashboard';
import AdminDashboard from './modules/AdminDashboard';
>>>>>>> edb89b59280a86534d50e045c96c0d002c7e2cce
import UserProfile from './modules/UserProfile'; 
import Activity from './modules/Activity';    
import SchoolForms from './modules/SchoolForms';   

<<<<<<< HEAD
// --- CORRECTED IMPORTS for Individual Forms ---
// NOTE: Assuming your form components are located in 'src/forms/'
import SchoolProfile from './forms/SchoolProfile';
import SchoolInformation from './forms/SchoolInformation';
import Enrolement from './forms/Enrolment';
import OrganizedClasses from './forms/OrganizedClasses';
import TeachingPersonnel from './forms/TeachingPersonnel';
import SchoolInfrastructure from './forms/SchoolInfrastructure';
import SchoolResources from './forms/SchoolResources';
import TeacherSpecialization from './forms/TeacherSpecialization';
// ------------------------------------------

=======
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
>>>>>>> edb89b59280a86534d50e045c96c0d002c7e2cce

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/engineer-dashboard" element={<EngineerDashboard />} /> 
        <Route path="/schoolhead-dashboard" element={<SchoolHeadDashboard />} /> 
        <Route path="/hr-dashboard" element={<HRDashboard />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/school-forms" element={<SchoolForms />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/activities" element={<Activity />} />

        {/* --- ROUTES FOR INDIVIDUAL FORMS (Adjusted paths for clarity and simplicity) --- */}
        <Route path="/school-profile" element={<SchoolProfile />} />
        <Route path="/school-information" element={<SchoolInformation />} />
        <Route path="/enrolment" element={<Enrolement />} />
        <Route path="/organized-classes" element={<OrganizedClasses />} />
        <Route path="/teaching-personnel" element={<TeachingPersonnel />} />
        <Route path="/school-infrastructure" element={<SchoolInfrastructure />} />
        <Route path="/school-resources" element={<SchoolResources />} />
        <Route path="/teacher-specialization" element={<TeacherSpecialization />} />
        {/* ------------------------------------------ */}
      </Routes>
=======
      <AnimatedRoutes />
>>>>>>> edb89b59280a86534d50e045c96c0d002c7e2cce
    </Router>
  );
}

export default App;