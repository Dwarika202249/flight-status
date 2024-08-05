import React, { useState } from "react";
import "./addFlight.css";

const AddFlight = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [status, setStatus] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [gate, setGate] = useState("");

  const handleAddFlight = (e) => {
    e.preventDefault();
    if (!flightNumber) {
      alert("Flight Number is required!");
      return;
    }
    if (!status) {
      alert("Status is required!");
      return;
    }
    if (!gate) {
      alert("Gate Number is required!");
      return;
    }

    fetch("https://flight-backend-6qlx.onrender.com/addflight", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flight_number: flightNumber,
        status: status,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        gate: gate,
      }),
    }).then(response => response.json())
    .then(data => {
        console.log("New Flight added successfully.", data);
        setFlightNumber('');
        setStatus('');
        setDepartureTime('');
        setArrivalTime('');
        setGate('');
    })
  };

  return (
    <div className="admin-container">
      <h2>Add New Flight</h2>
      <div>
        <label htmlFor="flightnum">Flight Number:</label>
        <input
          id="flightnum"
          type="text"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <input
          id="status"
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="departure">Departure Time:</label>
        <input
          id="departure"
          type="text"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="arrival">Arrival Time:</label>
        <input
          id="arrival"
          type="text"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="gateno">Gate Number:</label>
        <input
          id="gateno"
          type="text"
          value={gate}
          onChange={(e) => setGate(e.target.value)}
        />
      </div>
      <button onClick={handleAddFlight}>Add Flight</button>
    </div>
  );
};

export default AddFlight;
