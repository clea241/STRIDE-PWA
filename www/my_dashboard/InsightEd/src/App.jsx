// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import EngineerDashboard from './modules/EngineerDashboard'; // <-- NEW
import SchoolHeadDashboard from './modules/SchoolHeadDashboard'; // <-- NEW
import HRDashboard from './modules/HRDashboard'; // <-- NEW
import AdminDashboard from './modules/AdminDashboard'; // <-- NEW

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
      </Routes>
    </Router>
  );
}

export default App;