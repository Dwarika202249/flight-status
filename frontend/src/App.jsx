import Admin from './admin/Admin'
import './App.css'
import FlightDashboard from './flightdashboard/FlightDashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      {/* <Navbar /> */}
      <Router>
      <div className="App">
        <Routes>
          <Route path="https://flight-backend-6qlx.onrender.com/admin" element={<Admin />} />
          <Route path="/" element={<FlightDashboard />} />
        </Routes>
      </div>
    </Router>
        
    </>
  )
}

export default App
