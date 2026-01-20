import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, 
  FaUser, FaExchangeAlt, FaAngleDown, FaAngleUp, 
  FaPlus, FaTrash, FaCheck 
} from "react-icons/fa";

const ModifySearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {}; 

  // --- 1. UI STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [activeSearch, setActiveSearch] = useState(null); 
  
  // *** FIX: New state to hold text while typing ***
  const [searchQuery, setSearchQuery] = useState(""); 

  // --- 2. DATA STATE ---
  const [type, setType] = useState(state.type || 'One Way');
  
  const [from, setFrom] = useState(state.from || '');
  const [to, setTo] = useState(state.to || '');
  
  const [fromCity, setFromCity] = useState(state.fromLabel || state.from || 'Select Origin'); 
  const [toCity, setToCity] = useState(state.toLabel || state.to || 'Select Destination'); 

  const [date, setDate] = useState(state.date || new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(state.returnDate || '');

  const [segments, setSegments] = useState(state.segments || [
    { from: 'DEL', fromCity: 'Delhi (DEL)', to: 'BOM', toCity: 'Mumbai (BOM)', date: new Date().toISOString().split('T')[0] }
  ]);

  const [passengers, setPassengers] = useState(state.passengers || { adults: 1, children: 0 });
  const [cabinClass, setCabinClass] = useState(state.cabinClass || 'Economy');
  
  const [airportList, setAirportList] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);

  // Helper
  const safeSplit = (str) => {
    if (!str) return ""; 
    return str.split('(')[0];
  };

  // --- 3. LOAD DATA ---
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json")
      .then(res => res.json())
      .then(data => {
        const major = data.filter(a => a.iata_code && a.name);
        setAirportList(major);

        // Resolve Initial Labels
        if (state.from) {
            const found = major.find(a => a.iata_code === state.from);
            if (found) setFromCity(`${found.city} (${found.iata_code})`);
        }
        if (state.to) {
            const found = major.find(a => a.iata_code === state.to);
            if (found) setToCity(`${found.city} (${found.iata_code})`);
        }
        if (state.segments && state.segments.length > 0) {
            const updatedSegments = state.segments.map(seg => {
                const f = major.find(a => a.iata_code === seg.from);
                const t = major.find(a => a.iata_code === seg.to);
                return {
                    ...seg,
                    fromCity: f ? `${f.city} (${f.iata_code})` : seg.from,
                    toCity: t ? `${t.city} (${t.iata_code})` : seg.to
                };
            });
            setSegments(updatedSegments);
        }
      })
      .catch(err => console.error("Failed to load airports", err));
  }, [state]);

  // --- 4. HANDLERS ---

  // *** FIX: Handle Typing ***
  const handleTyping = (e) => {
    const val = e.target.value;
    setSearchQuery(val); // Update the input box visually
    
    // Filter the list
    if (!val) { setFilteredAirports([]); return; }
    const lowerQ = val.toLowerCase();
    const results = airportList.filter(a => 
        a.city.toLowerCase().includes(lowerQ) || 
        a.iata_code.toLowerCase().includes(lowerQ)
    ).slice(0, 5); 
    setFilteredAirports(results);
  };

  // *** FIX: Activate Field ***
  const activateField = (field) => {
      setActiveSearch(field);
      setSearchQuery(""); // Clear text to allow fresh typing
      setFilteredAirports([]);
  };

  const selectAirport = (airport, fieldType) => {
    const code = airport.iata_code;
    const label = `${airport.city} (${airport.iata_code})`;

    if (fieldType === 'from') { setFrom(code); setFromCity(label); }
    else if (fieldType === 'to') { setTo(code); setToCity(label); }
    else if (fieldType.startsWith('seg-from-')) {
        const idx = parseInt(fieldType.split('-')[2]);
        const newSegs = [...segments]; newSegs[idx].from = code; newSegs[idx].fromCity = label;
        setSegments(newSegs);
    }
    else if (fieldType.startsWith('seg-to-')) {
        const idx = parseInt(fieldType.split('-')[2]);
        const newSegs = [...segments]; newSegs[idx].to = code; newSegs[idx].toCity = label;
        setSegments(newSegs);
    }
    
    setActiveSearch(null); 
    setFilteredAirports([]);
    setSearchQuery("");
  };

  const handleSwap = () => {
    const tempCode = from; const tempLabel = fromCity;
    setFrom(to); setFromCity(toCity);
    setTo(tempCode); setToCity(tempLabel);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const payload = type === 'Multi-City' 
        ? { type, segments, passengers, cabinClass }
        : { type, from, fromLabel: fromCity, to, toLabel: toCity, date, returnDate, passengers, cabinClass };
    
    navigate("/results", { state: payload });
    setIsOpen(false);
  };

  const formatDateShort = (d) => {
      if(!d) return '';
      const dateObj = new Date(d);
      return isNaN(dateObj) ? d : dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const multiCityFrom = segments.length > 0 && segments[0].fromCity ? segments[0].fromCity : "Origin";
  const multiCityTo = segments.length > 0 && segments[segments.length-1].toCity ? segments[segments.length-1].toCity : "Dest";
  const multiCityDate = segments.length > 0 ? segments[0].date : "";

  return (
    <div className="bg-secondary pb-2 pt-3 sticky-top" style={{ zIndex: 1020 }}>
      <div className="container">
        
        {/* --- SUMMARY BAR --- */}
        <div 
          className="bg-white rounded-3 shadow-sm p-2 px-3 d-flex align-items-center justify-content-between"
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center flex-wrap gap-2 gap-md-4 overflow-hidden">
            <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark text-truncate" style={{maxWidth: '120px'}}>
                    {type === 'Multi-City' ? safeSplit(multiCityFrom) : safeSplit(fromCity)}
                </span>
                <FaExchangeAlt className="text-muted small" />
                <span className="fw-bold text-dark text-truncate" style={{maxWidth: '120px'}}>
                     {type === 'Multi-City' ? safeSplit(multiCityTo) : safeSplit(toCity)}
                </span>
            </div>
            <div className="d-none d-md-block border-start h-50 mx-2"></div>
            <div className="d-flex align-items-center gap-2 small text-secondary">
                <FaCalendarAlt /> 
                <span className="fw-bold text-dark">
                    {type === 'Multi-City' ? formatDateShort(multiCityDate) : formatDateShort(date)}
                </span>
                <span className="d-none d-sm-inline">• {passengers.adults + passengers.children} Traveller(s)</span>
            </div>
          </div>

          <button className="btn btn-sm btn-primary bg-opacity-10 text-white border-0 fw-bold rounded-pill px-3">
             Modify {isOpen ? <FaAngleUp className="ms-1"/> : <FaAngleDown className="ms-1"/>}
          </button>
        </div>

        {/* --- COLLAPSIBLE FORM --- */}
        <div className={`collapse ${isOpen ? 'show' : ''} mt-2`}>
            <div className="bg-white p-3 rounded-3 shadow-sm border position-relative">
                
                <div className="d-flex gap-3 mb-3 border-bottom pb-2">
                    {['One Way', 'Round Trip', 'Multi-City'].map(t => (
                        <div key={t} className="form-check">
                            <input 
                                className="form-check-input" type="radio" 
                                checked={type === t} onChange={() => setType(t)} 
                                id={`type-${t}`} 
                            />
                            <label className="form-check-label small fw-bold" htmlFor={`type-${t}`}>{t}</label>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSearch}>
                    
                    {/* STANDARD SEARCH */}
                    {type !== 'Multi-City' && (
                        <div className="row g-2 align-items-end">
                            {/* FROM */}
                            <div className="col-md-3 position-relative">
                                <label className="form-label small fw-bold text-muted mb-1">FROM</label>
                                <div className="input-group" onClick={() => activateField('from')}>
                                    <span className="input-group-text bg-light border-end-0"><FaPlaneDeparture className="text-secondary"/></span>
                                    <input 
                                        type="text" className="form-control border-start-0 ps-0 fw-bold" 
                                        // *** FIX: Show searchQuery when typing, otherwise show label ***
                                        value={activeSearch === 'from' ? searchQuery : fromCity} 
                                        placeholder={activeSearch === 'from' ? "Type City..." : ""}
                                        onChange={handleTyping}
                                        // Optional: keep focus logic simple
                                    />
                                </div>
                                {activeSearch === 'from' && filteredAirports.length > 0 && (
                                    <div className="position-absolute start-0 w-100 bg-white shadow rounded border mt-1" style={{zIndex: 1050, maxHeight:'200px', overflowY:'auto'}}>
                                        {filteredAirports.map((a, i) => (
                                            <div key={i} className="p-2 border-bottom small cursor-pointer hover-bg-light" onClick={() => selectAirport(a, 'from')}>
                                                <div className="fw-bold">{a.city}</div>
                                                <div className="text-muted small">{a.name} ({a.iata_code})</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SWAP */}
                            <div className="col-md-1 text-center d-none d-md-block">
                                 <button type="button" className="btn btn-light rounded-circle shadow-sm border" onClick={handleSwap}>
                                     <FaExchangeAlt className="text-primary"/>
                                 </button>
                            </div>

                            {/* TO */}
                            <div className="col-md-3 position-relative">
                                <label className="form-label small fw-bold text-muted mb-1">TO</label>
                                <div className="input-group" onClick={() => activateField('to')}>
                                    <span className="input-group-text bg-light border-end-0"><FaPlaneArrival className="text-secondary"/></span>
                                    <input 
                                        type="text" className="form-control border-start-0 ps-0 fw-bold" 
                                        value={activeSearch === 'to' ? searchQuery : toCity} 
                                        placeholder={activeSearch === 'to' ? "Type City..." : ""}
                                        onChange={handleTyping}
                                    />
                                </div>
                                {activeSearch === 'to' && filteredAirports.length > 0 && (
                                    <div className="position-absolute start-0 w-100 bg-white shadow rounded border mt-1" style={{zIndex: 1050, maxHeight:'200px', overflowY:'auto'}}>
                                        {filteredAirports.map((a, i) => (
                                            <div key={i} className="p-2 border-bottom small cursor-pointer hover-bg-light" onClick={() => selectAirport(a, 'to')}>
                                                <div className="fw-bold">{a.city}</div>
                                                <div className="text-muted small">{a.name} ({a.iata_code})</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-2">
                                 <label className="form-label small fw-bold text-muted mb-1">DEPARTURE</label>
                                 <input type="date" className="form-control fw-bold" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>

                            {type === 'Round Trip' && (
                                <div className="col-md-2">
                                    <label className="form-label small fw-bold text-muted mb-1">RETURN</label>
                                    <input type="date" className="form-control fw-bold" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                                </div>
                            )}

                            <div className={type === 'Round Trip' ? 'col-md-12 mt-3' : 'col-md-3'}>
                                 <button type="submit" className="btn btn-info w-100 fw-bold text-white py-2">UPDATE SEARCH</button>
                            </div>
                        </div>
                    )}

                    {/* MULTI-CITY SEARCH */}
                    {type === 'Multi-City' && (
                        <div className="d-flex flex-column gap-2">
                             {segments.map((seg, i) => (
                                <div className="row g-2 align-items-end border-bottom pb-3" key={i}>
                                    <div className="col-1 fw-bold text-muted align-self-center">#{i+1}</div>
                                    
                                    <div className="col-md-4 position-relative">
                                        <label className="form-label small fw-bold text-muted mb-0">From</label>
                                        <input 
                                            type="text" className="form-control form-control-sm fw-bold"
                                            value={activeSearch === `seg-from-${i}` ? searchQuery : seg.fromCity}
                                            onClick={() => activateField(`seg-from-${i}`)}
                                            onChange={handleTyping}
                                            placeholder="Origin"
                                        />
                                        {activeSearch === `seg-from-${i}` && filteredAirports.length > 0 && (
                                            <div className="position-absolute start-0 w-100 bg-white shadow rounded border mt-1" style={{zIndex: 1050, maxHeight:'150px', overflowY:'auto'}}>
                                                {filteredAirports.map((a, idx) => (
                                                    <div key={idx} className="p-2 border-bottom small cursor-pointer" onClick={() => selectAirport(a, `seg-from-${i}`)}>
                                                        {a.city} ({a.iata_code})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-4 position-relative">
                                        <label className="form-label small fw-bold text-muted mb-0">To</label>
                                        <input 
                                            type="text" className="form-control form-control-sm fw-bold"
                                            value={activeSearch === `seg-to-${i}` ? searchQuery : seg.toCity}
                                            onClick={() => activateField(`seg-to-${i}`)}
                                            onChange={handleTyping}
                                            placeholder="Destination"
                                        />
                                        {activeSearch === `seg-to-${i}` && filteredAirports.length > 0 && (
                                            <div className="position-absolute start-0 w-100 bg-white shadow rounded border mt-1" style={{zIndex: 1050, maxHeight:'150px', overflowY:'auto'}}>
                                                {filteredAirports.map((a, idx) => (
                                                    <div key={idx} className="p-2 border-bottom small cursor-pointer" onClick={() => selectAirport(a, `seg-to-${i}`)}>
                                                        {a.city} ({a.iata_code})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label small fw-bold text-muted mb-0">Date</label>
                                        <input 
                                            type="date" className="form-control form-control-sm" 
                                            value={seg.date} 
                                            onChange={(e) => {
                                                const newSegs = [...segments]; newSegs[i].date = e.target.value; setSegments(newSegs);
                                            }}
                                        />
                                    </div>

                                    <div className="col-md-1">
                                        {segments.length > 1 && (
                                            <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={() => setSegments(segments.filter((_, idx) => idx !== i))}>
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>
                             ))}
                             
                             <div className="d-flex justify-content-between mt-2">
                                <button type="button" className="btn btn-link text-decoration-none fw-bold" onClick={() => setSegments([...segments, {from:'', fromCity:'Select', to:'', toCity:'Select', date:''}])}>
                                    <FaPlus className="me-1"/> Add Flight
                                </button>
                                <button type="submit" className="btn btn-info fw-bold text-white px-4">Update Search</button>
                             </div>
                        </div>
                    )}

                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ModifySearch;