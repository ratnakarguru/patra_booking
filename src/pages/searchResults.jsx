import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaPlane, 
  FaRupeeSign, 
  FaArrowRight, 
  FaFilter, 
  FaSun, 
  FaMoon, 
  FaCloudSun, 
  FaClock 
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';


const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = location.state || {};
  const { from, to, date } = searchParams;

  // --- STATE ---
  const [allFlights, setAllFlights] = useState([]); // Stores raw data
  const [filteredFlights, setFilteredFlights] = useState([]); // Stores filtered data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FILTER STATES ---
  const [priceRange, setPriceRange] = useState(15000);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);

  // --- HELPER: Extract Airport Code ---
  const getCode = (str) => {
    if (!str) return '';
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1] : str; 
  };
  const originCode = getCode(from);
  const destCode = getCode(to);

  // --- HELPER: Airline Logos ---
  const getAirlineLogo = (airlineName) => {
    const logos = {
      "IndiGo": "https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg",
      "Air India": "https://www.logo.wine/a/logo/Air_India/Air_India-Logo.wine.svg",
      "Vistara": "https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg",
      "SpiceJet": "https://1000logos.net/wp-content/uploads/2021/07/SpiceJet-Logo.png",
      "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Akasa_Air_logo.svg/960px-Akasa_Air_logo.svg.png?20211225210806",
      "AirAsia": "https://www.logo.wine/a/logo/AirAsia_India/AirAsia_India-Logo.wine.svg"
    };
    return logos[airlineName] || null;
  };

  // --- HELPER: Time Slots ---
  const getTimeSlot = (timeStr) => {
    const hour = parseInt(timeStr.split(':')[0]);
    if (hour < 6) return 'Before 6 AM';
    if (hour >= 6 && hour < 12) return '6 AM - 12 PM';
    if (hour >= 12 && hour < 18) return '12 PM - 6 PM';
    return 'After 6 PM';
  };

  // --- 1. FETCH DATA ---
  useEffect(() => {
    setLoading(true);
    const FLIGHTS_API_URL = "https://gist.githubusercontent.com/ratnakarguru/9c7e9b4ffcdbf653fe8c467b470f2eec/raw";

    fetch(FLIGHTS_API_URL)
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          const matchedFlights = data
            .filter(flight => {
              if (!originCode || !destCode) return true;
              return (
                flight.origin?.toUpperCase() === originCode.toUpperCase() && 
                flight.destination?.toUpperCase() === destCode.toUpperCase()
              );
            })
            .map(flight => ({ ...flight, date: date }));

          setAllFlights(matchedFlights);
          setFilteredFlights(matchedFlights); // Initialize filtered list
          setLoading(false);
        }, 800);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load flights.");
        setLoading(false);
      });
  }, [originCode, destCode, date]);

  // --- 2. FILTER LOGIC ---
  useEffect(() => {
    let result = allFlights;

    // Filter by Price
    result = result.filter(flight => flight.price <= priceRange);

    // Filter by Stops
    if (selectedStops.length > 0) {
      result = result.filter(flight => selectedStops.includes(flight.stops));
    }

    // Filter by Airlines
    if (selectedAirlines.length > 0) {
      result = result.filter(flight => selectedAirlines.includes(flight.airline));
    }

    // Filter by Time
    if (selectedTimes.length > 0) {
      result = result.filter(flight => selectedTimes.includes(getTimeSlot(flight.departureTime)));
    }

    setFilteredFlights(result);
  }, [priceRange, selectedStops, selectedAirlines, selectedTimes, allFlights]);

  // --- HANDLERS ---
  const handleCheckboxChange = (e, state, setState) => {
    const { value, checked } = e.target;
    if (checked) {
      setState([...state, value]);
    } else {
      setState(state.filter(item => item !== value));
    }
  };

  const handleTimeSelect = (slot) => {
    if (selectedTimes.includes(slot)) {
      setSelectedTimes(selectedTimes.filter(t => t !== slot));
    } else {
      setSelectedTimes([...selectedTimes, slot]);
    }
  };

  // Get unique airlines from available flights for the filter list
  const uniqueAirlines = [...new Set(allFlights.map(f => f.airline))];

  return (
    <div className="bg-light min-vh-100 pb-5">
      
      {/* Top Header */}
      <div className="bg-dark text-white py-3 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                {originCode || 'Origin'} <FaArrowRight size={14}/> {destCode || 'Dest'}
              </h5>
              <small className="text-white-50">{date} | 1 Adult | Economy</small>
            </div>
            <button className="btn btn-sm btn-outline-light rounded-pill px-4" onClick={() => navigate('/')}>
              Modify Search
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          
          {/* --- LEFT SIDEBAR (FILTERS) --- */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm p-3 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h6 className="fw-bold mb-0"><FaFilter className="me-2 text-primary"/>Filters</h6>
                <button 
                  className="btn btn-link btn-sm text-decoration-none p-0" 
                  onClick={() => {
                    setPriceRange(15000);
                    setSelectedStops([]);
                    setSelectedAirlines([]);
                    setSelectedTimes([]);
                  }}
                >
                  Reset
                </button>
              </div>

              {/* 1. Price Filter */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Max Price: ₹{priceRange.toLocaleString()}</label>
                <input 
                  type="range" 
                  className="form-range" 
                  min="3000" 
                  max="20000" 
                  step="500" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))} 
                />
                <div className="d-flex justify-content-between small text-muted">
                  <span>₹3k</span>
                  <span>₹20k</span>
                </div>
              </div>

              {/* 2. Stops Filter */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Stops</label>
                {['Non-Stop', '1 Stop', '2+ Stops'].map((stop) => (
                  <div className="form-check" key={stop}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      value={stop} 
                      checked={selectedStops.includes(stop)}
                      onChange={(e) => handleCheckboxChange(e, selectedStops, setSelectedStops)}
                    />
                    <label className="form-check-label small">{stop}</label>
                  </div>
                ))}
              </div>

              {/* 3. Departure Time Filter */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Departure Time</label>
                <div className="row g-2">
                  {[
                    { label: 'Before 6 AM', icon: <FaMoon/>, value: 'Before 6 AM' },
                    { label: '6 AM - 12 PM', icon: <FaCloudSun/>, value: '6 AM - 12 PM' },
                    { label: '12 PM - 6 PM', icon: <FaSun/>, value: '12 PM - 6 PM' },
                    { label: 'After 6 PM', icon: <FaClock/>, value: 'After 6 PM' }
                  ].map((time) => (
                    <div className="col-6" key={time.value}>
                      <button 
                        className={`btn btn-sm w-100 d-flex flex-column align-items-center py-2 ${selectedTimes.includes(time.value) ? 'btn-primary text-white' : 'btn-outline-light text-dark border'}`}
                        onClick={() => handleTimeSelect(time.value)}
                      >
                        <span className="mb-1">{time.icon}</span>
                        <span style={{ fontSize: '0.7rem' }}>{time.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Airlines Filter */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Airlines</label>
                {uniqueAirlines.length > 0 ? uniqueAirlines.map((airline) => (
                  <div className="form-check" key={airline}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      value={airline}
                      checked={selectedAirlines.includes(airline)}
                      onChange={(e) => handleCheckboxChange(e, selectedAirlines, setSelectedAirlines)}
                    />
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <label className="form-check-label small ms-1">{airline}</label>
                    </div>
                  </div>
                )) : <div className="small text-muted">No airlines found</div>}
              </div>

            </div>
          </div>

          {/* --- RIGHT COLUMN (RESULTS) --- */}
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Scanning airlines...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : filteredFlights.length > 0 ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                   <h5 className="fw-bold text-dark mb-0">Flights from {originCode} to {destCode}</h5>
                   <span className="badge bg-secondary">{filteredFlights.length} found</span>
                </div>
                
                {filteredFlights.map((flight) => (
                  <div key={flight.id} className="card border-0 shadow-sm mb-3 hover-shadow transition-all">
                    <div className="card-body">
                      <div className="row align-items-center text-center text-md-start">
                        
                        {/* AIRLINE LOGO & NAME */}
                        <div className="col-md-3 mb-3 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                          <div style={{ width: '50px', height: '50px' }} className="d-flex align-items-center justify-content-center">
                             {getAirlineLogo(flight.airline) ? (
                               <img 
                                 src={getAirlineLogo(flight.airline)} 
                                 alt={flight.airline} 
                                 className="img-fluid" 
                                 style={{ maxHeight: '35px', objectFit: 'contain' }} 
                               />
                             ) : (
                               <FaPlane size={24} className="text-secondary" />
                             )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{flight.airline}</div>
                            <div className="small text-muted">{flight.flightCode}</div>
                          </div>
                        </div>

                        {/* TIMING & DURATION */}
                        <div className="col-md-4 mb-3 mb-md-0">
                          <div className="d-flex align-items-center justify-content-between px-2">
                            <div className="text-center">
                              <div className="h5 mb-0 fw-bold">{flight.departureTime}</div>
                              <div className="small text-muted">{flight.origin}</div>
                            </div>
                            <div className="d-flex flex-column align-items-center small text-muted px-2">
                              <span>{flight.duration}</span>
                              <div className="border-top w-100 my-1 position-relative" style={{ borderColor: '#ddd', width: '60px' }}>
                                <FaPlane className="position-absolute start-50 top-0 translate-middle text-secondary bg-white px-1" style={{ fontSize: '10px' }}/>
                              </div>
                              <span className="badge bg-light text-dark border">{flight.stops}</span>
                            </div>
                            <div className="text-center">
                              <div className="h5 mb-0 fw-bold">{flight.arrivalTime}</div>
                              <div className="small text-muted">{flight.destination}</div>
                            </div>
                          </div>
                        </div>

                        {/* PRICE & BUTTON */}
                        <div className="col-md-5 d-flex align-items-center justify-content-center justify-content-md-end gap-3 border-start-md ps-md-4">
                          <div className="text-end">
                            <div className="h4 mb-0 fw-bold d-flex align-items-center justify-content-end text-dark">
                              <FaRupeeSign size={18}/> {flight.price.toLocaleString()}
                            </div>
                            <div className="small text-success fw-bold" style={{ fontSize: '0.75rem' }}>Free Cancellation</div>
                          </div>
                          <button 
  className="btn fw-bold text-white rounded-pill px-4 shadow-sm" 
  style={{ backgroundColor: '#ff6b00' }}
  onClick={() => navigate('/book', { state: flight })}
>
  BOOK
</button>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
               <div className="text-center py-5 bg-white rounded shadow-sm">
                 <FaFilter size={40} className="text-muted mb-3 opacity-25" />
                 <h4>No flights match your filters</h4>
                 <p className="text-muted">Try adjusting your price range or filters.</p>
                 <button 
                   className="btn btn-outline-primary mt-2" 
                   onClick={() => {
                     setPriceRange(20000);
                     setSelectedStops([]);
                     setSelectedAirlines([]);
                     setSelectedTimes([]);
                   }}
                 >
                   Clear Filters
                 </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;