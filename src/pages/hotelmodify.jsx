import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { City } from 'country-state-city';

const formatDate = (date) => 
  date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Select Date';

// Helper to ensure input gets YYYY-MM-DD format
const getInputValue = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    // Return YYYY-MM-DD manually to avoid timezone shifts
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return '';
  }
};

const ModifySearch = ({ searchParams, setSearchParams, searchText, setSearchText }) => {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'location' or 'dates'
  const dropdownRef = useRef(null);

  // Memoize city list for performance
  const allIndianCities = useMemo(() => City.getCitiesOfCountry('IN'), []);

  // Filter cities only when searchText changes
  const suggestions = useMemo(() => {
    if (searchText.length < 2) return [];
    return allIndianCities
      .filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()))
      .slice(0, 6);
  }, [searchText, allIndianCities]);

  // --- CLICK OUTSIDE LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. If click is inside the dropdown, ignore.
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      }

      // 2. Fix for Native Pickers: Check active element
      if (
        document.activeElement && 
        document.activeElement.type === 'date' && 
        dropdownRef.current && 
        dropdownRef.current.contains(document.activeElement)
      ) {
        return;
      }

      // Otherwise, close the dropdown
      setActiveDropdown(null);
    };

    document.addEventListener("click", handleClickOutside); 
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDateChange = (type, date) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: date
    }));
    
    // Auto-close logic: Close only if selecting checkout date
    if (type === 'checkOut') {
        setActiveDropdown(null);
    }
  };

  return (
    <div className="sticky-top bg-white shadow-sm py-3" style={{ zIndex: 1100 }} ref={dropdownRef}>
      <div className="container">
        <div className="row align-items-center">
          
          <div className="col-md-2 d-none d-md-block">
            <div className="badge fs-6 p-2 w-100" style={{ backgroundColor: '#d46f1b' }}>
              PATRA TRAVELS
            </div>
          </div>

          <div className="col-md-10 position-relative">
            <div className="d-flex align-items-center bg-light rounded-pill px-2 py-1 border shadow-sm">
              
              {/* LOCATION SECTION */}
              <div 
                className={`flex-grow-1 px-4 py-1 border-end clickable-section ${activeDropdown === 'location' ? 'active-section' : ''}`}
                onClick={() => setActiveDropdown('location')}
              >
                <span className="text-muted small text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Location</span>
                <input 
                  type="text" 
                  className="form-control border-0 bg-transparent p-0 fw-bold shadow-none"
                  style={{ color: '#d46f1b', fontSize: '14px' }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Where you want to stay?"
                  autoComplete="off"
                />
              </div>

              {/* CHECK-IN SECTION */}
              <div 
                className={`px-4 py-1 border-end clickable-section ${activeDropdown === 'dates' ? 'active-section' : ''}`} 
                onClick={() => setActiveDropdown('dates')}
              >
                <span className="text-muted small text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Check-In</span>
                <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                  {formatDate(searchParams?.checkIn)}
                </span>
              </div>

              {/* CHECK-OUT SECTION */}
              <div 
                className={`px-4 py-1 clickable-section ${activeDropdown === 'dates' ? 'active-section' : ''}`} 
                onClick={() => setActiveDropdown('dates')}
              >
                <span className="text-muted small text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Check-Out</span>
                <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                  {formatDate(searchParams?.checkOut)}
                </span>
              </div>

              {/* SEARCH BUTTON */}
              <div className="ms-2">
                <button className="btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center" 
                        style={{ backgroundColor: '#d46f1b', border: 'none', width: '45px', height: '45px' }}>
                  <i className="fas fa-search text-white"></i>
                </button>
              </div>
            </div>

            {/* --- DROPDOWNS --- */}
            <AnimatePresence>
              {/* Location Suggestions */}
              {activeDropdown === 'location' && suggestions.length > 0 && (
                <DropdownWrapper left="20px">
                  {suggestions.map((city, i) => (
                    <div key={i} className="p-3 suggestion-item d-flex align-items-center" 
                          onClick={() => { setSearchText(city.name); setActiveDropdown(null); }}>
                      <i className="fas fa-map-marker-alt me-3 text-muted"></i>
                      <div>
                        <div className="fw-bold">{city.name}</div>
                        <div className="text-muted small">India, {city.stateCode}</div>
                      </div>
                    </div>
                  ))}
                </DropdownWrapper>
              )}

              {/* Calendar Dropdown */}
              {activeDropdown === 'dates' && (
                <DropdownWrapper width="350px" right="20px" left="auto">
                  <div className="p-3">
                    <div className="row">
                        <div className="col-6">
                            <label className="fw-bold small mb-1 text-muted">CHECK-IN</label>
                            <input 
                              type="date" 
                              className="form-control form-control-sm" 
                              min={new Date().toISOString().split("T")[0]}
                              /* UPDATED: Use helper to format date for input */
                              value={getInputValue(searchParams?.checkIn)}
                              onChange={(e) => handleDateChange('checkIn', e.target.value)} 
                              onClick={(e) => e.stopPropagation()} 
                            />
                        </div>
                        <div className="col-6">
                            <label className="fw-bold small mb-1 text-muted">CHECK-OUT</label>
                            <input 
                              type="date" 
                              className="form-control form-control-sm" 
                              min={getInputValue(searchParams?.checkIn) || new Date().toISOString().split("T")[0]}
                              /* UPDATED: Use helper to format date for input */
                              value={getInputValue(searchParams?.checkOut)}
                              onChange={(e) => handleDateChange('checkOut', e.target.value)} 
                              onClick={(e) => e.stopPropagation()} 
                            />
                        </div>
                    </div>
                    <div className="text-end mt-3">
                         <button className="btn btn-xs text-primary fw-bold" onClick={() => setActiveDropdown(null)}>Done</button>
                    </div>
                  </div>
                </DropdownWrapper>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .clickable-section { cursor: pointer; transition: 0.2s; border-radius: 50px; }
        .clickable-section:hover { background: #e9ecef; }
        .active-section { background: #fff !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .suggestion-item { cursor: pointer; border-bottom: 1px solid #f8f9fa; transition: 0.2s; }
        .suggestion-item:hover { background: #fff4e6; color: #d46f1b; }
        input[type="date"] { -webkit-appearance: none; appearance: none; position: relative; }
      `}</style>
    </div>
  );
};

// Helper Dropdown UI
const DropdownWrapper = ({ children, width = '100%', left = '0', right = 'auto' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: 15 }}
    className="position-absolute bg-white shadow-lg rounded-4 mt-2 border p-1"
    style={{ 
      zIndex: 9999, 
      width, 
      left, 
      right,
      top: '100%',
      maxHeight: '400px',
      overflowY: 'auto' 
    }}
  >
    {children}
  </motion.div>
);

export default ModifySearch;