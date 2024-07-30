import Admin from './admin/Admin'
import './App.css'
import FlightDashboard from './flightdashboard/FlightDashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<FlightDashboard />} />
        </Routes>
      </div>
    </Router>
        
    </>
  )
}

export default App
