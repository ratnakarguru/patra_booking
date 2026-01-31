import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Hotels = () => {
  const navigate = useNavigate(); // 2. Initialize Hook

  // ... [Keep your existing states: query, results, dates, guests, etc.] ...
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [datePickerMode, setDatePickerMode] = useState('checkin'); 
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const wrapperRef = useRef(null);
const handleSearch = () => {
    // Navigate to '/hotels' and pass the current state
    navigate('/Hotel_details', { 
      state: { 
        city: query, // The city text entered
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guests
      } 
    });
  };
  // Load Bootstrap & Icons
  useEffect(() => {
    const btLink = document.createElement("link");
    btLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    btLink.rel = "stylesheet";
    document.head.appendChild(btLink);

    const iconLink = document.createElement("link");
    iconLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
    iconLink.rel = "stylesheet";
    document.head.appendChild(iconLink);
  }, []);

  // Handle Click Outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // --- SEARCH LOGIC (Nominatim) ---
  useEffect(() => {
    const timerId = setTimeout(async () => {
      if (!query.trim() || query.length < 3) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=8`
        );
        if (response.ok) {
          const data = await response.json();
          const formattedResults = data.map(item => ({
            name: item.name || item.address.city || item.address.town || item.address.village,
            subLabel: [item.address.state, item.address.country].filter(Boolean).join(', '),
            type: item.type 
          }));
          // Dedup
          const uniqueResults = formattedResults.filter((v,i,a)=>a.findIndex(t=>(t.name===v.name))===i);
          setResults(uniqueResults);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [query]);

  // --- CALENDAR HELPERS ---
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const getDayLabel = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  const handleDateClick = (day) => {
    // Clone to avoid mutation issues
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Logic for consecutive selection
    if (datePickerMode === 'checkin') {
      setCheckInDate(selected);
      // Automatically set checkout to next day if it's invalid
      if (selected >= checkOutDate) {
        const nextDay = new Date(selected);
        nextDay.setDate(selected.getDate() + 1);
        setCheckOutDate(nextDay);
      }
      setDatePickerMode('checkout'); // Switch to checkout selection automatically
    } else {
      // We are in checkout mode
      if (selected <= checkInDate) {
        // If user clicks a date before checkin, assume they want to change checkin instead
        setCheckInDate(selected);
        const nextDay = new Date(selected);
        nextDay.setDate(selected.getDate() + 1);
        setCheckOutDate(nextDay);
        setDatePickerMode('checkout');
      } else {
        setCheckOutDate(selected);
        setActiveDropdown(null); // Close calendar
      }
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
    
    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(year, month, d);
      const isCheckIn = thisDate.toDateString() === checkInDate.toDateString();
      const isCheckOut = thisDate.toDateString() === checkOutDate.toDateString();
      const isInRange = thisDate > checkInDate && thisDate < checkOutDate;
      const isPast = thisDate < new Date().setHours(0,0,0,0);

      let bgClass = "bg-white text-dark";
      if (isCheckIn) bgClass = "bg-primary text-white rounded-start";
      if (isCheckOut) bgClass = "bg-primary text-white rounded-end";
      if (isInRange) bgClass = "bg-primary bg-opacity-10";
      if (isPast) bgClass = "text-muted opacity-25";

      days.push(
        <button 
          key={d} 
          disabled={isPast}
          onClick={() => handleDateClick(d)}
          className={`btn border-0 p-2 fw-bold w-100 ${bgClass}`}
          style={{borderRadius: (isCheckIn || isCheckOut) ? '' : '0'}}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  // --- GUEST HELPERS ---
  const updateGuest = (type, delta) => {
    setGuests(prev => {
      const newVal = prev[type] + delta;
      // Constraints
      if (type === 'rooms' && newVal < 1) return prev;
      if (type === 'adults' && newVal < 1) return prev;
      if (type === 'children' && newVal < 0) return prev;
      return { ...prev, [type]: newVal };
    });
  };

  return (
    <div className="bg-light min-vh-100 font-sans" ref={wrapperRef}>
      {/* Hero Section */}
      <section className="py-5" style={{ background: 'linear-gradient(0deg, #221005, #7c3e15)' }}>
        <div className="container mt-5">
          <div className="bg-white rounded-3 p-4 shadow-lg position-relative" style={{ minHeight: '150px' }}>
            
            {/* --- MAIN SEARCH BAR ROW --- */}
            <div className="row g-0 border rounded-3 position-relative" style={{borderColor: '#e7e7e7'}}>
              
              {/* 1. LOCATION INPUT */}
              <div className="col-lg-4 col-md-12 p-3 border-end position-relative">
                <label className="text-uppercase text-muted fw-bold d-block" style={{fontSize: '11px', marginBottom: '4px'}}>
                   City, Property or Location
                </label>
                <input 
                  type="text" 
                  className="form-control border-0 fs-4 fw-bolder p-0 shadow-none text-truncate"
                  placeholder="Where do you want to stay?"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveDropdown('location'); }}
                  onClick={() => setActiveDropdown('location')}
                />
                <div className="text-muted small text-truncate">
                   {results.length > 0 ? 'India' : 'Start typing...'}
                </div>

                {/* Location Dropdown */}
                {activeDropdown === 'location' && query.length > 0 && (
                  <div className="list-group position-absolute start-0 top-100 w-100 shadow-lg mt-2 z-3 bg-white border-0 rounded-3 overflow-hidden" 
                       style={{maxHeight: '350px', overflowY: 'auto'}}>
                    {isLoading && <div className="p-3 text-center"><i className="fas fa-spinner fa-spin"></i></div>}
                    {!isLoading && results.map((item, idx) => (
                      <button key={idx} className="list-group-item list-group-item-action py-3 border-0"
                        onClick={() => { setQuery(item.name); setActiveDropdown(null); }}>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-map-marker-alt text-secondary fs-5 me-3"></i>
                          <div>
                            <div className="fw-bold text-dark">{item.name}</div>
                            <div className="small text-muted">{item.subLabel}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. DATE PICKER (Merged Check-in/Check-out for visual flow) */}
              <div className="col-lg-4 col-md-12 d-flex">
                {/* Check In */}
                <div className="flex-fill p-3 border-end position-relative cursor-pointer hover-bg-light"
                     onClick={() => { setActiveDropdown('calendar'); setDatePickerMode('checkin'); }}>
                  <label className="text-uppercase text-muted fw-bold d-flex align-items-center" style={{fontSize: '11px', marginBottom: '4px'}}>
                    Check-In <i className="fas fa-chevron-down ms-1 text-primary"></i>
                  </label>
                  <div className="fs-4 fw-bolder">
                    {checkInDate.getDate()} <span className='fs-6 fw-normal'>{checkInDate.toLocaleDateString('en-US', {month:'short', year: '2-digit'})}</span>
                  </div>
                  <div className="small text-muted">{getDayLabel(checkInDate)}</div>
                </div>

                {/* Check Out */}
                <div className="flex-fill p-3 border-end position-relative cursor-pointer hover-bg-light"
                     onClick={() => { setActiveDropdown('calendar'); setDatePickerMode('checkout'); }}>
                  <label className="text-uppercase text-muted fw-bold d-flex align-items-center" style={{fontSize: '11px', marginBottom: '4px'}}>
                    Check-Out <i className="fas fa-chevron-down ms-1 text-primary"></i>
                  </label>
                  <div className="fs-4 fw-bolder">
                    {checkOutDate.getDate()} <span className='fs-6 fw-normal'>{checkOutDate.toLocaleDateString('en-US', {month:'short', year: '2-digit'})}</span>
                  </div>
                  <div className="small text-muted">{getDayLabel(checkOutDate)}</div>
                </div>

                {/* --- CALENDAR DROPDOWN --- */}
                {activeDropdown === 'calendar' && (
                  <div className="position-absolute start-0 top-100 mt-2 bg-white shadow-lg rounded-3 z-3 p-3" style={{width: '350px', left: '20%'}}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <button className="btn btn-sm btn-light rounded-circle" 
                              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span className="fw-bold">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button className="btn btn-sm btn-light rounded-circle" 
                              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                    
                    <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', fontSize: '12px' }}>
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center text-muted fw-bold p-2">{d}</div>)}
                      {renderCalendar()}
                    </div>
                    <div className="mt-3 text-center small text-primary fw-bold">
                       {datePickerMode === 'checkin' ? 'Select Check-In Date' : 'Select Check-Out Date'}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. ROOMS & GUESTS */}
              <div className="col-lg-4 col-md-12 p-3 position-relative cursor-pointer hover-bg-light"
                   onClick={() => setActiveDropdown('guests')}>
                <label className="text-uppercase text-muted fw-bold d-flex align-items-center" style={{fontSize: '11px', marginBottom: '4px'}}>
                  Rooms & Guests <i className="fas fa-chevron-down ms-1 text-primary"></i>
                </label>
                <div className="fs-4 fw-bolder">
                  {guests.rooms} <span className="fs-6 fw-normal">Room,</span> {guests.adults} <span className="fs-6 fw-normal">Adults</span>
                </div>
                <div className="small text-muted">{guests.children > 0 ? `${guests.children} Children` : 'No Children'}</div>

                {/* Rooms/Guest Dropdown */}
                {activeDropdown === 'guests' && (
                   <div className="position-absolute end-0 top-100 mt-2 bg-white shadow-lg rounded-3 z-3 p-4" 
                        style={{width: '300px', cursor: 'default'}} onClick={(e) => e.stopPropagation()}>
                      
                      {/* Item Row: Rooms */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="fw-bold">Rooms</div>
                          <div className="small text-muted">Minimum 1</div>
                        </div>
                        <div className="border rounded-pill px-2 py-1">
                          <button className="btn btn-sm btn-white text-primary" onClick={() => updateGuest('rooms', -1)} disabled={guests.rooms <= 1}>-</button>
                          <span className="mx-2 fw-bold">{guests.rooms}</span>
                          <button className="btn btn-sm btn-white text-primary" onClick={() => updateGuest('rooms', 1)}>+</button>
                        </div>
                      </div>

                      {/* Item Row: Adults */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="fw-bold">Adults</div>
                          <div className="small text-muted">+12 yrs</div>
                        </div>
                        <div className="border rounded-pill px-2 py-1">
                          <button className="btn btn-sm btn-white text-primary" onClick={() => updateGuest('adults', -1)} disabled={guests.adults <= 1}>-</button>
                          <span className="mx-2 fw-bold">{guests.adults}</span>
                          <button className="btn btn-sm btn-white text-primary" onClick={() => updateGuest('adults', 1)}>+</button>
                        </div>
                      </div>

                      {/* Item Row: Children */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                         <div>
                          <div className="fw-bold">Children</div>
                          <div className="small text-muted">0-12 yrs</div>
                        </div>
                        <div className="border rounded-pill px-2 py-1">
                          <button className="btn btn-sm btn-white text-primary" onClick={() => updateGuest('children', -1)} disabled={guests.children <= 0}>-</button>
                          <span className="mx-2 fw-bold">{guests.children}</span>
                          <button className="btn btn-sm btn-white text-primary" onClick={() => updateGuest('children', 1)}>+</button>
                        </div>
                      </div>

                      <button className="btn btn-outline-primary w-100 rounded-pill fw-bold" 
                              onClick={() => setActiveDropdown(null)}>APPLY</button>
                   </div>
                )}
              </div>
            </div>

            {/* SEARCH BUTTON */}
           <div className="position-absolute start-50 translate-middle-x" style={{ bottom: '-25px' }}>
            <button 
            className="btn btn-warning rounded-pill px-5 py-2 fs-3 fw-bold shadow-lg text-uppercase"
            style={{ background: 'linear-gradient(90deg, #fb8853, #e45f12)' }}
            onClick={handleSearch} // 4. Attach Handler
            >
            Search
            </button>
        </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Hotels;