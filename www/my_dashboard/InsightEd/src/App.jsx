// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import EngineerDashboard from './modules/EngineerDashboard'; // <-- NEW
import SchoolHeadDashboard from './modules/SchoolHeadDashboard'; // <-- NEW
import HRDashboard from './modules/HRDashboard'; // <-- NEW
import AdminDashboard from './modules/AdminDashboard'; // <-- NEW
import UserProfile from './modules/UserProfile'; 
import Activity from './modules/Activity';    
import SchoolForms from './modules/SchoolForms';   
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/engineer-dashboard" element={<EngineerDashboard />} /> {/* <-- NEW ROUTE */}
        <Route path="/schoolhead-dashboard" element={<SchoolHeadDashboard />} /> {/* <-- NEW ROUTE */}
        <Route path="/hr-dashboard" element={<HRDashboard />} /> {/* <-- NEW ROUTE */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* <-- NEW ROUTE */}
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
    </Router>
  );
}

export default App;