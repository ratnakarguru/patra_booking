import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaUser,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- HELPER: Get Today's Date ---
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// --- REUSABLE COMPONENT: Airport Search ---
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
        return city.includes(userInput.toLowerCase()) || code.includes(userInput.toLowerCase());
      }).slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (airport) => {
    const city = airport.city || "Unknown";
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
      {label && <label className="form-label text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>{label}</label>}
      <div className="input-group input-group-sm">
        <span className="input-group-text bg-light border-end-0 text-secondary">{icon}</span>
        <input
          type="text"
          className="form-control border-start-0 ps-0 bg-light shadow-none"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          style={{ fontSize: '0.85rem' }}
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 shadow-lg start-0" style={{ zIndex: 1050, top: '100%', maxHeight: '200px', overflowY: 'auto' }}>
          {suggestions.map((airport, idx) => (
            <li key={idx} className="list-group-item list-group-item-action py-2" onClick={() => handleSelect(airport)} style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
              <div className="fw-bold">{airport.city} <span className="text-primary">{airport.code}</span></div>
              <div className="text-secondary small">{airport.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- COMPONENT: Traveller Selector (UPDATED DISPLAY) ---
const TravellerSelector = ({ counts, setCounts, cabinClass, setCabinClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const updateCount = (type, operation) => {
    setCounts(prev => {
      let newVal = operation === 'inc' ? prev[type] + 1 : prev[type] - 1;
      if (newVal < 0) newVal = 0;
      if (type === 'adults' && newVal < 1) newVal = 1; // Min 1 adult
      return { ...prev, [type]: newVal };
    });
  };

  // --- LOGIC: Create a string like "2 Adt, 1 Chd, Economy" ---
  const getTravellerSummary = () => {
    let parts = [];
    if (counts.adults > 0) parts.push(`${counts.adults} Adt`);
    if (counts.children > 0) parts.push(`${counts.children} Chd`);
    if (counts.infants > 0) parts.push(`${counts.infants} Inf`);
    
    // Fallback if empty (shouldn't happen due to min 1 adult)
    const paxString = parts.length > 0 ? parts.join(', ') : '1 Traveller';
    
    return `${paxString}, ${cabinClass}`;
  };

  return (
    <div className="position-relative w-100" ref={wrapperRef}>
      <label className="form-label text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Travellers</label>
      <div
        className="input-group input-group-sm bg-light border rounded"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <input
          type="text"
          className="form-control border-0 bg-transparent shadow-none"
          value={getTravellerSummary()} // <--- Using new summary function
          readOnly
          style={{ cursor: 'pointer', fontSize: '0.8rem', textOverflow: 'ellipsis' }}
        />
        <span className="input-group-text border-0 bg-transparent"><FaUser size={12} className="text-secondary" /></span>
      </div>

      {isOpen && (
        <div className="card position-absolute shadow-lg p-3 mt-1" style={{ zIndex: 1060, width: '300px', right: 0 }}>
          <h6 className="fw-bold mb-3 border-bottom pb-2" style={{ fontSize: '0.9rem' }}>Travellers</h6>
          
          {/* Adults */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <div className="fw-bold text-capitalize" style={{ fontSize: '0.85rem' }}>Adults</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>(12+ Yrs)</small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-sm btn-outline-secondary p-0 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => updateCount('adults', 'dec')}><FaMinus size={8} /></button>
              <span className="fw-bold text-center" style={{ width: '20px', fontSize: '0.9rem' }}>{counts.adults}</span>
              <button className="btn btn-sm btn-outline-primary p-0 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => updateCount('adults', 'inc')}><FaPlus size={8} /></button>
            </div>
          </div>

          {/* Children */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <div className="fw-bold text-capitalize" style={{ fontSize: '0.85rem' }}>Children</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>(2-12 Yrs)</small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-sm btn-outline-secondary p-0 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => updateCount('children', 'dec')}><FaMinus size={8} /></button>
              <span className="fw-bold text-center" style={{ width: '20px', fontSize: '0.9rem' }}>{counts.children}</span>
              <button className="btn btn-sm btn-outline-primary p-0 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => updateCount('children', 'inc')}><FaPlus size={8} /></button>
            </div>
          </div>

          {/* Infants */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <div className="fw-bold text-capitalize" style={{ fontSize: '0.85rem' }}>Infants</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>(0-2 Yrs)</small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-sm btn-outline-secondary p-0 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => updateCount('infants', 'dec')}><FaMinus size={8} /></button>
              <span className="fw-bold text-center" style={{ width: '20px', fontSize: '0.9rem' }}>{counts.infants}</span>
              <button className="btn btn-sm btn-outline-primary p-0 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => updateCount('infants', 'inc')}><FaPlus size={8} /></button>
            </div>
          </div>

          <h6 className="fw-bold mb-2 border-top pt-2 mt-2" style={{ fontSize: '0.9rem' }}>Class</h6>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {['Economy', 'Premium', 'Business', 'First'].map((cls) => (
              <button
                key={cls}
                className={`btn btn-sm flex-grow-1 ${cabinClass === cls ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setCabinClass(cls)}
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                {cls}
              </button>
            ))}
          </div>
          <button className="btn btn-primary w-100 btn-sm" onClick={() => setIsOpen(false)}>Done</button>
        </div>
      )}
    </div>
  );
};

// --- MAIN HERO SECTION ---
const HeroSection = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('oneWay');
  const [airportData, setAirportData] = useState([]);
  
  // Search States
  const [standardFrom, setStandardFrom] = useState('');
  const [standardTo, setStandardTo] = useState('');
  const [standardDate, setStandardDate] = useState(getTodayDate());
  const [returnDate, setReturnDate] = useState('');
  const [travellerCounts, setTravellerCounts] = useState({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState('Economy');

  // Multi-City State
  const [multiCitySegments, setMultiCitySegments] = useState([
    { id: 1, from: '', to: '', date: getTodayDate() }
  ]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json')
      .then(res => res.json())
      .then(data => {
        const list = data.map(i => ({ code: i.iata_code, city: i.city, name: i.name })).filter(i => i.code);
        setAirportData(list);
      });
  }, []);

  // --- SEARCH HANDLER ---
  const handleSearch = () => {
    // Validation: Require Return Date if "Return" trip type is selected
    if (tripType === 'return' && !returnDate) {
      alert("Please select a return date.");
      return; 
    }

    let searchData = {
      tripType: tripType,
      travellers: travellerCounts, // Passing full object {adults, children, infants}
      cabinClass: cabinClass
    };

    if (tripType === 'multi') {
      searchData = {
        ...searchData,
        type: 'Multi-City',
        segments: multiCitySegments
      };
    } else {
      searchData = {
        ...searchData,
        type: tripType === 'return' ? 'Round Trip' : 'One Way',
        from: standardFrom,
        to: standardTo,
        date: standardDate,
        returnDate: tripType === 'return' ? returnDate : null // <--- Pass Return Date
      };
    }

    console.log("Navigating with:", searchData);
    navigate('/results', { state: searchData });
  };

  // Multi-City Helpers
  const handleSegmentChange = (id, field, value) => {
    setMultiCitySegments(multiCitySegments.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddSegment = () => {
    const newId = multiCitySegments.length > 0 ? Math.max(...multiCitySegments.map(s => s.id)) + 1 : 1;
    const lastSegment = multiCitySegments[multiCitySegments.length - 1];
    const previousDestination = lastSegment ? lastSegment.to : '';
    setMultiCitySegments([...multiCitySegments, { id: newId, from: previousDestination, to: '', date: getTodayDate() }]);
  };

  const handleRemoveSegment = (id) => {
    setMultiCitySegments(multiCitySegments.filter(s => s.id !== id));
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
      <div className="container">
        <div className="card border-0 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
          <div className="card-body p-3 p-md-4">

            {/* Tabs */}
            <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
              {['oneWay', 'return', 'multi'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`btn rounded-pill px-3 py-1 fw-bold text-nowrap ${tripType === type ? 'btn-dark' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.8rem' }}
                >
                  {type === 'oneWay' ? 'ONE WAY' : type === 'return' ? 'RETURN' : 'MULTI CITY'}
                </button>
              ))}
            </div>

            {tripType === 'multi' ? (
              // --- MULTI CITY VIEW ---
              <div className="multi-city-container">
                {multiCitySegments.map((segment, index) => (
                  <div className="row g-2 align-items-end mb-2" key={segment.id}>
                    <div className="col-6 col-md-3">
                      <AirportInput 
                        label={index === 0 ? "From" : ""} 
                        icon={<FaPlaneDeparture />} 
                        placeholder="From" 
                        value={segment.from} 
                        onChange={(v) => handleSegmentChange(segment.id, 'from', v)} 
                        airportList={airportData} 
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <AirportInput 
                        label={index === 0 ? "To" : ""} 
                        icon={<FaPlaneArrival />} 
                        placeholder="To" 
                        value={segment.to} 
                        onChange={(v) => handleSegmentChange(segment.id, 'to', v)} 
                        airportList={airportData} 
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      {index === 0 && <label className="form-label text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Date</label>}
                      <input type="date" className="form-control form-control-sm bg-light border-1" value={segment.date} min={getTodayDate()} onChange={(e) => handleSegmentChange(segment.id, 'date', e.target.value)} />
                    </div>

                    {index === 0 ? (
                      <>
                        <div className="col-6 col-md-2">
                          <TravellerSelector counts={travellerCounts} setCounts={setTravellerCounts} cabinClass={cabinClass} setCabinClass={setCabinClass} />
                        </div>
                        <div className="col-6 col-md-1 d-grid">
                          <label className="d-none d-md-block">&nbsp;</label>
                          <button className="btn btn-sm btn-dark" onClick={handleAddSegment} title="Add Segment"><FaPlus /></button>
                        </div>
                        <div className="col-6 col-md-1 d-grid">
                          <label className="d-none d-md-block">&nbsp;</label>
                          <button className="btn btn-sm text-white fw-bold" style={{ backgroundColor: '#ff6b00' }} onClick={handleSearch}>Search</button>
                        </div>
                      </>
                    ) : (
                      <div className="col-6 col-md-2 d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveSegment(segment.id)}><FaMinus /></button>
                        <button className="btn btn-sm btn-outline-primary" onClick={handleAddSegment}><FaPlus /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // --- STANDARD VIEW (One Way / Return) ---
              <div className="row g-2">
                <div className="col-6 col-md-2">
                  <AirportInput label="From" icon={<FaPlaneDeparture />} placeholder="Origin" value={standardFrom} onChange={setStandardFrom} airportList={airportData} />
                </div>
                <div className="col-6 col-md-2">
                  <AirportInput label="To" icon={<FaPlaneArrival />} placeholder="Dest" value={standardTo} onChange={setStandardTo} airportList={airportData} />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Depart</label>
                  <input type="date" className="form-control form-control-sm" value={standardDate} min={getTodayDate()} onChange={(e) => setStandardDate(e.target.value)} />
                </div>
                
                {/* --- RETURN DATE FIELD --- */}
                <div className="col-6 col-md-2">
                  <label className={`form-label small fw-bold text-uppercase mb-1 ${tripType === 'oneWay' ? 'text-muted' : 'text-dark'}`} style={{ fontSize: '0.7rem' }}>
                    Return
                  </label>
                  <input 
                    type="date" 
                    className={`form-control form-control-sm ${tripType === 'return' ? 'bg-white border-primary' : 'bg-light'}`} 
                    disabled={tripType === 'oneWay'} 
                    min={standardDate} 
                    value={returnDate} 
                    onChange={(e) => setReturnDate(e.target.value)} 
                  />
                </div>

                <div className="col-12 col-md-2">
                  <TravellerSelector counts={travellerCounts} setCounts={setTravellerCounts} cabinClass={cabinClass} setCabinClass={setCabinClass} />
                </div>
                <div className="col-12 col-md-2 d-grid align-items-end">
                  <button className="btn btn-sm fw-bold text-white py-2" style={{ backgroundColor: '#ff6b00' }} onClick={handleSearch}>SEARCH</button>
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