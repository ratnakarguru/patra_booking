import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlane, FaChevronLeft, FaChevronRight, FaExchangeAlt,
  FaAngleDown, FaAngleUp, FaCheckCircle, FaRegCircle, 
  FaSortAmountDown, FaSortAmountUp, FaShoppingBag , FaSuitcase
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

// --- IMPORTS ---
import FlightFilters from "./flightfilters"; 
import ModifySearch from "./modify"; 
import FlightLoader from "../includes/loader"; 
// --- 1. REUSABLE FLIGHT DETAILS PANEL ---
const FlightDetailsPanel = ({ flight, getAirlineLogo, airportMap }) => {
  const [activeTab, setActiveTab] = useState('flight');
  const getCity = (code) => airportMap[code]?.city || code;
  const segments = flight.flights ? flight.flights : [flight];

  const renderContent = () => {
    switch (activeTab) {
        case 'flight':
            return (
                <div className="py-2">
                    {segments.map((f, i) => (
                        <div key={i} className="mb-3 position-relative">
                            {i < segments.length - 1 && (
                                <div className="position-absolute border-start border-2 border-secondary" 
                                     style={{left: '10px', top: '30px', bottom: '-15px', zIndex: 0, opacity: 0.2}}></div>
                            )}
                            <div className="d-flex align-items-center gap-2 mb-2 bg-light p-1 rounded" style={{zIndex: 1, position: 'relative'}}>
                                <span className="badge bg-secondary">{i + 1}</span>
                                <img src={getAirlineLogo(f.airline)} alt="logo" style={{height:'16px'}}/>
                                <span className="small fw-bold">{f.airline} {f.flightCode}</span>
                            </div>
                            <div className="row small g-0 ps-3">
                                <div className="col-4">
                                    <div className="fw-bold">{f.departureTime}</div>
                                    <div className="text-muted" style={{fontSize:'0.7rem'}}>{getCity(f.origin)}</div>
                                </div>
                                <div className="col-4 text-center align-self-center">
                                    <div className="text-muted" style={{fontSize:'0.65rem'}}>{f.duration}</div>
                                    <div className="border-top my-1"></div>
                                </div>
                                <div className="col-4 text-end">
                                    <div className="fw-bold">{f.arrivalTime}</div>
                                    <div className="text-muted" style={{fontSize:'0.7rem'}}>{getCity(f.destination)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        case 'fare':
            const price = flight.totalPrice || flight.price;
            return (
                <div className="py-2 small">
                    <div className="d-flex justify-content-between mb-1"><span>Base Fare</span><span>₹{(price * 0.8).toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between mb-1"><span>Tax & Surcharges</span><span>₹{(price * 0.2).toLocaleString()}</span></div>
                    <div className="border-top pt-2 d-flex justify-content-between fw-bold mt-2"><span>Total Amount</span><span>₹{price.toLocaleString()}</span></div>
                </div>
            );
        return <div>{/* Your existing Fare Details code here */} Fare Breakdown Content</div>;
      case 'baggage':
        return (
          <div className="animate__animated animate__fadeIn">
             <h6 className="fw-bold small mb-3 text-secondary">Baggage Allowance</h6>
             
             <table className="table table-sm table-bordered text-center small mb-0">
               <thead className="table-light text-secondary">
                 <tr>
                   <th className="fw-normal">Sector</th>
                   <th className="fw-normal"><FaShoppingBag className="me-1"/> Cabin</th>
                   <th className="fw-normal"><FaSuitcase className="me-1"/> Check-in</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   {/* <td className="fw-bold align-middle">DEL ➝ BOM</td> */}
                   <td className="align-middle">
                     <span className="fw-bold text-dark">7 kg</span>
                     <div className="text-muted" style={{fontSize: '0.65rem'}}>1 piece per pax</div>
                   </td>
                   <td className="align-middle">
                     <span className="fw-bold text-dark">15 kg</span>
                     <div className="text-muted" style={{fontSize: '0.65rem'}}>1 piece per pax</div>
                   </td>
                 </tr>
               </tbody>
             </table>

             <div className="alert alert-light border mt-3 mb-0 p-2 d-flex gap-2">
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                  <strong>Note:</strong> Extra baggage can be purchased at the counter. Hand baggage must fit in the overhead bin.
                </small>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded border p-3 mt-2 shadow-sm">
        <ul className="nav nav-pills nav-fill small mb-3 border-bottom pb-2">
            {['flight', 'fare','baggage'].map(tab => (
                <li className="nav-item" key={tab}>
                    <button className={`nav-link py-1 px-2 ${activeTab === tab ? 'active bg-dark text-white' : 'text-muted'}`} onClick={() => setActiveTab(tab)}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                </li>
            ))}
        </ul>
        {renderContent()}
    </div>
  );
};

// --- 2. CALENDAR COMPONENTS ---
const CalendarStrip = ({ startDate, selectedDate, onDateSelect, minPrice }) => {
  const [viewStartDate, setViewStartDate] = useState(new Date(startDate || new Date()));
  const [dates, setDates] = useState([]);

  useEffect(() => { if(startDate) setViewStartDate(new Date(startDate)); }, [startDate]);

  useEffect(() => {
    const tempDates = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date(viewStartDate);
      d.setDate(viewStartDate.getDate() + i);
      const isSelected = d.toDateString() === new Date(selectedDate).toDateString();
      tempDates.push({ 
          dateStr: d.toDateString(), 
          day: d.toLocaleDateString('en-US', { weekday: 'short' }), 
          dateNum: d.getDate(), 
          price: minPrice + Math.floor(Math.random() * 1000) 
      });
    }
    setDates(tempDates);
  }, [viewStartDate, minPrice, selectedDate]);

  const shift = (days) => {
    const d = new Date(viewStartDate);
    d.setDate(d.getDate() + days);
    setViewStartDate(d);
  };

  return (
    <div className="d-flex align-items-center gap-1 bg-white rounded border p-1 shadow-sm">
        <button className="btn btn-sm btn-light rounded-circle p-1" onClick={() => shift(-5)}><FaChevronLeft/></button>
        <div className="d-flex overflow-hidden gap-1 flex-grow-1">
            {dates.map((item, idx) => {
                const isActive = item.dateStr === new Date(selectedDate).toDateString();
                return (
                    <div key={idx} onClick={() => onDateSelect(item.dateStr)} 
                         className={`text-center rounded p-1 flex-fill ${isActive ? 'bg-dark text-white' : 'bg-light'}`}
                         style={{fontSize: '0.7rem', cursor: 'pointer', minWidth: '50px'}}>
                        <div className="fw-bold">{item.dateNum} {item.day}</div>
                        <div className={isActive ? 'text-warning' : 'text-muted'}>₹{item.price}</div>
                    </div>
                );
            })}
        </div>
        <button className="btn btn-sm btn-light rounded-circle p-1" onClick={() => shift(5)}><FaChevronRight/></button>
    </div>
  );
};

const DualFareCalendar = ({ depDate, retDate, onDepChange, onRetChange }) => (
    <div className="bg-light sticky-top py-2 border-bottom shadow-sm" style={{top: '56px', zIndex: 1000}}>
        <div className="container">
            <div className="row g-2">
                <div className="col-md-6">
                    <div className="small fw-bold text-muted mb-1 ms-1">DEPARTURE</div>
                    <CalendarStrip startDate={depDate} selectedDate={depDate} onDateSelect={onDepChange} minPrice={4000} />
                </div>
                <div className="col-md-6">
                    <div className="small fw-bold text-muted mb-1 ms-1">RETURN</div>
                    <CalendarStrip startDate={retDate} selectedDate={retDate} onDateSelect={onRetChange} minPrice={4200} />
                </div>
            </div>
        </div>
    </div>
);

// --- 3. FLIGHT CARDS ---
const SelectableFlightCard = ({ flight, isSelected, onSelect, getAirlineLogo, airportMap }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className={`card mb-2 ${isSelected ? 'border-primary shadow bg-primary bg-opacity-10' : 'border-light shadow-sm bg-white'}`}>
      <div className="card-body p-2" onClick={() => onSelect(flight)} style={{cursor: 'pointer'}}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2" style={{width: '25%'}}>
             <img src={getAirlineLogo(flight.airline)} alt={flight.airline} style={{height:'20px', objectFit:'contain'}} />
             <div>
                <div className="fw-bold text-dark small">{flight.airline}</div>
                <div className="text-muted" style={{fontSize: '0.6rem'}}>{flight.flightCode}</div>
             </div>
          </div>
          <div className="text-center" style={{width: '45%'}}>
             <div className="fw-bold small">{flight.departureTime} - {flight.arrivalTime}</div>
             {/* --- FIX: Added fallback for stops --- */}
             <div className="small text-muted" style={{fontSize: '0.6rem'}}>{flight.duration} • {flight.stops || 'Nonstop'}</div>
          </div>
          <div className="d-flex align-items-center justify-content-end gap-2" style={{width: '30%'}}>
             <div className="fw-bold text-dark small">₹{flight.price.toLocaleString()}</div>
             {isSelected ? <FaCheckCircle className="text-primary" /> : <FaRegCircle className="text-secondary opacity-50" />}
          </div>
        </div>
      </div>
      <div className="card-footer p-0 bg-transparent border-top-0">
          <button className="btn btn-link w-100 text-decoration-none py-0 text-muted" style={{fontSize: '0.65rem'}} onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}>
            {showDetails ? 'Hide' : 'Details'} {showDetails ? <FaAngleUp/> : <FaAngleDown/>}
          </button>
          {showDetails && <div className="px-2 pb-2"><FlightDetailsPanel flight={flight} getAirlineLogo={getAirlineLogo} airportMap={airportMap} /></div>}
      </div>
    </div>
  );
};

const StandardFlightCard = ({ itinerary, getAirlineLogo, airportMap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getCity = (code) => airportMap[code]?.city || code;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : "";

  const handleBook = () => {
    const bookingPayload = {
      totalPrice: itinerary.totalPrice,
      tripType: itinerary.tripType,
      segments: itinerary.flights 
    };
    navigate('/booking', { state: bookingPayload });
  };

  return (
    <div className="card border-0 shadow-sm mb-4 bg-white">
      {itinerary.tripType === 'Multi-City' && (
         <div className="card-header bg-light border-bottom-0 d-flex gap-2 py-2">
             <span className="badge bg-dark">Multi-City</span>
             <div className="small fw-bold text-secondary d-flex align-items-center gap-2">
                 {itinerary.flights.map((f, i) => (
                    <span key={i} className="d-flex align-items-center gap-1">
                        {f.origin} <FaPlane size={10}/> {f.destination} 
                        {i < itinerary.flights.length - 1 && <span className="text-muted mx-1">|</span>}
                    </span>
                 ))}
             </div>
         </div>
      )}

      <div className="card-body p-3">
        <div className="row">
          <div className="col-lg-9">
             <div className="d-flex flex-column gap-3">
                {itinerary.flights.map((flight, idx) => (
                  <div key={idx} className="d-flex align-items-center border rounded p-2 bg-white position-relative">
                      {itinerary.tripType === 'Multi-City' && (
                          <div className="position-absolute start-0 top-0 bg-secondary text-white small px-2 rounded-bottom-end" style={{fontSize:'0.6rem'}}>
                              Leg {idx + 1} • {formatDate(flight.date)}
                          </div>
                      )}
                      <div className="flex-grow-1 p-2 mt-2">
                          <div className="row align-items-center">
                             <div className="col-md-3 d-flex align-items-center gap-2">
                                <img src={getAirlineLogo(flight.airline)} alt="logo" style={{height:'50px'}} />
                                <div>
                                    <div className="fw-bold small">{flight.airline}</div>
                                    <div className="text-muted" style={{fontSize:'0.65rem'}}>{flight.flightCode}</div>
                                </div>
                             </div>
                             <div className="col-md-6">
                                <div className="d-flex align-items-center justify-content-between text-center">
                                   <div>
                                      <div className="h5 mb-0 fw-bold">{flight.departureTime}</div>
                                      <div className="small text-muted">{flight.origin}</div>
                                   </div>
                                   
                                   {/* --- FIX START: ADDED STOPS DISPLAY HERE --- */}
                                   <div className="d-flex flex-column align-items-center px-2">
                                      <small className="text-muted" style={{fontSize:'0.6rem'}}>{flight.duration}</small>
                                      <div className="border-top w-100 border-secondary opacity-25" style={{width:'40px'}}></div>
                                      <small className="text-muted" style={{fontSize:'0.6rem'}}>{flight.stops || 'Nonstop'}</small>
                                   </div>
                                   {/* --- FIX END --- */}

                                   <div>
                                      <div className="h5 mb-0 fw-bold">{flight.arrivalTime}</div>
                                      <div className="small text-muted">{flight.destination}</div>
                                   </div>
                                </div>
                             </div>
                             <div className="col-md-3 text-end">
                                <div className="small fw-bold text-truncate">{getCity(flight.destination)}</div>
                             </div>
                          </div>
                      </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="col-lg-3 mt-3 mt-lg-0 border-start-lg ps-lg-4 d-flex flex-column justify-content-center text-center">
              <div className="h2 mb-0 fw-bold text-dark">₹{itinerary.totalPrice.toLocaleString()}</div>
              <div className="small text-success fw-bold mb-3">Partially Refundable</div>
              <button className="btn btn-lg fw-bold text-white rounded-pill shadow-sm w-100 mb-2" style={{ backgroundColor: "#ff6b00" }} onClick={handleBook}>BOOK</button>
              <button className="btn btn-link text-decoration-none btn-sm p-0 text-secondary" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? 'Hide Details' : 'View Details'} {isOpen ? <FaAngleUp/> : <FaAngleDown/>}
              </button>
          </div>
        </div>
      </div>
      {isOpen && <div className="border-top bg-light p-3"><FlightDetailsPanel flight={itinerary} getAirlineLogo={getAirlineLogo} airportMap={airportMap} /></div>}
    </div>
  );
};

// --- 4. MAIN SEARCH RESULTS COMPONENT ---
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};
  
  const [depDate, setDepDate] = useState(searchParams.date || new Date().toDateString());
  const [retDate, setRetDate] = useState(searchParams.returnDate || new Date().toDateString());

  const [itineraries, setItineraries] = useState([]); 
  const [outboundList, setOutboundList] = useState([]); 
  const [returnList, setReturnList] = useState([]); 
  
  const [selectedOutboundId, setSelectedOutboundId] = useState(null);
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [airportMap, setAirportMap] = useState({});
  const [priceRange, setPriceRange] = useState(50000);

  // Filters
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedDepTimes, setSelectedDepTimes] = useState([]);
  const [selectedArrTimes, setSelectedArrTimes] = useState([]); 

  // --- SORTING STATE ---
  const [sortBy, setSortBy] = useState('price'); 
  const [sortOrder, setSortOrder] = useState('asc');

  const getCode = (str) => str ? str.match(/\(([^)]+)\)/)?.[1] || str : "";
  
  // Data Fetching
  useEffect(() => {
    setLoading(true);
    const AIRPORTS_API = 'https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json';
    const FLIGHTS_API = "https://gist.githubusercontent.com/ratnakarguru/9c7e9b4ffcdbf653fe8c467b470f2eec/raw";

    // Simulate delay to show loader
    setTimeout(() => {
        Promise.all([fetch(AIRPORTS_API).then(res => res.json()), fetch(FLIGHTS_API).then(res => res.json())])
        .then(([airportsData, flightsData]) => {
            const map = {};
            airportsData.forEach(ap => { if(ap.iata_code) map[ap.iata_code] = { city: ap.city, name: ap.name }; });
            setAirportMap(map);

            if (searchParams.type === 'Round Trip') {
                const fromCode = getCode(searchParams.from);
                const toCode = getCode(searchParams.to);
                let outFlights = flightsData.filter(f => f.origin === fromCode && f.destination === toCode);
                let retFlights = flightsData.filter(f => f.origin === toCode && f.destination === fromCode);
                
                if (outFlights.length === 0) outFlights = [{...flightsData[0], origin: fromCode || 'DEL', destination: toCode || 'BOM', price: 5000, id: 901}];
                if (retFlights.length === 0) retFlights = outFlights.map(f => ({...f, origin: toCode || 'BOM', destination: fromCode || 'DEL', id: f.id + 100}));

                const depRand = Math.floor(Math.random() * 500); 
                const retRand = Math.floor(Math.random() * 500); 
                outFlights = outFlights.map(f => ({ ...f, date: depDate, price: f.price + depRand }));
                retFlights = retFlights.map(f => ({ ...f, date: retDate, price: f.price + retRand }));

                setOutboundList(outFlights);
                setReturnList(retFlights);
                if(!selectedOutboundId && outFlights[0]) setSelectedOutboundId(outFlights[0].id);
                if(!selectedReturnId && retFlights[0]) setSelectedReturnId(retFlights[0].id);

            } else if (searchParams.type === 'Multi-City') {
                const segments = searchParams.segments && searchParams.segments.length > 0 
                    ? searchParams.segments 
                    : [{from: 'DEL', to: 'BOM', date: new Date().toDateString()}, {from: 'BOM', to: 'BLR', date: new Date().toDateString()}];

                const constructedItineraries = [];
                for(let i=0; i<5; i++) { 
                    const itineraryFlights = [];
                    let totalPrice = 0;
                    
                    segments.forEach((seg, idx) => {
                        const fCode = getCode(seg.from);
                        const tCode = getCode(seg.to);
                        let matches = flightsData.filter(f => f.origin === fCode && f.destination === tCode);
                        if(matches.length === 0) matches = [{...flightsData[0], origin: fCode, destination: tCode, price: 4000 + (idx*1000), id: 999+i+idx}];
                        const flight = matches[i % matches.length];
                        itineraryFlights.push({...flight, date: seg.date, price: flight.price});
                        totalPrice += flight.price;
                    });
                    
                    constructedItineraries.push({ 
                        id: i, 
                        tripType: 'Multi-City', 
                        flights: itineraryFlights, 
                        totalPrice 
                    });
                }
                setItineraries(constructedItineraries);

            } else {
                const fromCode = getCode(searchParams.from);
                const toCode = getCode(searchParams.to);
                let matches = flightsData.filter(f => f.origin === fromCode && f.destination === toCode);
                if(matches.length === 0) matches = [{...flightsData[0], origin: fromCode || 'DEL', destination: toCode || 'BOM', price: 4000, id: 888}];
                const constructed = matches.map(f => ({ id: f.id, tripType: 'One Way', flights: [{...f, date: depDate}], totalPrice: f.price }));
                setItineraries(constructed);
            }
            setLoading(false);
        });
    }, 2000);
  }, [searchParams, depDate, retDate]);

  const getAirlineLogo = (name) => {
  const logos = {
    IndiGo: "https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg",
    "Air India": "https://planesticker.com/cdn/shop/files/AirIndiaTaillogo.png?v=1739769083",
    Vistara: "https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg",
    SpiceJet: "https://1000logos.net/wp-content/uploads/2021/07/SpiceJet-Logo.png",
    "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Akasa_Air_logo.svg/960px-Akasa_Air_logo.svg.png",
    "AIX Connect": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/AIX_Connect_logo.svg/512px-AIX_Connect_logo.svg.png"
  };

  return logos[name] || "https://cdn-icons-png.flaticon.com/512/3125/3125713.png"; // ✈️ default
};


  // --- FILTERING & SORTING LOGIC ---
  const checkTimeMatch = (timeStr, selectedTimes) => {
    if (!selectedTimes || selectedTimes.length === 0) return true;
    const hour = parseInt(timeStr.split(':')[0], 10);
    return selectedTimes.some(period => {
        if (period === 'Before 6 AM') return hour < 6;
        if (period === '6 AM - 12 PM') return hour >= 6 && hour < 12;
        if (period === '12 PM - 6 PM') return hour >= 12 && hour < 18;
        if (period === 'After 6 PM') return hour >= 18;
        return false;
    });
  };

  // --- FILTERING LOGIC ---

  const filterItem = (item) => {
    const price = item.totalPrice || item.price;
    const flights = item.flights ? item.flights : [item];
    const firstFlight = flights[0];
    const lastFlight = flights[flights.length - 1];

    // 1. Price Filter
    if (price > priceRange) return false;

    // 2. Stops Filter (Updated for your JSON)
    if (selectedStops.length > 0) {
        const hasMatch = flights.every(f => {
            // Get the value from JSON (e.g., "Non-Stop", "1 Stop")
            let dataValue = f.stops; 
            // If data is number (0) or string "0", treat as "Non-Stop"
            if (dataValue === 0 || dataValue === '0' || dataValue === 'Nonstop') {
                dataValue = 'Non-Stop';
            }
            
            // If data is number (1) or string "1", treat as "1 Stop"
            if (dataValue === 1 || dataValue === '1') {
                dataValue = '1 Stop';
            }

            // If data is "2 Stops", "3 Stops", etc., map to "2+ Stops"
            if ( (typeof dataValue === 'string' && parseInt(dataValue) >= 2) || dataValue >= 2 ) {
                dataValue = '2+ Stops';
            }

            // Check if the normalized value is in the selected list
            return selectedStops.includes(dataValue);
        });
        if (!hasMatch) return false;
    }

    // 3. Airline Filter
    if (selectedAirlines.length > 0) {
        const hasMatch = flights.every(f => selectedAirlines.includes(f.airline));
        if (!hasMatch) return false;
    }

    // 4. Time Filters
    if (!checkTimeMatch(firstFlight.departureTime, selectedDepTimes)) return false;
    if (!checkTimeMatch(lastFlight.arrivalTime, selectedArrTimes)) return false;

    return true;
  };

  // *** SORTING FUNCTION ***
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
        const aFlights = a.flights || [a];
        const bFlights = b.flights || [b];
        const aFirst = aFlights[0];
        const bFirst = bFlights[0];
        const aLast = aFlights[aFlights.length - 1];
        const bLast = bFlights[bFlights.length - 1];
        const aPrice = a.totalPrice || a.price;
        const bPrice = b.totalPrice || b.price;

        const getMins = (str) => {
            const h = str.match(/(\d+)h/)?.[1] || 0;
            const m = str.match(/(\d+)m/)?.[1] || 0;
            return parseInt(h) * 60 + parseInt(m);
        };

        let diff = 0;
        switch (sortBy) {
            case 'price':
                diff = aPrice - bPrice;
                break;
            case 'departure':
                diff = aFirst.departureTime.localeCompare(bFirst.departureTime);
                break;
            case 'arrival':
                diff = aLast.arrivalTime.localeCompare(bLast.arrivalTime);
                break;
            case 'duration':
                const aDur = aFlights.reduce((acc, f) => acc + getMins(f.duration), 0);
                const bDur = bFlights.reduce((acc, f) => acc + getMins(f.duration), 0);
                diff = aDur - bDur;
                break;
            default:
                diff = 0;
        }
        return sortOrder === 'asc' ? diff : -diff;
    });
  };

  // *** SORT HANDLER ***
  const handleSortClick = (key) => {
      // If user clicks the label "SortBy", ignore or reset
      if (key === 'SortBy') return;

      if (sortBy === key) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
          setSortBy(key);
          setSortOrder('asc');
      }
  };

  const filteredOutbound = sortItems(outboundList.filter(filterItem));
  const filteredReturn = sortItems(returnList.filter(filterItem));
  const filteredItineraries = sortItems(itineraries.filter(filterItem));

  const selectedOutbound = outboundList.find(f => f.id === selectedOutboundId);
  const selectedReturn = returnList.find(f => f.id === selectedReturnId);
  const grandTotal = (selectedOutbound?.price || 0) + (selectedReturn?.price || 0);
  
  const uniqueAirlines = [...new Set([...outboundList, ...returnList, ...itineraries.flatMap(i => i.flights.map(f=>f.airline))].map(f => f.airline || f))];

  const handleRoundTripBook = () => {
    if (!selectedOutbound || !selectedReturn) {
        alert("Please select both flights.");
        return;
    }
    const bookingPayload = {
      totalPrice: grandTotal,
      tripType: "Round Trip",
      segments: [selectedOutbound, selectedReturn]
    };
    navigate('/booking', { state: bookingPayload });
  };
   
 return (
    <div className="bg-light min-vh-100 pb-5">
      
      {/* 2. Pass the real data to the Loader */}
      {loading && (
        <FlightLoader 
            // Use real search params, with fallbacks to defaults if empty
            routeFrom={searchParams.from || "DEL"}
            routeTo={searchParams.to || "BOM"}
            
            
            // "fromLabel" usually contains "Delhi (DEL)", pass that for the full name
            fromAirport={searchParams.fromLabel || searchParams.from || "Origin"}
            toAirport={searchParams.toLabel || searchParams.to || "Destination"}
            
            travelDate={searchParams.date || new Date()}
            
            // Only pass return date if it's a Round Trip
            returnDate={searchParams.type === 'Round Trip' ? searchParams.returnDate : null}
            
            loadingMessage={`Searching flights from ${searchParams.from || 'Origin'} to ${searchParams.to || 'Dest'}...`}
        />
      )}

      <ModifySearch />
      
      {searchParams.type === 'Round Trip' ? (
          <DualFareCalendar depDate={depDate} retDate={retDate} onDepChange={setDepDate} onRetChange={setRetDate} />
      ) : (
         <div className="container mt-3">
             <CalendarStrip startDate={depDate} selectedDate={depDate} onDateSelect={setDepDate} minPrice={4000} />
         </div>
      )}

      <div className="container mt-4">
        <div className="row">
          <FlightFilters 
             priceRange={priceRange} setPriceRange={setPriceRange} selectedStops={selectedStops} setSelectedStops={setSelectedStops}
             selectedAirlines={selectedAirlines} setSelectedAirlines={setSelectedAirlines} selectedDepTimes={selectedDepTimes} setSelectedDepTimes={setSelectedDepTimes}
             selectedArrTimes={selectedArrTimes} setSelectedArrTimes={setSelectedArrTimes} uniqueAirlines={uniqueAirlines}
          />
          <div className="col-lg-9">
            
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : searchParams.type === 'Round Trip' ? (
                <>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="bg-white border rounded p-2" style={{minHeight: '500px'}}>
                                <div className="text-muted small fw-bold mb-2">Select Departure</div>
                                {filteredOutbound.length > 0 ? (
                                    filteredOutbound.map(f => <SelectableFlightCard key={f.id} flight={f} isSelected={selectedOutboundId === f.id} onSelect={(x) => setSelectedOutboundId(x.id)} getAirlineLogo={getAirlineLogo} airportMap={airportMap}/>)
                                ) : <div className="text-center text-muted mt-5 small">No flights match filters</div>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="bg-white border rounded p-2" style={{minHeight: '500px'}}>
                                <div className="text-muted small fw-bold mb-2">Select Return</div>
                                {filteredReturn.length > 0 ? (
                                    filteredReturn.map(f => <SelectableFlightCard key={f.id} flight={f} isSelected={selectedReturnId === f.id} onSelect={(x) => setSelectedReturnId(x.id)} getAirlineLogo={getAirlineLogo} airportMap={airportMap}/>)
                                ) : <div className="text-center text-muted mt-5 small">No flights match filters</div>}
                            </div>
                        </div>
                    </div>
                    {/* Round Trip Footer */}
                    <div className="fixed-bottom bg-white shadow-lg p-3 border-top" style={{zIndex: 1050}}>
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center gap-4">
                                        <div><div className="small text-muted">Departure</div><div className="fw-bold">{selectedOutbound?.airline} {selectedOutbound?.flightCode}</div></div>
                                        <FaExchangeAlt className="text-secondary"/>
                                        <div><div className="small text-muted">Return</div><div className="fw-bold">{selectedReturn?.airline} {selectedReturn?.flightCode}</div></div>
                                    </div>
                                </div>
                                <div className="col-md-4 text-end">
                                    <div className="d-flex align-items-center justify-content-end gap-3">
                                        <div><div className="small text-muted text-uppercase">Total Fare</div><div className="h4 mb-0 fw-bold">₹{grandTotal.toLocaleString()}</div></div>
                                        <button className="btn btn-primary fw-bold px-4 rounded-pill" onClick={handleRoundTripBook}>BOOK NOW</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{height: '80px'}}></div> 
                </>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-dark mb-0">Available Flights</h5>
                        <span className="badge bg-dark">{filteredItineraries.length} Options</span>
                    </div>

                    {/* --- SORT BAR (Your Design + Integrated Logic) --- */}
                    <div className="bg-white border rounded mb-3 d-flex overflow-auto">
                        {[
                            { key: 'SortBy', label: 'Sort By' },
                            { key: 'departure', label: 'Departure' },
                            { key: 'duration', label: 'Duration' },
                            { key: 'arrival', label: 'Arrival' },
                            { key: 'price', label: 'Price' }
                        ].map((item) => {
                            const isActive = sortBy === item.key;
                            const isLabel = item.key === 'SortBy';

                            return (
                            <button
                                key={item.key}
                                className={`btn btn-link text-decoration-none flex-fill py-2 text-dark small fw-bold d-flex align-items-center justify-content-center gap-1 border-end rounded-0 ${
                                isActive ? 'bg-light text-primary' : ''
                                } ${isLabel ? 'text-muted pe-none' : ''}`} // Disable click on "Sort By" label
                                onClick={() => handleSortClick(item.key)}
                            >
                                {item.label}

                                {/* Icon always visible, except for the Label */}
                                {!isLabel && (
                                    isActive ? (
                                    sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                                    ) : (
                                    <FaSortAmountUp className="text-muted opacity-25" />
                                    )
                                )}
                            </button>
                            );
                        })}
                    </div>

                    {filteredItineraries.length > 0 ? (
                        filteredItineraries.map((itinerary) => (
                            <StandardFlightCard key={itinerary.id} itinerary={itinerary} getAirlineLogo={getAirlineLogo} airportMap={airportMap} />
                        ))
                    ) : (
                        <div className="alert alert-warning text-center">No flights found matching your filters.</div>
                    )}
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;