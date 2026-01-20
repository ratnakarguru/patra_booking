import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaChevronLeft,
  FaChevronRight,
  FaSuitcase,
  FaFileInvoiceDollar,
  FaExchangeAlt,
  FaAngleDown,
  FaAngleUp,
  FaCheckCircle,
  FaRegCircle,
  FaCalendarAlt,
  FaList,
  FaMapMarkerAlt
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import FlightFilters from "./flightfilters";

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
                            {/* Visual Connector for Multi-Leg in Details */}
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
        case 'baggage':
            return (
                 <table className="table table-sm table-bordered small mb-0 mt-2">
                     <thead className="table-light"><tr><th>Leg</th><th>Cabin</th><th>Check-in</th></tr></thead>
                     <tbody>
                        {segments.map((f, i) => (
                            <tr key={i}>
                                <td>{f.origin}-{f.destination}</td>
                                <td>7 kg</td>
                                <td>15 kg</td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
            );
        case 'rules':
            return (
                <div className="py-2 small text-muted">
                    <div className="alert alert-warning py-1 px-2 mb-2" style={{fontSize:'0.7rem'}}>
                        Multi-City cancellation rules apply per leg.
                    </div>
                    <div><span className="fw-bold text-dark">Cancel:</span> ₹3,500 per leg</div>
                    <div><span className="fw-bold text-dark">Change:</span> ₹3,000 + Fare Diff</div>
                </div>
            );
        default: return null;
    }
  };

  return (
    <div className="bg-white rounded border p-3 mt-2 shadow-sm">
        <ul className="nav nav-pills nav-fill small mb-3 border-bottom pb-2">
            {['flight', 'fare', 'baggage', 'rules'].map(tab => (
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
             <div className="small text-muted" style={{fontSize: '0.6rem'}}>{flight.duration} • {flight.stops}</div>
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

// **FIXED StandardFlightCard FOR MULTI-CITY**
const StandardFlightCard = ({ itinerary, getAirlineLogo, airportMap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const getCity = (code) => airportMap[code]?.city || code;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : "";

  return (
    <div className="card border-0 shadow-sm mb-4 bg-white">
      {/* Header Summary for Multi-City */}
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
                      {/* Leg Label */}
                      {itinerary.tripType === 'Multi-City' && (
                          <div className="position-absolute start-0 top-0 bg-secondary text-white small px-2 rounded-bottom-end" style={{fontSize:'0.6rem'}}>
                              Leg {idx + 1} • {formatDate(flight.date)}
                          </div>
                      )}
                      
                      <div className="flex-grow-1 p-2 mt-2">
                          <div className="row align-items-center">
                             <div className="col-md-3 d-flex align-items-center gap-2">
                                <img src={getAirlineLogo(flight.airline)} alt="logo" style={{height:'24px'}} />
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
                                   <div className="d-flex flex-column align-items-center px-2">
                                      <small className="text-muted" style={{fontSize:'0.6rem'}}>{flight.duration}</small>
                                      <div className="border-top w-100 border-secondary opacity-25" style={{width:'40px'}}></div>
                                   </div>
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
              <button className="btn btn-lg fw-bold text-white rounded-pill shadow-sm w-100 mb-2" style={{ backgroundColor: "#ff6b00" }}>BOOK</button>
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

// --- 4. MAIN SEARCH RESULTS ---
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {}; // Handles undefined state safely
  
  // Independent Dates
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

  const getCode = (str) => str ? str.match(/\(([^)]+)\)/)?.[1] || str : "";
  
  // Dynamic Title Logic
  const getRouteTitle = () => {
    if (searchParams.type === 'Multi-City') return "Multi-City Trip";
    const f = getCode(searchParams.from || 'DEL');
    const t = getCode(searchParams.to || 'BOM');
    return `${airportMap[f]?.city || f} ${searchParams.type === 'Round Trip' ? '⇄' : '➝'} ${airportMap[t]?.city || t}`;
  };

  useEffect(() => {
    setLoading(true);
    const AIRPORTS_API = 'https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json';
    const FLIGHTS_API = "https://gist.githubusercontent.com/ratnakarguru/9c7e9b4ffcdbf653fe8c467b470f2eec/raw";

    Promise.all([fetch(AIRPORTS_API).then(res => res.json()), fetch(FLIGHTS_API).then(res => res.json())])
    .then(([airportsData, flightsData]) => {
        const map = {};
        airportsData.forEach(ap => { if(ap.iata_code) map[ap.iata_code] = { city: ap.city, name: ap.name }; });
        setAirportMap(map);

        if (searchParams.type === 'Round Trip') {
            // ... (Round Trip Logic same as before)
            const fromCode = getCode(searchParams.from);
            const toCode = getCode(searchParams.to);
            let outFlights = flightsData.filter(f => f.origin === fromCode && f.destination === toCode);
            let retFlights = flightsData.filter(f => f.origin === toCode && f.destination === fromCode);
            
            if (outFlights.length === 0) outFlights = [{...flightsData[0], origin: fromCode || 'DEL', destination: toCode || 'BOM', price: 5000, id: 901}];
            if (retFlights.length === 0) retFlights = outFlights.map(f => ({...f, origin: toCode || 'BOM', destination: fromCode || 'DEL', id: f.id + 100}));

            // Date & Price Randomization
            const depRand = Math.floor(Math.random() * 500); 
            const retRand = Math.floor(Math.random() * 500); 
            outFlights = outFlights.map(f => ({ ...f, date: depDate, price: f.price + depRand }));
            retFlights = retFlights.map(f => ({ ...f, date: retDate, price: f.price + retRand }));

            setOutboundList(outFlights);
            setReturnList(retFlights);
            if(!selectedOutboundId && outFlights[0]) setSelectedOutboundId(outFlights[0].id);
            if(!selectedReturnId && retFlights[0]) setSelectedReturnId(retFlights[0].id);

        } else if (searchParams.type === 'Multi-City') {
            // **FIXED MULTI-CITY LOGIC**
            // Fallback if segments are missing
            const segments = searchParams.segments && searchParams.segments.length > 0 
                ? searchParams.segments 
                : [
                    {from: 'DEL', to: 'BOM', date: new Date().toDateString()},
                    {from: 'BOM', to: 'BLR', date: new Date(new Date().setDate(new Date().getDate() + 2)).toDateString()}
                  ];

            const constructedItineraries = [];
            
            // Create 5 mock itinerary options
            for(let i=0; i<5; i++) { 
                const itineraryFlights = [];
                let totalPrice = 0;
                
                segments.forEach((seg, idx) => {
                    const fCode = getCode(seg.from);
                    const tCode = getCode(seg.to);
                    // Find a flight or use a fallback
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
            // One Way Logic
            const fromCode = getCode(searchParams.from);
            const toCode = getCode(searchParams.to);
            let matches = flightsData.filter(f => f.origin === fromCode && f.destination === toCode);
            if(matches.length === 0) matches = [{...flightsData[0], origin: fromCode || 'DEL', destination: toCode || 'BOM', price: 4000, id: 888}];
            const constructed = matches.map(f => ({ id: f.id, tripType: 'One Way', flights: [{...f, date: depDate}], totalPrice: f.price }));
            setItineraries(constructed);
        }
        setLoading(false);
    });
  }, [searchParams, depDate, retDate]);

  const getAirlineLogo = (name) => {
    const logos = { IndiGo: "https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg", "Air India": "https://www.logo.wine/a/logo/Air_India/Air_India-Logo.wine.svg", Vistara: "https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg", SpiceJet: "https://1000logos.net/wp-content/uploads/2021/07/SpiceJet-Logo.png", "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Akasa_Air_logo.svg/960px-Akasa_Air_logo.svg.png?20211225210806" };
    return logos[name] || null;
  };

  const filterList = (list) => list.filter(f => (!priceRange || f.price <= priceRange) && (selectedStops.length === 0 || selectedStops.includes(f.stops)) && (selectedAirlines.length === 0 || selectedAirlines.includes(f.airline)));

  const filteredOutbound = filterList(outboundList);
  const filteredReturn = filterList(returnList);
  const selectedOutbound = outboundList.find(f => f.id === selectedOutboundId);
  const selectedReturn = returnList.find(f => f.id === selectedReturnId);
  const grandTotal = (selectedOutbound?.price || 0) + (selectedReturn?.price || 0);
  const uniqueAirlines = [...new Set([...outboundList, ...returnList, ...itineraries.flatMap(i => i.flights.map(f=>f.airline))].map(f => f.airline || f))];

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Header */}
      <div className="bg-dark text-white py-3 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">{getRouteTitle()}</h5>
              <small className="text-white-50">{searchParams.type || 'One Way'} | Economy</small>
            </div>
            <button className="btn btn-sm btn-outline-light rounded-pill px-4" onClick={() => navigate("/")}>Modify</button>
        </div>
      </div>

      {/* Render Dual Calendar for Round Trip, Single for others */}
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
                                {filteredOutbound.map(f => <SelectableFlightCard key={f.id} flight={f} isSelected={selectedOutboundId === f.id} onSelect={(x) => setSelectedOutboundId(x.id)} getAirlineLogo={getAirlineLogo} airportMap={airportMap}/>)}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="bg-white border rounded p-2" style={{minHeight: '500px'}}>
                                <div className="text-muted small fw-bold mb-2">Select Return</div>
                                {filteredReturn.map(f => <SelectableFlightCard key={f.id} flight={f} isSelected={selectedReturnId === f.id} onSelect={(x) => setSelectedReturnId(x.id)} getAirlineLogo={getAirlineLogo} airportMap={airportMap}/>)}
                            </div>
                        </div>
                    </div>
                    {/* Sticky Footer for Round Trip */}
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
                                        <button className="btn btn-primary fw-bold px-4 rounded-pill">BOOK NOW</button>
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
                        <span className="badge bg-dark">{itineraries.length} Options</span>
                    </div>
                    {itineraries.map((itinerary) => (
                        <StandardFlightCard key={itinerary.id} itinerary={itinerary} getAirlineLogo={getAirlineLogo} airportMap={airportMap} />
                    ))}
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;