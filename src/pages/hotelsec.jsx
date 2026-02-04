import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { City } from 'country-state-city';
import { motion, AnimatePresence } from 'framer-motion';

const getDayLabel = (date) => date ? date.toLocaleDateString('en-US', { weekday: 'short' }) : '--';
const formatDate = (date) => date ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Select Date';

const Hotels = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  
  // Removed Price State

  const [activeDropdown, setActiveDropdown] = useState(null);
  const wrapperRef = useRef(null);

  // --- HELPERS ---
  const handleSearch = () => {
    // Removed priceRange from navigation state
    navigate('/Hotel_details', { 
      state: { city: query, checkIn: checkInDate, checkOut: checkOutDate, guests } 
    });
  };

  const updateGuest = (type, delta) => {
    setGuests(prev => {
      const newVal = prev[type] + delta;
      if (type === 'rooms' && newVal < 1) return prev;
      if (type === 'adults' && newVal < 1) return prev;
      if (type === 'children' && newVal < 0) return prev;
      return { ...prev, [type]: newVal };
    });
  };

  // --- EFFECTS ---
  useEffect(() => {
    const btLink = document.createElement("link");
    btLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    btLink.rel = "stylesheet";
    document.head.appendChild(btLink);
    const iconLink = document.createElement("link");
    iconLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
    iconLink.rel = "stylesheet";
    document.head.appendChild(iconLink);

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!query.trim() || query.length < 3) { setResults([]); return; }
      setIsLoading(true);
      try {
        const allCities = City.getCitiesOfCountry('IN'); 
        const filtered = allCities.filter(c => c.name.toLowerCase().startsWith(query.toLowerCase())).slice(0, 8); 
        setResults(filtered.map(item => ({ name: item.name, subLabel: `${item.stateCode}, India` })));
      } catch (e) { console.error(e); } 
      finally { setIsLoading(false); }
    }, 300);
    return () => clearTimeout(timerId);
  }, [query]);

  return (
    <div className="font-sans" ref={wrapperRef}>
      <section className="position-relative d-flex align-items-center justify-content-center px-3" style={{ minHeight: '85vh', paddingBottom: '10vh' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" 
             style={{
               backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop')",
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}></div>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50"></div>

        <div className="container position-relative z-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-5"
            >
              <h1 className="text-white fw-bold display-4 mb-2">Escape to Paradise</h1>
              <p className="text-white-50 fs-5">Find amazing deals on hotels, resorts, and private villas.</p>
            </motion.div>

            {/* SEARCH BAR */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-4 shadow-lg p-2 mx-auto" 
              style={{maxWidth: '1200px'}}
            >
              <div className="row g-0 align-items-center">
                
                {/* LOCATION - Expanded Col Size */}
                <div className="col-lg-4 col-md-12 position-relative border-end-lg mb-2 mb-lg-0">
                   <div className="p-3 cursor-pointer hover-bg-light rounded-3" onClick={() => setActiveDropdown('location')}>
                      <label className="text-uppercase fw-bold text-muted small mb-1">Location</label>
                      <input type="text" className="form-control border-0 p-0 fs-6 fw-bold shadow-none bg-transparent text-truncate" 
                        placeholder="Where are you staying?" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
                      <div className="small text-muted text-truncate">{results.length > 0 ? 'Select a city' : 'Search destinations'}</div>
                   </div>
                   <AnimatePresence>
                    {activeDropdown === 'location' && (
                      <SmartDropdown width="100%">
                          {results.length === 0 && <div className="p-3 text-muted text-center small">Type at least 3 letters...</div>}
                          <div style={{maxHeight: '300px', overflowY:'auto'}}>
                             {results.map((item, idx) => (
                             <motion.div 
                                whileHover={{ x: 5, backgroundColor: '#f8f9fa' }}
                                key={idx} 
                                className="p-3 border-bottom cursor-pointer d-flex align-items-center" 
                                onClick={(e) => { e.stopPropagation(); setQuery(item.name); setActiveDropdown(null); }}
                              >
                                 <i className="fas fa-map-marker-alt text-muted me-3"></i>
                                 <div><div className="fw-bold text-dark">{item.name}</div><small className="text-muted">{item.subLabel}</small></div>
                             </motion.div>))}
                          </div>
                      </SmartDropdown>
                    )}
                   </AnimatePresence>
                </div>

                {/* DATES - Expanded Col Size */}
                <div className="col-lg-5 col-md-12 position-relative border-end-lg mb-2 mb-lg-0 d-flex">
                   <div className="flex-fill p-3 cursor-pointer hover-bg-light rounded-3" onClick={() => setActiveDropdown('dateRange')}>
                      <label className="text-uppercase fw-bold text-muted small mb-1">Check-In</label>
                      <div className={`fs-6 fw-bold ${!checkInDate ? 'text-muted' : ''}`}>{formatDate(checkInDate)}</div>
                      <div className="small text-muted">{getDayLabel(checkInDate)}</div>
                   </div>
                   <div className="border-end my-3"></div>
                   <div className="flex-fill p-3 cursor-pointer hover-bg-light rounded-3" onClick={() => setActiveDropdown('dateRange')}>
                      <label className="text-uppercase fw-bold text-muted small mb-1">Check-Out</label>
                      <div className={`fs-6 fw-bold ${!checkOutDate ? 'text-muted' : ''}`}>{formatDate(checkOutDate)}</div>
                      <div className="small text-muted">{getDayLabel(checkOutDate)}</div>
                   </div>
                   <AnimatePresence>
                    {activeDropdown === 'dateRange' && (
                        <SmartDropdown width="750px" padding="0">
                            <DualMonthCalendar checkIn={checkInDate} checkOut={checkOutDate} 
                              onChange={(start, end) => { setCheckInDate(start); setCheckOutDate(end); if (start && end) setActiveDropdown(null); }} />
                        </SmartDropdown>
                    )}
                   </AnimatePresence>
                </div>

                {/* GUESTS & SEARCH BUTTON */}
                <div className="col-lg-3 col-md-12 position-relative mb-2 mb-lg-0 d-flex align-items-center">
                   <div className="flex-grow-1 p-3 cursor-pointer hover-bg-light rounded-3" onClick={() => setActiveDropdown('guests')}>
                      <label className="text-uppercase fw-bold text-muted small mb-1">Guests</label>
                      <div className="fs-6 fw-bold">{guests.adults + guests.children} Guests</div>
                      <div className="small text-muted">{guests.rooms} Room</div>
                   </div>
                   
                   <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-warning rounded-pill shadow-lg py-3 px-4 fw-bold text-uppercase ms-2" 
                    onClick={handleSearch}
                   >
                    <i className="fas fa-search"></i>
                   </motion.button>

                   <AnimatePresence>
                    {activeDropdown === 'guests' && (
                      <SmartDropdown width="280px">
                          {['rooms', 'adults', 'children'].map((type) => (
                              <div key={type} className="d-flex justify-content-between align-items-center mb-3">
                                  <div className="text-capitalize fw-bold">{type}</div>
                                  <div className="d-flex align-items-center gap-2">
                                      <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={() => updateGuest(type, -1)} disabled={guests[type] <= (type==='children'?0:1)}>-</button>
                                      <span className="fw-bold" style={{width:'20px', textAlign:'center'}}>{guests[type]}</span>
                                      <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={() => updateGuest(type, 1)}>+</button>
                                  </div>
                              </div>
                          ))}
                          <button className="btn btn-primary w-100 rounded-pill mt-2" onClick={() => setActiveDropdown(null)}>Done</button>
                      </SmartDropdown>
                    )}
                   </AnimatePresence>
                </div>

              </div>
            </motion.div>
        </div>
      </section>

      <style>{`
        .hover-bg-light:hover { background-color: #f8f9fa; cursor: pointer; transition: 0.2s; }
        .border-end-lg { border-right: 1px solid #e9ecef; }
        @media (max-width: 991px) { .border-end-lg { border-right: none; border-bottom: 1px solid #e9ecef; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
        .cal-btn { width: 40px; height: 40px; font-size: 14px; margin: 2px auto; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: none; background: transparent; position: relative; z-index: 1; }
        .cal-btn:hover:not(:disabled) { background-color: #e9ecef; }
        .range-start { background-color: #0d6efd !important; color: white !important; border-radius: 50% 0 0 50% !important; }
        .range-end { background-color: #0d6efd !important; color: white !important; border-radius: 0 50% 50% 0 !important; }
        .in-range { background-color: #e7f1ff !important; color: #000 !important; border-radius: 0 !important; }
        .range-both { border-radius: 50% !important; }
        .holiday-badge { font-size: 20px; line-height: 0; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); color: #ffc107; }
        .holiday-bg { background-color: #fff9db; font-weight: bold; color: #d63384; }
      `}</style>
    </div>
  );
};

// --- SMART DROPDOWN WITH MOTION ---
const SmartDropdown = ({ children, width = '300px', padding = '1rem' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const ref = useRef(null);
  
  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) setIsFlipped(true);
    }
  }, []);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: isFlipped ? 10 : -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="position-absolute bg-white rounded-4 shadow-lg start-50 translate-middle-x"
      style={{ 
        zIndex: 1050, 
        width: width, 
        padding: padding, 
        [isFlipped ? 'bottom' : 'top']: '110%', 
        marginTop: isFlipped ? 0 : '10px', 
        marginBottom: isFlipped ? '10px' : 0,
        transformOrigin: isFlipped ? 'bottom' : 'top'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  );
};

// --- DUAL CALENDAR ---
const DualMonthCalendar = ({ checkIn, checkOut, onChange }) => {
    const [viewDate, setViewDate] = useState(new Date()); 
    const [visibleHolidays, setVisibleHolidays] = useState([]);

    const HOLIDAYS = {
        '2026-1-1': 'New Year', '2026-1-14': 'Makar Sankranti', '2026-1-26': 'Republic Day',
        '2026-2-15': 'Maha Shivaratri', '2026-3-4': 'Holi', '2026-3-20': 'Eid-ul-Fitr',
        '2026-3-27': 'Ram Navami', '2026-4-3': 'Good Friday', '2026-4-14': 'Ambedkar Jayanti',
        '2026-8-15': 'Independence Day', '2026-9-14': 'Ganesh Chaturthi', '2026-10-2': 'Gandhi Jayanti',
        '2026-10-20': 'Dussehra', '2026-11-8': 'Diwali', '2026-12-25': 'Christmas'
    };

    useEffect(() => {
        const list = [];
        const checkMonth = (date) => {
            const y = date.getFullYear();
            const m = date.getMonth();
            for(let i=1; i<=31; i++) {
                const key = `${y}-${m+1}-${i}`;
                if(HOLIDAYS[key]) list.push({ date: new Date(y, m, i), name: HOLIDAYS[key] });
            }
        };
        checkMonth(viewDate);
        checkMonth(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
        setVisibleHolidays(list);
    }, [viewDate]);

    const handlePrev = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNext = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const handleDayClick = (date) => {
        if (checkIn && !checkOut && date > checkIn) onChange(checkIn, date);
        else onChange(date, null);
    };

    const renderMonth = (baseDate) => {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`}></div>);

        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const dateStr = `${year}-${month+1}-${d}`; 
            const isCheckIn = checkIn && dateObj.toDateString() === checkIn.toDateString();
            const isCheckOut = checkOut && dateObj.toDateString() === checkOut.toDateString();
            const isInRange = checkIn && checkOut && dateObj > checkIn && dateObj < checkOut;
            const isHoliday = HOLIDAYS[dateStr];

            let classes = "cal-btn ";
            if (isCheckIn) classes += "range-start ";
            else if (isCheckOut) classes += "range-end ";
            else if (isInRange) classes += "in-range ";
            else if (isHoliday) classes += "holiday-bg ";
            if (isCheckIn && !checkOut) classes = classes.replace("range-start", "range-both ");

            days.push(
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    key={d} 
                    className={classes} 
                    onClick={() => handleDayClick(dateObj)}
                >
                    {d}
                    {isHoliday && !isCheckIn && !isCheckOut && !isInRange && <span className="holiday-badge text-warning">•</span>}
                </motion.button>
            );
        }
        return days;
    };

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div className="d-flex gap-4">
                    <div className={checkIn ? "text-primary fw-bold" : "text-muted"}>
                        {checkIn ? formatDate(checkIn) : 'Select Date'}
                    </div>
                    <span>-</span>
                    <div className={checkOut ? "text-primary fw-bold" : "text-muted"}>
                        {checkOut ? formatDate(checkOut) : 'Select Date'}
                    </div>
                </div>
            </div>

            <div className="d-flex gap-4">
                <div style={{width: '320px'}}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <button className="btn btn-sm btn-light rounded-circle" onClick={handlePrev}><i className="fas fa-chevron-left"></i></button>
                        <span className="fw-bold">{viewDate.toLocaleDateString('en-US', {month:'long', year:'numeric'})}</span>
                        <div></div>
                      </div>
                      <div className="d-grid text-center text-muted small fw-bold mb-2" style={{gridTemplateColumns: 'repeat(7, 1fr)'}}>{['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d}>{d}</div>)}</div>
                      <div className="d-grid" style={{gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '5px'}}>{renderMonth(viewDate)}</div>
                </div>
                <div style={{width: '320px'}} className="d-none d-md-block">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div></div>
                        <span className="fw-bold">{new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1).toLocaleDateString('en-US', {month:'long', year:'numeric'})}</span>
                        <button className="btn btn-sm btn-light rounded-circle" onClick={handleNext}><i className="fas fa-chevron-right"></i></button>
                      </div>
                      <div className="d-grid text-center text-muted small fw-bold mb-2" style={{gridTemplateColumns: 'repeat(7, 1fr)'}}>{['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d}>{d}</div>)}</div>
                      <div className="d-grid" style={{gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '5px'}}>{renderMonth(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}</div>
                </div>
            </div>

            <div className="mt-3 pt-2 border-top">
                 <AnimatePresence>
                    {visibleHolidays.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="d-flex flex-wrap gap-3"
                        >
                            {visibleHolidays.map((h, i) => (
                                <div key={i} className="small text-muted d-flex align-items-center">
                                    <span className="text-warning me-1 fs-5" style={{lineHeight: 0}}>•</span>
                                    <span className="fw-bold text-dark me-1">{h.date.getDate()} {h.date.toLocaleDateString('en-US',{month:'short'})}</span> 
                                    {h.name}
                                </div>
                            ))}
                        </motion.div>
                    )}
                 </AnimatePresence>
            </div>
        </div>
    );
};

export default Hotels;