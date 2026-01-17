import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook
import { 
  FaPlaneDeparture, 
  FaPlaneArrival, 
  FaCalendarAlt, 
  FaUser, 
  FaPlus, 
  FaMinus
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- 1. HELPER: Get Today's Date in YYYY-MM-DD format ---
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// --- 2. REUSABLE COMPONENT: Real-Time Airport Search (FIXED VISIBILITY) ---
const AirportInput = ({ label, icon, value, onChange, placeholder, airportList }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    onChange(userInput); 

    if (userInput.length > 1) { 
      const filtered = airportList.filter((airport) => {
        const city = airport.city ? airport.city.toLowerCase() : "";
        const code = airport.code ? airport.code.toLowerCase() : "";
        const name = airport.name ? airport.name.toLowerCase() : "";
        const search = userInput.toLowerCase();

        return city.includes(search) || code.includes(search) || name.includes(search);
      }).slice(0, 10); 
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (airport) => {
    const city = airport.city || "Unknown City";
    const code = airport.code || "N/A";
    onChange(`${city} (${code})`);
    setShowSuggestions(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="position-relative" ref={wrapperRef}>
      {label && <label className="form-label text-muted small fw-bold text-uppercase">{label}</label>}
      <div className="input-group input-group-sm">
        <span className="input-group-text bg-light border-end-0 text-secondary">{icon}</span>
        <input 
          type="text" 
          className="form-control border-start-0 ps-0 bg-light" 
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => value && value.length > 1 && setShowSuggestions(true)}
        />
      </div>

      {/* Dropdown Results */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 shadow-lg" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
          {suggestions.map((airport, idx) => (
            <li 
              key={`${airport.code}-${idx}`} 
              className="list-group-item list-group-item-action py-2" // Added padding
              style={{ cursor: 'pointer', fontSize: '0.9rem' }}
              onClick={() => handleSelect(airport)}
            >
              {/* City and Code */}
              <div className="fw-bold text-dark d-flex justify-content-between">
                <span>{airport.city || "Unknown City"}</span>
                <span className="text-primary fw-bold">{airport.code}</span>
              </div>
              
              {/* Airport Name - UPDATED HERE */}
              <div className="text-secondary small text-wrap lh-sm mt-1">
                <i className="fas fa-plane me-1"></i> {/* Optional: visual cue */}
                {airport.name || "Airport"}, {airport.country || ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
// --- 3. MAIN HERO SECTION ---
const HeroSection = () => {
  const navigate = useNavigate(); // 2. Initialize Navigation
  
  const [tripType, setTripType] = useState('oneWay');
  const [airportData, setAirportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Standard View State
  const [standardFrom, setStandardFrom] = useState('');
  const [standardTo, setStandardTo] = useState('');
  const [standardDate, setStandardDate] = useState(getTodayDate()); 
  const [returnDate, setReturnDate] = useState('');

  // Multi-City State
  const [multiCitySegments, setMultiCitySegments] = useState([
    { id: 1, from: '', to: '', date: getTodayDate() }
  ]);

useEffect(() => {
    // Using Algolia's public airport dataset (Fast & Reliable)
    fetch('https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json')
      .then(response => response.json())
      .then(data => {
        // Map the raw data to a cleaner format
        const formattedAirports = data.map(item => ({
          code: item.iata_code,
          city: item.city,
          name: item.name,
          country: item.country
        })).filter(item => item.code); // Ensure code exists
        
        setAirportData(formattedAirports);
        setIsLoading(false);
      })
      .catch(err => console.error("Failed to load airports", err));
  }, []);

  // --- HANDLE SEARCH (Moved here correctly) ---
  const handleSearch = () => {
    let searchData = {};

    if (tripType === 'multi') {
      searchData = {
        type: 'Multi-City',
        segments: multiCitySegments,
        travellers: '1 Adult'
      };
    } else {
      searchData = {
        type: tripType === 'return' ? 'Round Trip' : 'One Way',
        from: standardFrom,
        to: standardTo,
        date: standardDate,
        returnDate: tripType === 'return' ? returnDate : null,
        travellers: '1 Adult'
      };
    }

    // Navigate to Results Page with Data
    navigate('/results', { state: searchData });
  };

  const handleSegmentChange = (id, field, value) => {
    const updatedSegments = multiCitySegments.map(segment =>
      segment.id === id ? { ...segment, [field]: value } : segment
    );
    setMultiCitySegments(updatedSegments);
  };

  const handleAddSegment = () => {
    const newId = multiCitySegments.length > 0 ? Math.max(...multiCitySegments.map(s => s.id)) + 1 : 1;
    setMultiCitySegments([...multiCitySegments, { id: newId, from: '', to: '', date: getTodayDate() }]);
  };

  const handleRemoveSegment = (id) => {
    setMultiCitySegments(multiCitySegments.filter(segment => segment.id !== id));
  };

  const bgImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
  const brandOrange = '#ff6b00';

  return (
    <div 
      className="position-relative d-flex align-items-center justify-content-center" 
      style={{ 
        backgroundImage: `url(${bgImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '600px',
        paddingTop: '80px', paddingBottom: '80px'
      }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      <div className="container position-relative z-1">
        <div className="card border-0 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
          <div className="card-body p-4">
            
            {/* Tabs */}
            <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
              {['oneWay', 'return', 'multi'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`btn rounded-pill px-4 fw-bold text-nowrap ${tripType === type ? 'btn-dark' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.9rem' }}
                >
                  {type === 'oneWay' ? 'ONE WAY' : type === 'return' ? 'RETURN' : 'MULTI CITY'}
                </button>
              ))}
            </div>

            {/* --- MULTI CITY LOGIC --- */}
            {tripType === 'multi' ? (
              <div className="multi-city-container">
                {multiCitySegments.map((segment, index) => (
                  <div className="row g-2 align-items-end mb-2" key={segment.id}>
                    
                    {/* From */}
                    <div className="col-lg-2 col-md-6">
                      <AirportInput 
                        label={index === 0 ? "From" : null}
                        icon={<FaPlaneDeparture />}
                        placeholder={isLoading ? "Loading..." : "From City"}
                        value={segment.from}
                        onChange={(val) => handleSegmentChange(segment.id, 'from', val)}
                        airportList={airportData} 
                      />
                    </div>

                    {/* To */}
                    <div className="col-lg-2 col-md-6">
                      <AirportInput 
                        label={index === 0 ? "To" : null}
                        icon={<FaPlaneArrival />}
                        placeholder={isLoading ? "Loading..." : "To City"}
                        value={segment.to}
                        onChange={(val) => handleSegmentChange(segment.id, 'to', val)}
                        airportList={airportData}
                      />
                    </div>

                    {/* Date */}
                    <div className="col-lg-2 col-md-6">
                      {index === 0 && <label className="form-label text-muted small fw-bold text-uppercase">Date</label>}
                      <div className="input-group input-group-sm">
                        <input 
                          type="date" 
                          className="form-control border-end-0 bg-light" 
                          value={segment.date} 
                          min={getTodayDate()} 
                          onChange={(e) => handleSegmentChange(segment.id, 'date', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Row 1 Actions */}
                    {index === 0 ? (
                      <>
                        <div className="col-lg-2 col-md-6">
                          <label className="form-label text-muted small fw-bold text-uppercase">Travellers</label>
                          <div className="input-group input-group-sm">
                            <input type="text" className="form-control border-end-0 bg-light" placeholder="1 Adult" />
                            <span className="input-group-text bg-light border-start-0"><FaUser className="text-secondary" /></span>
                          </div>
                        </div>

                        <div className="col-lg-2 col-md-6 d-grid">
                           <label className="form-label d-none d-lg-block">&nbsp;</label> 
                           <button 
                            className="btn fw-bold text-white py-2" 
                            style={{ backgroundColor: '#ff6b00' }}
                            onClick={handleSearch}>SEARCH</button>
                        </div>

                        <div className="col-lg-2 col-md-6 d-flex align-items-end">
                          <label className="form-label d-none d-lg-block">&nbsp;</label> 
                          <button 
                            className="btn btn-sm btn-outline-dark rounded-circle d-flex align-items-center justify-content-center ms-2"
                            style={{ width: '32px', height: '32px' }}
                            onClick={handleAddSegment}
                            title="Add Flight"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </>
                    ) : (
                      // Subsequent Rows
                      <div className="col-lg-2 col-md-6 d-flex align-items-end pb-1">
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => handleRemoveSegment(segment.id)}
                        >
                          <FaMinus size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // --- STANDARD VIEW (One Way / Return) ---
              <div className="row g-3">
                <div className="col-md-6 col-lg-2">
                  <AirportInput 
                    label="From"
                    icon={<FaPlaneDeparture />}
                    placeholder={isLoading ? "Loading..." : "From City"}
                    value={standardFrom}
                    onChange={setStandardFrom}
                    airportList={airportData}
                  />
                </div>
                <div className="col-md-6 col-lg-2">
                  <AirportInput 
                    label="To"
                    icon={<FaPlaneArrival />}
                    placeholder={isLoading ? "Loading..." : "To City"}
                    value={standardTo}
                    onChange={setStandardTo}
                    airportList={airportData}
                  />
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label text-muted small fw-bold text-uppercase">Departure</label>
                  <div className="input-group">
                    <input 
                       type="date" 
                       className="form-control border-end-0" 
                       value={standardDate} 
                       min={getTodayDate()} 
                       onChange={(e) => setStandardDate(e.target.value)}
                    />
                    <span className="input-group-text bg-white border-start-0"><FaCalendarAlt className="text-secondary" /></span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label text-muted small fw-bold text-uppercase">Return</label>
                  <div className="input-group">
                    <input 
                      type="date" 
                      className="form-control border-end-0" 
                      disabled={tripType === 'oneWay'} 
                      min={standardDate} 
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                    <span className="input-group-text bg-white border-start-0"><FaCalendarAlt className="text-secondary" /></span>
                  </div>
                </div>
                <div className="col-md-12 col-lg-2">
                  <label className="form-label text-muted small fw-bold text-uppercase">Travellers</label>
                  <div className="input-group">
                    <input type="text" className="form-control border-end-0" placeholder="1 Adult" />
                    <span className="input-group-text bg-white border-start-0"><FaUser className="text-secondary" /></span>
                  </div>
                </div>
                <div className="col-md-12 col-lg-2 d-grid align-items-end">
                  {/* Fixed: Added onClick handler here */}
                  <button 
                    className="btn fw-bold text-white py-2" 
                    style={{ backgroundColor: brandOrange }}
                    onClick={handleSearch}
                  >
                    SEARCH
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;