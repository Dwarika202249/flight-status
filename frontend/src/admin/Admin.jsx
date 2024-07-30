import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';

const Admin = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:5000/flights');
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleStatusChange = async () => {
    if (selectedFlight && newStatus) {
      try {
        await axios.post('http://localhost:5000/update_flight_status', {
          flight_number: selectedFlight,
          status: newStatus,
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
      <button onClick={handleStatusChange}>Update Status</button>
    </div>
    </div>
  );
};

export default Admin;
