import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './subscribeForm.css'

function SubscribeForm({ flightNumber, onClose }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userId] = useState(uuidv4()); // Generate unique user ID

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Email is required!');
      return;
    }
    fetch('http://localhost:5000/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        flight_number: flightNumber,
        email: email,
        phone: phone
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Subscription added:', data);
      // Clear form fields
      setEmail('');
      setPhone('');
      onClose(); // Close popup after successful subscription
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h2>Subscribe to Flight {flightNumber}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone (optional):</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}

export default SubscribeForm;
