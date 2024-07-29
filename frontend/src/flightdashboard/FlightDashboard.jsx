import React, { useState, useEffect } from 'react';
import './flightDashboard.css'
import SubscribeForm from '../subscribeform/SubscribeForm';

function FlightDashboard() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/flights')
      .then(response => response.json())
      .then(data => setFlights(data))
      .catch(error => console.error('Error fetching flights:', error));
  }, []);

  const handleFlightClick = (flight) => {
    setSelectedFlight(flight);
  };

  const handleClosePopup = () => {
    setSelectedFlight(null);
  };

  return (
    <div>
      <h1>Flight Dashboard</h1>
      <ul>
        {flights.map(flight => (
          <li key={flight._id} onClick={() => handleFlightClick(flight)}>
            Flight Number: {flight.flight_number}, Status: {flight.status}
          </li>
        ))}
      </ul>
      {selectedFlight && (
        <div className="popup">
          <div className="popup-content">
            <button onClick={handleClosePopup} className="close-btn">Close</button>
            <SubscribeForm flightNumber={selectedFlight.flight_number} onClose={handleClosePopup} />
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightDashboard;
