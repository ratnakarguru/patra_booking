import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaUser,
  FaPlus,
  FaMinus,
  FaExclamationCircle,
  FaHistory // Imported history icon
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- HELPER: Get Today's Date ---
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// --- HELPER: Format Date for Display (e.g., "25 Oct") ---
const formatDateDisplay = (dateString) => {
  if (!dateString) return '';
  const options = { day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// --- REUSABLE COMPONENT: Airport Search ---
const AirportInput = ({ label, icon, value, onChange, placeholder, airportList, isInvalid }) => {
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
      <div className={`input-group input-group-sm ${isInvalid ? 'border border-danger rounded' : ''}`}>
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

// --- COMPONENT: Traveller Selector ---
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
      if (type === 'adults' && newVal < 1) newVal = 1; 
      return { ...prev, [type]: newVal };
    });
  };

  const getTravellerSummary = () => {
    let parts = [];
    if (counts.adults > 0) parts.push(`${counts.adults} Adt`);
    if (counts.children > 0) parts.push(`${counts.children} Chd`);
    if (counts.infants > 0) parts.push(`${counts.infants} Inf`);
    
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
          value={getTravellerSummary()} 
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
  const [error, setError] = useState('');
  
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

  // --- NEW: Recent Searches State ---
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load Airports
    fetch('https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json')
      .then(res => res.json())
      .then(data => {
        const list = data.map(i => ({ code: i.iata_code, city: i.city, name: i.name })).filter(i => i.code);
        setAirportData(list);
      });

    // --- NEW: Load Recent Searches from LocalStorage ---
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // --- Validation Logic ---
  const validateSearch = () => {
    setError('');

    if (tripType === 'multi') {
      for (let i = 0; i < multiCitySegments.length; i++) {
        const seg = multiCitySegments[i];
        if (!seg.from.trim() || !seg.to.trim()) {
          setError(`Please select both origin and destination for Flight ${i + 1}.`);
          return false;
        }
        if (seg.from.trim().toLowerCase() === seg.to.trim().toLowerCase()) {
          setError(`Origin and Destination cannot be the same for Flight ${i + 1}.`);
          return false;
        }
        if (!seg.date) {
            setError(`Please select a date for Flight ${i + 1}.`);
            return false;
        }
        if (i > 0) {
            const prevDate = new Date(multiCitySegments[i-1].date);
            const currDate = new Date(seg.date);
            if (currDate < prevDate) {
                setError(`Flight ${i+1} cannot depart before Flight ${i}.`);
                return false;
            }
        }
      }
    } else {
      if (!standardFrom.trim()) {
        setError('Please select an Origin airport.');
        return false;
      }
      if (!standardTo.trim()) {
        setError('Please select a Destination airport.');
        return false;
      }
      if (standardFrom.trim().toLowerCase() === standardTo.trim().toLowerCase()) {
        setError('Origin and Destination cannot be the same.');
        return false;
      }
      if (!standardDate) {
        setError('Please select a departure date.');
        return false;
      }

      if (tripType === 'return') {
        if (!returnDate) {
          setError("Please select a return date.");
          return false;
        }
        if (new Date(returnDate) < new Date(standardDate)) {
          setError("Return date cannot be before departure date.");
          return false;
        }
      }
    }
    return true;
  };

  // --- NEW: Helper to Save Search ---
  const saveRecentSearch = () => {
    const newSearch = {
      tripType,
      travellers: travellerCounts,
      cabinClass,
      // Store specific data based on type
      standardFrom: tripType !== 'multi' ? standardFrom : null,
      standardTo: tripType !== 'multi' ? standardTo : null,
      standardDate: tripType !== 'multi' ? standardDate : null,
      returnDate: tripType === 'return' ? returnDate : null,
      multiCitySegments: tripType === 'multi' ? multiCitySegments : null,
      timestamp: Date.now()
    };

    // Filter duplicates (simple check based on From/To/Date)
    const existing = recentSearches.filter(item => {
        // Very basic deduplication logic
        if (item.tripType !== newSearch.tripType) return true;
        if (newSearch.tripType === 'multi') return true; // Always save multi for now complexity
        return !(item.standardFrom === newSearch.standardFrom && item.standardTo === newSearch.standardTo && item.standardDate === newSearch.standardDate);
    });

    const updatedList = [newSearch, ...existing].slice(0, 5); // Keep last 5
    setRecentSearches(updatedList);
    localStorage.setItem('recentSearches', JSON.stringify(updatedList));
  };

  // --- NEW: Restore a Recent Search ---
  const applyRecentSearch = (search) => {
    setTripType(search.tripType);
    setTravellerCounts(search.travellers);
    setCabinClass(search.cabinClass);

    if (search.tripType === 'multi') {
        setMultiCitySegments(search.multiCitySegments);
    } else {
        setStandardFrom(search.standardFrom);
        setStandardTo(search.standardTo);
        setStandardDate(search.standardDate);
        if (search.tripType === 'return') {
            setReturnDate(search.returnDate);
        }
    }
    setError(''); // Clear errors
  };

  // --- SEARCH HANDLER ---
  const handleSearch = () => {
    if (!validateSearch()) return;

    // Save to History
    saveRecentSearch();

    // Prepare Data for Navigation
    let searchData = {
      tripType: tripType,
      travellers: travellerCounts,
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
        returnDate: tripType === 'return' ? returnDate : null
      };
    }

    console.log("Navigating with:", searchData);
    navigate('/results', { state: searchData });
  };

  // Multi-City Helpers
  const handleSegmentChange = (id, field, value) => {
    setMultiCitySegments(multiCitySegments.map(s => s.id === id ? { ...s, [field]: value } : s));
    setError('');
  };

  const handleAddSegment = () => {
    const newId = multiCitySegments.length > 0 ? Math.max(...multiCitySegments.map(s => s.id)) + 1 : 1;
    const lastSegment = multiCitySegments[multiCitySegments.length - 1];
    const previousDestination = lastSegment ? lastSegment.to : '';
    const previousDate = lastSegment ? lastSegment.date : getTodayDate();
    setMultiCitySegments([...multiCitySegments, { id: newId, from: previousDestination, to: '', date: previousDate }]);
  };

  const handleRemoveSegment = (id) => {
    setMultiCitySegments(multiCitySegments.filter(s => s.id !== id));
  };

  const bgImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

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
            
            {/* Validation Error Alert */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center py-2 mb-3" role="alert">
                <FaExclamationCircle className="me-2" />
                <div style={{ fontSize: '0.9rem' }}>{error}</div>
              </div>
            )}

            {/* Tabs */}
            <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
              {['oneWay', 'return', 'multi'].map((type) => (
                <button
                  key={type}
                  onClick={() => { setTripType(type); setError(''); }}
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
                        isInvalid={error && !segment.from} 
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
                        isInvalid={error && !segment.to}
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      {index === 0 && <label className="form-label text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Date</label>}
                      <input 
                        type="date" 
                        className="form-control form-control-sm bg-light border-1" 
                        value={segment.date} 
                        min={index === 0 ? getTodayDate() : multiCitySegments[index-1]?.date}
                        onChange={(e) => handleSegmentChange(segment.id, 'date', e.target.value)} 
                      />
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
                  <AirportInput 
                    label="From" 
                    icon={<FaPlaneDeparture />} 
                    placeholder="Origin" 
                    value={standardFrom} 
                    onChange={(v) => { setStandardFrom(v); setError(''); }} 
                    airportList={airportData}
                    isInvalid={error && !standardFrom} 
                  />
                </div>
                <div className="col-6 col-md-2">
                  <AirportInput 
                    label="To" 
                    icon={<FaPlaneArrival />} 
                    placeholder="Dest" 
                    value={standardTo} 
                    onChange={(v) => { setStandardTo(v); setError(''); }} 
                    airportList={airportData}
                    isInvalid={error && !standardTo}
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Depart</label>
                  <input type="date" className="form-control form-control-sm" value={standardDate} min={getTodayDate()} onChange={(e) => setStandardDate(e.target.value)} />
                </div>
                
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
                    onChange={(e) => { setReturnDate(e.target.value); setError(''); }} 
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

            {/* --- NEW: RECENT SEARCHES BAR --- */}
            {recentSearches.length > 0 && (
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaHistory className="text-secondary" />
                  <small className="fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem' }}>Recent Searches</small>
                </div>
                <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {recentSearches.map((item, idx) => {
                    // Generate Label logic
                    let label = "";
                    let subLabel = "";
                    
                    if (item.tripType === 'multi') {
                        // Example: DEL -> BOM -> GOA
                        const cities = item.multiCitySegments.map(s => s.from.split('(')[0].trim()).join(' → ');
                        label = cities + ' → ' + item.multiCitySegments[item.multiCitySegments.length-1].to.split('(')[0].trim();
                        subLabel = "Multi-City";
                    } else {
                        // Example: DEL -> BOM
                        const fromCity = item.standardFrom.split('(')[0].trim();
                        const toCity = item.standardTo.split('(')[0].trim();
                        label = `${fromCity} ➝ ${toCity}`;
                        subLabel = `${formatDateDisplay(item.standardDate)} ${item.tripType === 'return' ? '- ' + formatDateDisplay(item.returnDate) : ''}`;
                    }

                    return (
                      <div 
                        key={idx} 
                        className="border rounded bg-light px-3 py-1 flex-shrink-0 d-flex flex-column justify-content-center"
                        style={{ cursor: 'pointer', minWidth: '140px' }}
                        onClick={() => applyRecentSearch(item)}
                        title="Click to reload this search"
                      >
                         <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.8rem', maxWidth: '180px' }}>{label}</div>
                         <div className="text-muted small" style={{ fontSize: '0.7rem' }}>{subLabel}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {/* --- END RECENT SEARCHES --- */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;