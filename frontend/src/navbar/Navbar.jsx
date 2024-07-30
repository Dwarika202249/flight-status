// import React from 'react'
// import './navbar.css'
// import logo from '../assets/logo.png'

// const Navbar = () => {
//   return (
//     <div className="navbar">
//         <div className="left-nav">
//           <img className='logo' src={logo} alt="logo" />
//         </div>
//         <div className="right-nav">

//         </div>
//     </div>
//   )
// }

// export default Navbar

// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import './navbar.css';
import logo from '../assets/logo.png'; 
import bg1 from '../assets/bg1.jpg'; 
import bg2 from '../assets/bg2.jpg';
import bg3 from '../assets/bg3.jpg';

const backgrounds = [bg1, bg2, bg3];

const Navbar = () => {
  const [bgImage, setBgImage] = useState(backgrounds[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBgImage(prevImage => {
        const currentIndex = backgrounds.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % backgrounds.length;
        return backgrounds[nextIndex];
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="navbar" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="left-nav">
        <img className="logo" src={logo} alt="logo" />
        <h1 className='indigo-text'>IndiGo</h1>
      </div>
      <div className="right-nav">
        <h1 className="overlay-text">Flight Notification System</h1>
      </div>
    </div>
  );
};

export default Navbar;
