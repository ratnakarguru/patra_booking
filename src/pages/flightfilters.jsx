import React, { useState } from 'react';
import { 
  FaFilter, FaMoon, FaSun, FaClock, FaCloudSun, 
  FaArrowRotateLeft, FaPlaneDeparture, FaPlaneArrival, FaCheck
} from 'react-icons/fa6';
import 'bootstrap/dist/css/bootstrap.min.css';

const FlightFilters = ({
  priceRange, setPriceRange,
  selectedStops = [], setSelectedStops,
  selectedAirlines = [], setSelectedAirlines,
  uniqueAirlines = [],          
  selectedDepTimes = [], setSelectedDepTimes, 
  selectedArrTimes = [], setSelectedArrTimes, 
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // --- Helper: Toggle Logic ---
  const toggleValue = (value, list, setList) => {
    // Ensure list is an array before checking
    const currentList = list || []; 
    if (currentList.includes(value)) {
      setList(currentList.filter((item) => item !== value));
    } else {
      setList([...currentList, value]);
    }
  };

  const resetAll = () => {
    setPriceRange(15000);
    setSelectedStops([]);
    setSelectedAirlines([]);
    setSelectedDepTimes([]);
    setSelectedArrTimes([]);
  };

  // --- UI Components ---
  
  // 1. Choice Chip (Fixed: Added type="button" and robust styles)
  const ChoiceChip = ({ label, isSelected, onClick }) => (
    <button
      type="button" // <--- Crucial: Prevents form submission/page reload
      onClick={onClick}
      className={`btn btn-sm d-flex align-items-center gap-2 border rounded-pill px-3 py-2 transition-all ${
        isSelected 
          ? 'bg-primary text-white border-primary shadow-sm' 
          : 'bg-light text-secondary border-light'
      }`}
      style={{ fontSize: '0.85rem', transition: '0.2s' }}
    >
      {isSelected && <FaCheck size={10} />}
      {label}
    </button>
  );

  // 2. Time Card
  const TimeOptionCard = ({ label, icon, value, selectedList, setList }) => {
    const isActive = (selectedList || []).includes(value);
    return (
      <div className="col-6">
        <button
          type="button" // <--- Crucial
          className={`btn w-100 p-2 d-flex flex-column align-items-center gap-2 border rounded-3 transition-all ${
            isActive ? 'bg-primary text-white border-primary shadow' : 'btn-light text-secondary border-light'
          }`}
          onClick={() => toggleValue(value, selectedList, setList)}
          style={{ transition: '0.2s' }}
        >
          <div className="fs-5">{icon}</div>
          <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</span>
        </button>
      </div>
    );
  };

  // 3. Section Wrapper
  const FilterSection = ({ title, icon, children }) => (
    <div className="bg-white p-3 rounded-4 mb-3 border border-opacity-10 shadow-sm">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
        {icon} {title}
      </h6>
      {children}
    </div>
  );

  // --- Configuration ---
  const timeConfig = [
    { label: 'Before 6 AM', icon: <FaMoon />, value: 'Before 6 AM' },
    { label: '6 AM - 12 PM', icon: <FaCloudSun />, value: '6 AM - 12 PM' },
    { label: '12 PM - 6 PM', icon: <FaSun />, value: '12 PM - 6 PM' },
    { label: 'After 6 PM', icon: <FaClock />, value: 'After 6 PM' },
  ];

  // --- Main Render Content ---
  const FilterContent = () => (
    <div className="d-flex flex-column gap-1">
      
      {/* Header (Reset) */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
        <span className="fw-bold text-secondary small text-uppercase">Active Filters</span>
        <button 
          type="button"
          onClick={resetAll} 
          className="btn btn-link text-decoration-none text-danger p-0 fw-bold d-flex align-items-center gap-1"
          style={{ fontSize: '0.8rem' }}
        >
          <FaArrowRotateLeft size={12} /> Reset
        </button>
      </div>

      {/* Price Slider */}
      <FilterSection title="Price Range" icon={<FaFilter className="text-primary" />}>
        <div className="px-1">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Up to</span>
            <span className="fw-bold text-primary">₹{priceRange.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            className="form-range" 
            min={3000} max={20000} step={500} 
            value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))} 
          />
        </div>
      </FilterSection>

      {/* Stops */}
      <FilterSection title="Stops" icon={<span className="text-secondary fw-bold">1.</span>}>
        <div className="d-flex flex-wrap gap-2">
          {['Non-Stop', '1 Stop', '2+ Stops'].map((stop) => (
            <ChoiceChip 
              key={stop} 
              label={stop} 
              // This checks if the array includes the EXACT string (e.g. "1 Stop")
              isSelected={selectedStops.includes(stop)} 
              onClick={() => toggleValue(stop, selectedStops, setSelectedStops)} 
            />
          ))}
        </div>
      </FilterSection>

      {/* Departure Time */}
      <FilterSection title="Departure" icon={<FaPlaneDeparture className="text-secondary" />}>
        <div className="row g-2">
          {timeConfig.map((t) => (
            <TimeOptionCard 
              key={t.value} 
              {...t} 
              selectedList={selectedDepTimes} 
              setList={setSelectedDepTimes} 
            />
          ))}
        </div>
      </FilterSection>

      {/* Arrival Time */}
      <FilterSection title="Arrival" icon={<FaPlaneArrival className="text-secondary" />}>
        <div className="row g-2">
          {timeConfig.map((t) => (
            <TimeOptionCard 
              key={t.value} 
              {...t} 
              selectedList={selectedArrTimes} 
              setList={setSelectedArrTimes} 
            />
          ))}
        </div>
      </FilterSection>

      {/* Airlines */}
      <FilterSection title="Airlines" icon={<span className="text-secondary fw-bold">@</span>}>
        <div className="d-flex flex-column gap-2">
          {uniqueAirlines.length > 0 ? uniqueAirlines.map((airline) => (
            <div key={airline} className="form-check">
              <input 
                className="form-check-input cursor-pointer" 
                type="checkbox" 
                id={`airline-${airline}`} 
                checked={selectedAirlines.includes(airline)}
                onChange={() => toggleValue(airline, selectedAirlines, setSelectedAirlines)}
              />
              <label className="form-check-label w-100 small cursor-pointer" htmlFor={`airline-${airline}`}>
                {airline}
              </label>
            </div>
          )) : <div className="text-muted small fst-italic">No airlines available</div>}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* 1. Mobile Trigger Button */}
      <div className="d-lg-none mb-3">
        <button 
          type="button"
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-sm"
          onClick={() => setShowMobileFilters(true)}
        >
          <FaFilter /> Filter Flights
        </button>
      </div>

      {/* 2. Desktop Sidebar */}
      <div className="d-none d-lg-block col-lg-3">
        <div className="sticky-top" style={{ top: '20px', zIndex: 10 }}>
          <h5 className="fw-bold mb-3 px-1">Filters</h5>
          <FilterContent />
        </div>
      </div>

      {/* 3. Mobile Offcanvas */}
      <div 
        className={`offcanvas offcanvas-start ${showMobileFilters ? 'show' : ''}`} 
        tabIndex="-1" 
        style={{ zIndex: 1045, visibility: showMobileFilters ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">Filter Flights</h5>
          <button type="button" className="btn-close" onClick={() => setShowMobileFilters(false)}></button>
        </div>
        <div className="offcanvas-body bg-light">
          <FilterContent />
        </div>
        <div className="offcanvas-header border-top bg-white">
          <button type="button" className="btn btn-primary w-100 rounded-pill py-2" onClick={() => setShowMobileFilters(false)}>
            Show Results
          </button>
        </div>
      </div>
      
      {/* 4. Backdrop */}
      {showMobileFilters && (
        <div 
          className="modal-backdrop fade show d-lg-none" 
          onClick={() => setShowMobileFilters(false)}
          style={{ zIndex: 1040 }}
        ></div>
      )}
    </>
  );
};

export default FlightFilters;