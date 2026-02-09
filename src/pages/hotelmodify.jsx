import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { City } from 'country-state-city';
import { 
  FaCalendarAlt, FaUserFriends, FaMapMarkerAlt, 
  FaMinus, FaPlus, FaSearch, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

// Helper to format date nicely
const formatDate = (date) => 
  date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : 'Select Date';

const ModifySearch = ({ searchParams, setSearchParams, searchText, setSearchText }) => {
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const dropdownRef = useRef(null);

  // --- 1. STATE FOR GUESTS ---
  const [guestConfig, setGuestConfig] = useState(searchParams?.guests || { rooms: 1, adults: 2, children: 0 });

  useEffect(() => {
    setSearchParams(prev => ({ ...prev, guests: guestConfig }));
  }, [guestConfig, setSearchParams]);

  // --- 2. LOCATION DATA ---
  const allIndianCities = useMemo(() => City.getCitiesOfCountry('IN'), []);
  const suggestions = useMemo(() => {
    if (searchText.length < 2) return [];
    return allIndianCities.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase())).slice(0, 5);
  }, [searchText, allIndianCities]);

  // --- 3. CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) return;
      setActiveDropdown(null);
    };
    document.addEventListener("click", handleClickOutside); 
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const handleDateSelect = (dateStr) => {
    const newDate = new Date(dateStr);
    const currentCheckIn = searchParams.checkIn ? new Date(searchParams.checkIn) : null;
    const currentCheckOut = searchParams.checkOut ? new Date(searchParams.checkOut) : null;

    if (!currentCheckIn || (currentCheckIn && currentCheckOut)) {
      // Start fresh selection
      setSearchParams(prev => ({ ...prev, checkIn: dateStr, checkOut: '' }));
    } else if (newDate > currentCheckIn) {
      // Complete selection
      setSearchParams(prev => ({ ...prev, checkOut: dateStr }));
    } else {
      // Reset if clicked before check-in
      setSearchParams(prev => ({ ...prev, checkIn: dateStr, checkOut: '' }));
    }
  };

  const updateGuest = (type, operation) => {
    setGuestConfig(prev => {
      const current = prev[type];
      let newValue = operation === 'inc' ? current + 1 : current - 1;
      if (type === 'rooms' && newValue < 1) newValue = 1;
      if (type === 'adults' && newValue < 1) newValue = 1;
      if (type === 'children' && newValue < 0) newValue = 0;
      return { ...prev, [type]: newValue };
    });
  };

  return (
    <div className="sticky-top bg-white shadow-sm py-3" style={{ zIndex: 1100 }} ref={dropdownRef}>
      <div className="container">
        <div className="row align-items-center">
          
          <div className="col-md-2 d-none d-md-block">
            <div className="badge fs-6 p-2 w-100 fw-bold text-white rounded-1" style={{ backgroundColor: '#d46f1b' }}>
              PATRA TRAVELS
            </div>
          </div>

          <div className="col-md-10 position-relative">
            <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center bg-light rounded-pill border shadow-sm p-1">
              
              {/* LOCATION */}
              <div 
                className={`flex-grow-1 px-3 py-2 border-end clickable-section ${activeDropdown === 'location' ? 'active-section' : ''}`}
                onClick={() => setActiveDropdown('location')}
              >
                <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="text-muted me-2 d-none d-md-block"/>
                    <div>
                        <span className="text-muted text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Location</span>
                        <input 
                          type="text" 
                          className="form-control border-0 bg-transparent p-0 fw-bold shadow-none text-truncate"
                          style={{ color: '#2d3436', fontSize: '14px' }}
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          placeholder="Where are you going?"
                        />
                    </div>
                </div>
              </div>

              {/* DATES */}
              <div 
                className={`px-3 py-2 border-end clickable-section ${activeDropdown === 'dates' ? 'active-section' : ''}`} 
                onClick={() => setActiveDropdown('dates')}
                style={{ minWidth: '220px' }}
              >
                 <div className="d-flex align-items-center">
                    <FaCalendarAlt className="text-muted me-2 d-none d-md-block"/>
                    <div>
                        <span className="text-muted text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Check-in — Check-out</span>
                        <span className="fw-bold text-dark text-nowrap" style={{ fontSize: '14px' }}>
                        {formatDate(searchParams?.checkIn)} — {formatDate(searchParams?.checkOut)}
                        </span>
                    </div>
                </div>
              </div>

              {/* GUESTS */}
              <div 
                className={`px-3 py-2 clickable-section ${activeDropdown === 'guests' ? 'active-section' : ''}`} 
                onClick={() => setActiveDropdown('guests')}
                style={{ minWidth: '200px' }}
              >
                <div className="d-flex align-items-center">
                    <FaUserFriends className="text-muted me-2 d-none d-md-block"/>
                    <div>
                        <span className="text-muted text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Travelers & Rooms</span>
                        <span className="fw-bold text-dark text-nowrap" style={{ fontSize: '14px' }}>
                          {guestConfig.adults} Adults
                          {guestConfig.children > 0 ? `, ${guestConfig.children} Child` : ''} 
                          {`, ${guestConfig.rooms} Room`}
                        </span>
                    </div>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="ms-md-2 mt-2 mt-md-0">
                <button className="btn btn-primary rounded-pill w-100 h-100 d-flex align-items-center justify-content-center px-4" 
                        style={{ backgroundColor: '#d46f1b', border: 'none', minHeight: '45px' }}>
                  <FaSearch className="text-white me-2"/> <span className="d-md-none fw-bold">SEARCH</span>
                </button>
              </div>
            </div>

            {/* --- DROPDOWNS --- */}
            <AnimatePresence>
              
              {/* Location */}
              {activeDropdown === 'location' && suggestions.length > 0 && (
                <DropdownWrapper left="0" width="300px">
                  {suggestions.map((city, i) => (
                    <div key={i} className="p-3 suggestion-item d-flex align-items-center" 
                          onClick={() => { setSearchText(city.name); setActiveDropdown(null); }}>
                      <div className="bg-light rounded-circle p-2 me-3"><FaMapMarkerAlt className="text-secondary"/></div>
                      <div>
                        <div className="fw-bold text-dark">{city.name}</div>
                        <div className="text-muted small">India, {city.stateCode}</div>
                      </div>
                    </div>
                  ))}
                </DropdownWrapper>
              )}

              {/* DUAL CALENDAR DROPDOWN */}
              {activeDropdown === 'dates' && (
                // Increased width to accommodate two calendars
                <DropdownWrapper left="auto" right="auto" width="700px" className="center-dropdown">
                    <CustomDualCalendar 
                        checkIn={searchParams?.checkIn} 
                        checkOut={searchParams?.checkOut}
                        onSelect={handleDateSelect}
                        onClose={() => setActiveDropdown(null)}
                    />
                </DropdownWrapper>
              )}

              {/* Guests */}
              {activeDropdown === 'guests' && (
                <DropdownWrapper left="auto" right="0" width="320px">
                  <div className="p-4">
                    <h6 className="fw-bold mb-4 border-bottom pb-2">Rooms & Guests</h6>
                    <GuestCounter label="Rooms" subLabel="Minimum 1" value={guestConfig.rooms} onDec={() => updateGuest('rooms', 'dec')} onInc={() => updateGuest('rooms', 'inc')} />
                    <GuestCounter label="Adults" subLabel="Aged 12+" value={guestConfig.adults} onDec={() => updateGuest('adults', 'dec')} onInc={() => updateGuest('adults', 'inc')} />
                    <GuestCounter label="Children" subLabel="Aged 0-12" value={guestConfig.children} onDec={() => updateGuest('children', 'dec')} onInc={() => updateGuest('children', 'inc')} />
                    <div className="mt-3 text-end">
                        <button className="btn btn-sm btn-dark px-4 rounded-pill" onClick={() => setActiveDropdown(null)}>Apply</button>
                    </div>
                  </div>
                </DropdownWrapper>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
        
      <style>{`
        .clickable-section { cursor: pointer; transition: all 0.2s ease; border-radius: 30px; }
        .clickable-section:hover { background: #e9ecef; }
        .active-section { background: #fff !important; box-shadow: 0 4px 15px rgba(0,0,0,0.08); transform: scale(1.02); }
        .suggestion-item { cursor: pointer; border-bottom: 1px solid #f1f1f1; transition: 0.2s; }
        .suggestion-item:last-child { border-bottom: none; }
        .suggestion-item:hover { background: #fdf0e6; }
        @media (min-width: 768px) { .center-dropdown { left: 50% !important; transform: translateX(-50%) !important; right: auto !important; } }
        @media (max-width: 767px) { .center-dropdown { width: 100% !important; left: 0 !important; right: 0 !important; } }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const DropdownWrapper = ({ children, width = '100%', left = '0', right = 'auto', className='' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
    className={`position-absolute bg-white shadow-lg rounded-4 mt-3 border overflow-hidden ${className}`}
    style={{ zIndex: 9999, width, left, right }}
  >
    {children}
  </motion.div>
);

const GuestCounter = ({ label, subLabel, value, onDec, onInc }) => (
    <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
            <div className="fw-bold text-dark">{label}</div>
            <div className="small text-muted">{subLabel}</div>
        </div>
        <div className="d-flex align-items-center border rounded-pill px-2 py-1">
            <button className="btn btn-sm text-secondary p-1" onClick={(e) => { e.stopPropagation(); onDec(); }} disabled={value <= 0}><FaMinus size={10}/></button>
            <span className="mx-3 fw-bold" style={{ minWidth: '20px', textAlign:'center' }}>{value}</span>
            <button className="btn btn-sm text-primary p-1" onClick={(e) => { e.stopPropagation(); onInc(); }}><FaPlus size={10}/></button>
        </div>
    </div>
);

// --- DUAL CALENDAR COMPONENT ---
const CustomDualCalendar = ({ checkIn, checkOut, onSelect, onClose }) => {
    // viewDate tracks the month shown on the LEFT calendar
    const [viewDate, setViewDate] = useState(new Date());

    const changeMonth = (offset) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setViewDate(newDate);
    };

    // Calculate Next Month date object for the Right Calendar
    const nextMonthDate = new Date(viewDate);
    nextMonthDate.setMonth(viewDate.getMonth() + 1);

    return (
        <div className="p-4">
            {/* Header / Controls */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-sm btn-light rounded-circle shadow-sm" onClick={() => changeMonth(-1)}>
                    <FaChevronLeft/>
                </button>
                
                {/* Mobile View: Shows only one title. Desktop: Spaces them out implicitly via grid */}
                <div className="d-none d-md-block w-100 px-4"></div>

                <button className="btn btn-sm btn-light rounded-circle shadow-sm" onClick={() => changeMonth(1)}>
                    <FaChevronRight/>
                </button>
            </div>

            {/* Calendars Container */}
            <div className="d-flex flex-column flex-md-row gap-4">
                {/* Left Calendar (Current View) */}
                <div className="flex-fill">
                    <MonthGrid 
                        date={viewDate} 
                        checkIn={checkIn} 
                        checkOut={checkOut} 
                        onSelect={onSelect} 
                    />
                </div>
                
                {/* Divider (Optional) */}
                <div className="border-end d-none d-md-block"></div>

                {/* Right Calendar (Next Month) */}
                <div className="flex-fill">
                    <MonthGrid 
                        date={nextMonthDate} 
                        checkIn={checkIn} 
                        checkOut={checkOut} 
                        onSelect={onSelect} 
                    />
                </div>
            </div>
            
            <div className="text-end mt-4 pt-3 border-top">
                <button className="btn px-5 rounded-pill" style={{backgroundColor:"#e95f10", color:"white"}} onClick={onClose}>Done</button>
            </div>
        </div>
    );
};

// Helper Component for a single month grid
const MonthGrid = ({ date, checkIn, checkOut, onSelect }) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Calendar Logic
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    const isSelected = (d) => {
        if (!d) return false;
        const dStr = d.toISOString().split('T')[0];
        return dStr === checkIn || dStr === checkOut;
    };

    const isInRange = (d) => {
        if (!d || !checkIn || !checkOut) return false;
        const time = d.getTime();
        const start = new Date(checkIn).getTime();
        const end = new Date(checkOut).getTime();
        return time > start && time < end;
    };

    return (
        <div>
            <h6 className="fw-bold text-center mb-3">
                {date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </h6>
            
            <div className="d-flex text-muted small fw-bold mb-2">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="flex-fill text-center">{d}</div>)}
            </div>

            <div className="d-flex flex-wrap">
                {days.map((dayObj, i) => {
                    if (!dayObj) return <div key={i} style={{ width: '14.28%', height: '40px' }}></div>;
                    
                    const dateStr = dayObj.toISOString().split('T')[0];
                    const selected = isSelected(dayObj);
                    const inRange = isInRange(dayObj);
                    // Disable past dates
                    const isPast = dayObj < new Date().setHours(0,0,0,0);

                    // Styles calculation
                    let bgClass = 'bg-transparent';
                    let textClass = 'text-dark';
                    let radius = '50%';

                    if (selected) {
                        bgClass = 'bg-dark shadow';
                        textClass = 'text-white';
                    } else if (inRange) {
                        bgClass = 'bg-light'; // Use a light gray for range
                        textClass = 'text-dark';
                        radius = '0'; // Square off range
                    } else if (isPast) {
                        textClass = 'text-muted opacity-25';
                    }

                    return (
                        <div key={i} style={{ width: '14.28%', height: '40px', padding: '2px' }}>
                            <button 
                                onClick={() => !isPast && onSelect(dateStr)}
                                disabled={isPast}
                                className={`w-100 h-100 border-0 d-flex align-items-center justify-content-center small fw-bold ${bgClass} ${textClass}`}
                                style={{ borderRadius: radius }}
                            >
                                {dayObj.getDate()}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ModifySearch;