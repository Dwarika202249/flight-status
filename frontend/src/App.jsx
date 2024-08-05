import React, { useState } from 'react';
import Admin from './admin/Admin';
import AdminLogin from './login/AdminLogin';
import './App.css';
import FlightDashboard from './flightdashboard/FlightDashboard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/admin-login" />} />
            <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />
            <Route path="/" element={<FlightDashboard />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
