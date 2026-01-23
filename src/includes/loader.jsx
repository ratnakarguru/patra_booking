import React from 'react';
import './loader.css';

// --- IMPORTANT: IMAGE IMPORTS ---
// Replace these paths with where your images actually are in your React project.
// If they are in 'public/assets/', you can use string paths directly in the <img> src.
// If they are in 'src/assets/', keep these imports.
import imgLd2 from '../assets/ld2.png'; 
import imgBgBottom from '../assets/load-bgbottom.png';
import gifFlightLoader from '../assets/flt-newloader.gif';
import gifReverseFlightLoader from '../assets/reverse-fltloader.gif';

const FlightLoader = ({
  routeFrom = "DEL",
  routeTo = "BOM",
  fromAirport = "New Delhi",
  toAirport = "Mumbai",
  travelDate = new Date(), // Accepts Date object or string
  returnDate = null,       // Null if one-way
  loadingMessage = "Travel made simple just book on your phone"
}) => {

  // Javascript helper to mimic PHP's date("D, d M Y")
  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    // Returns format like: "Fri, 20 Oct 2023"
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Javascript helper to mimic PHP's ucfirst (Capitalize first letter)
  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div id="load-over">
      <div className="loading-content">
        
        {/* Top Content */}
        <div className="row" style={{ display: 'flex' }}>
          <div style={{ flex: 1, textAlign: 'left', paddingRight: '10px' }}>
            <div className="lds-txt">Welcome to flight Bookings</div>
            <p className="plds-txt">{loadingMessage}</p>
          </div>
          
          <div style={{ flex: 1 }}>
            <div className="new-ld-im">
              <img src={imgLd2} alt="clouds" />
            </div>
          </div>
        </div>

        {/* Bottom Background Image */}
        <div className="new-ld-im2">
          <img src={imgBgBottom} alt="bg-bottom" />
        </div>

        {/* Flight Details Overlay */}
        <div className="ld-text">
          <div className="flight-load-bottom">
            
            {/* Origin Column */}
            <div className="flight-col">
              <span className="loaderfont20" id='airportname'>{routeFrom}</span>
              {/* <p className="flight-nameloader">{capitalize(fromAirport)}</p> */}
            </div>

            {/* Animation Center Column */}
            <div className="flight-col">
              <img src={gifFlightLoader} alt="plane-anim" style={{ height: '30px' }} />
              <p className="flight-nameloader">{formatDate(travelDate)}</p>
              
              {/* Conditional Render for Return Flight */}
              {returnDate && (
                <>
                  <div style={{ marginTop: '5px' }}></div>
                  <img src={gifReverseFlightLoader} alt="return-anim" style={{ height: '30px' }} />
                  <p className="flight-nameloader">{formatDate(returnDate)}</p>
                </>
              )}
            </div>

            {/* Destination Column */}
            <div className="flight-col">
              <span className="loaderfont20" id='airportname'>{routeTo}</span>
              {/* <p className=" loaderfont20">{capitalize(toAirport)}</p> */}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default FlightLoader;