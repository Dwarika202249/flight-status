import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';
import AddFlight from '../addflight/AddFlight';
import { BACKEND_URL } from '../route';

const Admin = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newGate, setNewGate] = useState('');
  const [gateNumbers, setGateNumbers] = useState([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    fetchFlights();
    fetchGateNumbers();
  }, []);

  const handleToggle = () => {
    setToggle(!toggle)
  }

  const fetchFlights = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/flights`);
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const fetchGateNumbers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/gate_numbers`);
      setGateNumbers(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching gate numbers:', error);
    }
  };

  const handleStatusChange = async () => {
    if (selectedFlight && newStatus) {
      try {
        await axios.post(`${BACKEND_URL}/update_flight_status`, {
          flight_number: selectedFlight,
          status: newStatus,
          gate: newGate,
        });
        alert('Flight status updated and notifications sent.');
        fetchFlights(); // Refresh the flight list
      } catch (error) {
        console.error('Error updating flight status:', error);
        alert('Failed to update flight status.');
      }
    } else {
      alert('Please select a flight and enter a new status.');
    }
  };

  return (
    <div className="admin">
      <h1 className='admin-head'>Admin Panel</h1>
      <button className='toggleBtn' onClick={handleToggle}>Go to {!toggle ? "Add New Flight" : "Update Flight Status"}</button>
      {
        toggle ? <AddFlight /> : 
        <div className="admin-container">
      
      <h2>Update Flight Status</h2>
      <div>
        <label htmlFor="flight">Select Flight:</label>
        <select
          id="flight"
          value={selectedFlight}
          onChange={(e) => setSelectedFlight(e.target.value)}
        >
          <option value="">--Select Flight--</option>
          {flights.map((flight) => (
            <option key={flight.flight_number} value={flight.flight_number}>
              {flight.flight_number} - {flight.status}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="status">New Status:</label>
        <input
          id="status"
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="gate">New Gate Number:</label>
        <select
          id="gate"
          value={newGate}
          onChange={(e) => setNewGate(e.target.value)}
        >
          <option value="">--Select Gate--</option>
          {gateNumbers.map((gate) => (
            <option key={gate} value={gate}>
              {gate}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleStatusChange}>Update Status</button>
    </div>
      }
      
    </div>
  );
};

export default Admin;
