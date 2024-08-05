import React, { useState, useEffect } from "react";
import "./flightDashboard.css";
import SubscribeForm from "../subscribeform/SubscribeForm";
import Navbar from "../navbar/Navbar";
import SearchBar from "../searchbar/SearchBar";

function FlightDashboard() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetch("https://flight-backend-6qlx.onrender.com/flights")
    // fetch("http://localhost:5000/flights")
      .then((response) => response.json())
      .then((data) => setFlights(data))
      .catch((error) => console.error("Error fetching flights:", error));
  }, []);

  const filteredFlights = flights.filter((flight) =>
    flight.flight_number.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleFlightClick = (flight) => {
    setSelectedFlight(flight);
  };

  const handleClosePopup = () => {
    setSelectedFlight(null);
  };

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  // Determine the background class based on flight status
  const getStatusClass = (status) => {
    switch (status) {
      case "Delayed":
        return "status-delayed";
      case "Cancelled":
        return "status-cancelled";
      case "On Time":
        return "status-on-time";
      default:
        return "";
    }
  };

  return (
    <div className="flight-dashboard">
      <Navbar />
      <SearchBar value={searchText} onChange={handleSearchText} />
      <h1 className="dashboard-title">Flight Dashboard</h1>
      <ul className="flight-list">
        <ul className="flight-list-heading">
          <li className="flight-num">Flight Number</li>
          <li className="status">Status</li>
          <li className="gate-num">Gate no.</li>
        </ul>
        {searchText
          ? filteredFlights.map((flight) => (
              <li
                key={flight._id}
                className={`flight-item ${getStatusClass(flight.status)}`}
                onClick={() => handleFlightClick(flight)}
              >
                <span className="flight-number"> {flight.flight_number}</span>
                <span className="flight-status">{flight.status}</span>
                <span className="flight-gate">{flight.gate}</span>
              </li>
            ))
          : flights.map((flight) => (
              <li
                key={flight._id}
                className={`flight-item ${getStatusClass(flight.status)}`}
                onClick={() => handleFlightClick(flight)}
              >
                <span className="flight-number"> {flight.flight_number}</span>
                <span className="flight-status">{flight.status}</span>
                <span className="flight-gate">{flight.gate}</span>
              </li>
            ))}
      </ul>
      {selectedFlight && (
        <div className="popup">
          <div className="popup-content">
            <button onClick={handleClosePopup} className="close-btn">
              x
            </button>
            <SubscribeForm
              flightNumber={selectedFlight.flight_number}
              onClose={handleClosePopup}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightDashboard;
