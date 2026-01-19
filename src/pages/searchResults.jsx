import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaArrowRight,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaSuitcase,
  FaFileInvoiceDollar,
  FaExchangeAlt,
  FaInfoCircle,
  FaAngleDown,
  FaAngleUp,
  FaCircle,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaRegCircle
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import FlightFilters from "./flightfilters"; 

// --- 1. FARE CALENDAR ---
const FareCalendar = ({ initialDate, minPrice }) => {
  const [viewStartDate, setViewStartDate] = useState(new Date(initialDate || new Date()));
  const [selectedDateStr, setSelectedDateStr] = useState(new Date(initialDate || new Date()).toDateString());
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const basePrice = minPrice || 4500; 
    const tempDates = [];
    const initialDateObj = new Date(initialDate || new Date());

    for (let i = 0; i < 15; i++) {
      const d = new Date(viewStartDate);
      d.setDate(viewStartDate.getDate() + i);
      const isSelectedDay = d.toDateString() === initialDateObj.toDateString();
      let displayPrice = isSelectedDay && minPrice ? minPrice : (basePrice + Math.floor(Math.random() * 2000) - 500);

      tempDates.push({
        dateStr: d.toDateString(),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        dateNum: d.getDate(),
        price: displayPrice < 3000 ? 3000 : displayPrice 
      });
    }
    setDates(tempDates);
  }, [viewStartDate, minPrice, initialDate]);

  const shiftDates = (days) => {
    const newStart = new Date(viewStartDate);
    newStart.setDate(newStart.getDate() + days);
    setViewStartDate(newStart);
  };

  return (
    <div className="bg-white shadow-sm py-3 mb-3 border-bottom sticky-top" style={{top: '70px', zIndex: 1010}}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <button className="btn btn-light rounded-circle border shadow-sm" onClick={() => shiftDates(-7)}><FaChevronLeft /></button>
          <div className="d-flex gap-2 overflow-auto px-1 py-1 w-100" style={{ scrollbarWidth: 'none' }}>
            {dates.map((item, idx) => {
              const isActive = item.dateStr === selectedDateStr;
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDateStr(item.dateStr)}
                  className={`card border-0 px-2 py-2 text-center flex-shrink-0 rounded-3 ${isActive ? 'bg-dark text-white shadow' : 'bg-light text-muted'}`} 
                  style={{ minWidth: '100px', cursor: 'pointer', transition: 'all 0.2s ease', border: isActive ? 'none' : '1px solid #eee' }}
                >
                  <div className={`small fw-bold ${isActive ? 'text-white' : 'text-dark'}`} style={{fontSize:'0.85rem'}}>{item.dateNum} {item.month}, {item.day}</div>
                  <div className={`small fw-bold ${isActive ? 'text-warning' : 'text-secondary'}`} style={{fontSize:'0.8rem'}}>₹{item.price.toLocaleString()}</div>
                  {isActive && <div className="mt-1 bg-warning rounded-pill mx-auto" style={{width: '20px', height:'3px'}}></div>}
                </div>
              );
            })}
          </div>
          <button className="btn btn-light rounded-circle border shadow-sm" onClick={() => shiftDates(7)}><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
};

// --- 2. SELECTABLE FLIGHT CARD (For Split View) ---
const SelectableFlightCard = ({ flight, isSelected, onSelect, getAirlineLogo }) => {
  return (
    <div 
      className={`card mb-2 cursor-pointer transition-all ${isSelected ? 'border-primary shadow bg-primary bg-opacity-10' : 'border-light shadow-sm bg-white'}`}
      onClick={() => onSelect(flight)}
      style={{ cursor: 'pointer', transition: '0.2s' }}
    >
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* Logo & Airline */}
          <div className="d-flex align-items-center gap-2" style={{width: '30%'}}>
             <img src={getAirlineLogo(flight.airline)} alt={flight.airline} style={{height:'24px', objectFit:'contain'}} />
             <div>
                <div className="fw-bold text-dark small">{flight.airline}</div>
                <div className="text-muted" style={{fontSize: '0.65rem'}}>{flight.flightCode}</div>
             </div>
          </div>

          {/* Time & Duration */}
          <div className="text-center" style={{width: '40%'}}>
             <div className="d-flex align-items-center justify-content-center gap-2">
                <span className="fw-bold">{flight.departureTime}</span>
                <div className="d-flex flex-column align-items-center" style={{width: '40px'}}>
                   <div className="border-top border-secondary w-100" style={{opacity: 0.5}}></div>
                   <small style={{fontSize: '0.6rem'}} className="text-muted">{flight.duration}</small>
                </div>
                <span className="fw-bold">{flight.arrivalTime}</span>
             </div>
             <div className="small text-muted" style={{fontSize: '0.65rem'}}>{flight.stops}</div>
          </div>

          {/* Price & Radio */}
          <div className="d-flex align-items-center justify-content-end gap-3" style={{width: '30%'}}>
             <div className="fw-bold text-dark">₹{flight.price.toLocaleString()}</div>
             {isSelected ? <FaCheckCircle className="text-primary fs-5" /> : <FaRegCircle className="text-secondary fs-5 opacity-50" />}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- 3. STANDARD FLIGHT CARD (For One Way / Multi City) ---
const StandardFlightCard = ({ itinerary, getAirlineLogo, airportMap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('flight');
  const getCity = (code) => airportMap[code]?.city || code;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : "";

  return (
    <div className="card border-0 shadow-sm mb-4 bg-white">
      <div className="card-body p-3 p-md-4">
        <div className="row">
          <div className="col-lg-9">
             <div className="d-flex flex-column gap-3">
                {itinerary.flights.map((flight, idx) => (
                  <div key={idx} className="border rounded-3 position-relative overflow-hidden hover-shadow bg-white">
                     <div className="bg-light px-3 py-1 border-bottom d-flex justify-content-between align-items-center">
                        <span className="small fw-bold text-muted">{itinerary.tripType === 'Multi-City' ? `Leg ${idx + 1}` : "One Way Trip"}</span>
                        <span className="small text-dark fw-bold"><FaCalendarAlt className="me-1 text-secondary"/> {formatDate(flight.date)}</span>
                     </div>
                     <div className="p-3">
                         <div className="row align-items-center">
                            <div className="col-md-3 d-flex align-items-center gap-3">
                               <img src={getAirlineLogo(flight.airline)} alt={flight.airline} style={{height:'35px'}} />
                               <div>
                                 <div className="fw-bold text-dark">{flight.airline}</div>
                                 <div className="text-muted small">{flight.flightCode}</div>
                               </div>
                            </div>
                            <div className="col-md-6">
                               <div className="d-flex align-items-center justify-content-between">
                                  <div className="text-center">
                                     <div className="h4 mb-0 fw-bold">{flight.departureTime}</div>
                                     <div className="small fw-bold text-muted">{flight.origin}</div>
                                  </div>
                                  <div className="d-flex flex-column align-items-center px-3 flex-grow-1">
                                     <small className="text-muted mb-1" style={{fontSize:'0.7rem'}}>{flight.duration}</small>
                                     <div className="border-top w-100 border-secondary opacity-25"></div>
                                     <div className="small text-success mt-1 fw-bold" style={{fontSize:'0.65rem'}}>{flight.stops}</div>
                                  </div>
                                  <div className="text-center">
                                     <div className="h4 mb-0 fw-bold">{flight.arrivalTime}</div>
                                     <div className="small fw-bold text-muted">{flight.destination}</div>
                                  </div>
                               </div>
                            </div>
                            <div className="col-md-3 text-end">
                               <div className="small text-muted">To</div>
                               <div className="fw-bold text-truncate">{getCity(flight.destination)}</div>
                            </div>
                         </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="col-lg-3 mt-3 mt-lg-0 border-start-lg ps-lg-4 d-flex flex-column justify-content-center">
            <div className="text-center">
                <div className="h2 mb-0 fw-bold text-dark">₹{itinerary.totalPrice.toLocaleString()}</div>
                <div className="small text-success fw-bold mb-3">Partially Refundable</div>
                <button className="btn btn-lg fw-bold text-white rounded-pill shadow-sm w-100 mb-2" style={{ backgroundColor: "#ff6b00" }}>BOOK</button>
                <button className="btn btn-link text-decoration-none btn-sm p-0 text-secondary" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? 'Hide Details' : 'View Details'} {isOpen ? <FaAngleUp/> : <FaAngleDown/>}
                </button>
            </div>
          </div>
        </div>
      </div>
      {/* Details Tab Section (Simplified for brevity, same as previous) */}
      {isOpen && <div className="border-top bg-light p-3 text-center small text-muted">Full itinerary details would appear here...</div>}
    </div>
  );
};

// --- 4. MAIN COMPONENT ---
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};
  
  const [itineraries, setItineraries] = useState([]); // For OneWay/Multi
  const [outboundList, setOutboundList] = useState([]); // For Round Trip Left
  const [returnList, setReturnList] = useState([]); // For Round Trip Right
  
  // Selection State for Round Trip
  const [selectedOutboundId, setSelectedOutboundId] = useState(null);
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [airportMap, setAirportMap] = useState({});
  const [priceRange, setPriceRange] = useState(50000);

  // Filters (Apply to both lists in Round Trip)
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedDepTimes, setSelectedDepTimes] = useState([]);
  const [selectedArrTimes, setSelectedArrTimes] = useState([]); 

  const getCode = (str) => str ? str.match(/\(([^)]+)\)/)?.[1] || str : "";

  // Helper to generate a dynamic title
  const getRouteTitle = () => {
    if (searchParams.type === 'Multi-City' && searchParams.segments) {
        return "Multi-City Trip";
    }
    const f = getCode(searchParams.from);
    const t = getCode(searchParams.to);
    const arrow = searchParams.type === 'Round Trip' ? '⇄' : '➝';
    return `${airportMap[f]?.city || f || "Origin"} ${arrow} ${airportMap[t]?.city || t || "Dest"}`;
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
            // --- ROUND TRIP LOGIC: SEPARATE LISTS ---
            const fromCode = getCode(searchParams.from);
            const toCode = getCode(searchParams.to);

            let outFlights = flightsData.filter(f => f.origin === fromCode && f.destination === toCode);
            let retFlights = flightsData.filter(f => f.origin === toCode && f.destination === fromCode);

            // Mock data generation if empty (for demo purposes)
            if (outFlights.length === 0) outFlights = [{...flightsData[0], origin: fromCode, destination: toCode, price: 5000, id: 901}];
            if (retFlights.length === 0) retFlights = outFlights.map(f => ({...f, origin: toCode, destination: fromCode, id: f.id + 100}));

            // Assign Dates
            outFlights = outFlights.map(f => ({...f, date: searchParams.date}));
            retFlights = retFlights.map(f => ({...f, date: searchParams.returnDate}));

            setOutboundList(outFlights);
            setReturnList(retFlights);
            
            // Auto-select first options
            if(outFlights[0]) setSelectedOutboundId(outFlights[0].id);
            if(retFlights[0]) setSelectedReturnId(retFlights[0].id);

        } else if (searchParams.type === 'Multi-City') {
            // --- MULTI CITY LOGIC ---
            const constructedItineraries = [];
            for(let i=0; i<5; i++) { 
                const itineraryFlights = [];
                let totalPrice = 0;
                let valid = true;
                searchParams.segments.forEach(seg => {
                    const fCode = getCode(seg.from);
                    const tCode = getCode(seg.to);
                    let matches = flightsData.filter(f => f.origin === fCode && f.destination === tCode);
                    if(matches.length === 0) matches = [{...flightsData[0], origin: fCode, destination: tCode, price: 4000, id: 999+i}];
                    
                    const flight = matches[i % matches.length];
                    itineraryFlights.push({...flight, date: seg.date});
                    totalPrice += flight.price;
                });
                if(valid) constructedItineraries.push({ id: i, tripType: 'Multi-City', flights: itineraryFlights, totalPrice });
            }
            setItineraries(constructedItineraries);

        } else {
            // --- ONE WAY LOGIC ---
            const fromCode = getCode(searchParams.from);
            const toCode = getCode(searchParams.to);
            let matches = flightsData.filter(f => f.origin === fromCode && f.destination === toCode);
            if(matches.length === 0) matches = [{...flightsData[0], origin: fromCode, destination: toCode, price: 4000, id: 888}];
            
            const constructed = matches.map(f => ({
                id: f.id, tripType: 'One Way', flights: [{...f, date: searchParams.date}], totalPrice: f.price
            }));
            setItineraries(constructed);
        }
        setLoading(false);
    });
  }, [searchParams]);

  const getAirlineLogo = (name) => {
    const logos = { IndiGo: "https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg", "Air India": "https://www.logo.wine/a/logo/Air_India/Air_India-Logo.wine.svg", Vistara: "https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg", SpiceJet: "https://1000logos.net/wp-content/uploads/2021/07/SpiceJet-Logo.png", "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Akasa_Air_logo.svg/960px-Akasa_Air_logo.svg.png?20211225210806" };
    return logos[name] || null;
  };

  // Helper to filter raw lists
  const filterList = (list) => {
    return list.filter(f => {
        if (priceRange && f.price > priceRange) return false;
        if (selectedStops.length > 0 && !selectedStops.includes(f.stops)) return false;
        if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airline)) return false;
        return true;
    });
  };

  const filteredOutbound = filterList(outboundList);
  const filteredReturn = filterList(returnList);
  
  // Calculate Total for Round Trip Selection
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
              <small className="text-white-50">{searchParams.type} | Economy</small>
            </div>
            <button className="btn btn-sm btn-outline-light rounded-pill px-4" onClick={() => navigate("/")}>Modify</button>
        </div>
      </div>

      <FareCalendar initialDate={searchParams.date} />

      <div className="container mt-4">
        <div className="row">
          <FlightFilters 
             priceRange={priceRange} setPriceRange={setPriceRange}
             selectedStops={selectedStops} setSelectedStops={setSelectedStops}
             selectedAirlines={selectedAirlines} setSelectedAirlines={setSelectedAirlines}
             selectedDepTimes={selectedDepTimes} setSelectedDepTimes={setSelectedDepTimes}
             selectedArrTimes={selectedArrTimes} setSelectedArrTimes={setSelectedArrTimes}
             uniqueAirlines={uniqueAirlines}
          />

          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : searchParams.type === 'Round Trip' ? (
                // --- ROUND TRIP SPLIT VIEW ---
                <>
                    <div className="row g-3">
                        {/* LEFT COL: OUTBOUND */}
                        <div className="col-md-6">
                            <div className="bg-primary text-white p-2 rounded-top text-center fw-bold small">
                                DEPARTURE • {searchParams.date}
                            </div>
                            <div className="bg-white border border-top-0 rounded-bottom p-2" style={{minHeight: '500px'}}>
                                {filteredOutbound.map(flight => (
                                    <SelectableFlightCard 
                                        key={flight.id} 
                                        flight={flight} 
                                        isSelected={selectedOutboundId === flight.id}
                                        onSelect={(f) => setSelectedOutboundId(f.id)}
                                        getAirlineLogo={getAirlineLogo}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COL: RETURN */}
                        <div className="col-md-6">
                            <div className="bg-success text-white p-2 rounded-top text-center fw-bold small">
                                RETURN • {searchParams.returnDate}
                            </div>
                            <div className="bg-white border border-top-0 rounded-bottom p-2" style={{minHeight: '500px'}}>
                                {filteredReturn.map(flight => (
                                    <SelectableFlightCard 
                                        key={flight.id} 
                                        flight={flight} 
                                        isSelected={selectedReturnId === flight.id}
                                        onSelect={(f) => setSelectedReturnId(f.id)}
                                        getAirlineLogo={getAirlineLogo}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* STICKY FOOTER FOR ROUND TRIP BOOKING */}
                    <div className="fixed-bottom bg-white shadow-lg p-3 border-top" style={{zIndex: 1050}}>
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center gap-4">
                                        <div>
                                            <div className="small text-muted">Departure</div>
                                            <div className="fw-bold">{selectedOutbound?.airline} {selectedOutbound?.flightCode}</div>
                                        </div>
                                        <FaExchangeAlt className="text-secondary"/>
                                        <div>
                                            <div className="small text-muted">Return</div>
                                            <div className="fw-bold">{selectedReturn?.airline} {selectedReturn?.flightCode}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 text-end">
                                    <div className="d-flex align-items-center justify-content-end gap-3">
                                        <div>
                                            <div className="small text-muted text-uppercase">Total Fare</div>
                                            <div className="h4 mb-0 fw-bold">₹{grandTotal.toLocaleString()}</div>
                                        </div>
                                        <button className="btn btn-primary fw-bold px-4 rounded-pill">BOOK NOW</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{height: '80px'}}></div> {/* Spacer for sticky footer */}
                </>
            ) : (
                // --- STANDARD LIST VIEW (One Way / Multi) ---
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-dark mb-0">Available Flights</h5>
                        <span className="badge bg-dark">{itineraries.length} Options</span>
                    </div>
                    {itineraries.map((itinerary) => (
                        <StandardFlightCard 
                            key={itinerary.id} 
                            itinerary={itinerary} 
                            getAirlineLogo={getAirlineLogo} 
                            airportMap={airportMap} 
                        />
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