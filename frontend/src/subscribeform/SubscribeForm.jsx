import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './subscribeForm.css'

function SubscribeForm({ flightNumber}) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userId] = useState(uuidv4()); // Generate unique user ID
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Email is required!');
      return;
    }
    fetch('https://flight-backend-6qlx.onrender.com/subscribe', {
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
      setMessage('Subscribed successfully!');
      // Clear form fields
      setEmail('');
      setPhone('');
    })
    .catch(error => {console.error('Error:', error)
      setMessage('Failed to subscribe for notifications.')
    });
    ;
  };

  return (
    <div className="subscribe-form-container">
      <h2>Subscribe to Flight {flightNumber}</h2>
      <form onSubmit={handleSubmit}>
        <div className='susbcribe-details-container'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='susbcribe-details-container'>
          <label>Phone (optional):</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit">Subscribe</button>
      </form>
      {message && <p className='subs-message'>{message}</p>}
    </div>
  );
}

export default SubscribeForm;
