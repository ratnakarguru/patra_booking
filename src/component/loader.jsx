import React from 'react';
import './loading.css';

// Import your GIF here
import loadingGif from '../assets/loading.gif'; 

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        
        {/* GIF Image */}
        <img src={loadingGif} alt="Loading..." className="loader-gif" />
        
        {/* Loading Text */}
        {/* <h4 className="mt-3 text-dark fw-bold">Searching Best Flights...</h4>
        <p className="text-muted">Please wait while we fetch the best deals.</p> */}
        
      </div>
    </div>
  );
};

export default Loader;