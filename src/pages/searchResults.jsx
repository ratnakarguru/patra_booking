import React, { useState, useEffect } from "react";
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
  FaCircle
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import FlightFilters from "./flightfilters"; 

// --- 1. SUB-COMPONENT: Fare Calendar ---
const FareCalendar = ({ selectedDate }) => {
  const [dates, setDates] = useState([]);
  useEffect(() => {
    const baseDate = new Date(selectedDate || new Date());
    const tempDates = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      tempDates.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        price: Math.floor(Math.random() * (8000 - 3000) + 3000), 
        isActive: i === 0
      });
    }
    setDates(tempDates);
  }, [selectedDate]);

  return (
    <div className="bg-white shadow-sm py-2 mb-3 border-bottom">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-sm btn-light rounded-circle border"><FaChevronLeft /></button>
          <div className="d-flex gap-2 overflow-auto px-2" style={{ scrollbarWidth: 'none' }}>
            {dates.map((item, idx) => (
              <div key={idx} className={`card border-0 px-3 py-2 text-center flex-shrink-0 rounded-3 ${item.isActive ? 'bg-dark text-white shadow' : 'bg-light text-muted'}`} style={{ minWidth: '90px', cursor: 'pointer' }}>
                <div className="small fw-bold" style={{fontSize:'0.8rem'}}>{item.date}, {item.day}</div>
                <div className="small" style={{fontSize:'0.75rem'}}>₹{item.price}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-sm btn-light rounded-circle border"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
};

// --- 2. SUB-COMPONENT: Flight Itinerary Item ---
const FlightItem = ({ itinerary, getAirlineLogo, airportMap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('flight');

  const firstFlight = itinerary.flights[0];
  const lastFlight = itinerary.flights[itinerary.flights.length - 1];
  const totalStops = itinerary.flights.length - 1; 
  const isMultiCity = itinerary.flights.length > 1;

  const getCity = (code) => airportMap[code]?.city || code;
  const getName = (code) => airportMap[code]?.name || "International Airport";

  return (
    <div className="card border-0 shadow-sm mb-3 hover-shadow transition-all bg-white">
      <div className="card-body p-3 p-md-4">
        <div className="row align-items-center text-center text-md-start">
          <div className="col-md-3 mb-3 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start gap-3">
            <div style={{ width: "50px", height: "50px" }} className="d-flex align-items-center justify-content-center bg-light rounded-circle">
               <img src={getAirlineLogo(firstFlight.airline)} alt={firstFlight.airline} className="img-fluid" style={{ maxHeight: "30px" }} />
            </div>
            <div>
              <div className="fw-bold text-dark">{firstFlight.airline}</div>
              <div className="small text-muted">{isMultiCity ? "Multi-City" : firstFlight.flightCode}</div>
            </div>
          </div>

          <div className="col-md-4 mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-between px-2">
              <div className="text-center">
                <div className="h5 mb-0 fw-bold">{firstFlight.departureTime}</div>
                <div className="small text-muted fw-bold">{firstFlight.origin}</div>
              </div>
              <div className="d-flex flex-column align-items-center small text-muted px-2 w-50">
                <span>{itinerary.totalDuration}</span>
                <div className="position-relative w-100 my-2">
                  <div className="border-top border-secondary opacity-25 w-100"></div>
                  {isMultiCity ? (
                     <div className="position-absolute top-0 start-50 translate-middle bg-white px-1">
                        <span className="badge bg-secondary rounded-pill" style={{fontSize:'0.6rem'}}>{totalStops} Stop(s)</span>
                     </div>
                  ) : (
                    <FaPlane className="position-absolute top-0 start-50 translate-middle text-primary bg-white px-1" style={{ fontSize: "12px", marginTop: '-1px' }} />
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="h5 mb-0 fw-bold">{lastFlight.arrivalTime}</div>
                <div className="small text-muted fw-bold">{lastFlight.destination}</div>
              </div>
            </div>
          </div>

          <div className="col-md-5 d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-end gap-3 border-start-md ps-md-4">
            <div className="text-end">
              <div className="h4 mb-0 fw-bold text-dark">₹{itinerary.totalPrice.toLocaleString()}</div>
              <div className="small text-success fw-bold">Partially Refundable</div>
            </div>
            <div className="d-flex flex-column gap-2 w-100 w-md-auto">
                <button className="btn fw-bold text-white rounded-1 px-4 shadow-sm" style={{ backgroundColor: "#ff6b00" }}>BOOK</button>
                <button className="btn btn-link text-decoration-none btn-sm p-0 text-secondary" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? 'Hide' : 'View'} Details {isOpen ? <FaAngleUp/> : <FaAngleDown/>}
                </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-top bg-light">
            <div className="d-flex border-bottom bg-white overflow-auto">
                {[{id: 'flight', label: 'Itinerary', icon: <FaInfoCircle/>}, {id: 'fare', label: 'Fare', icon: <FaFileInvoiceDollar/>}, {id: 'baggage', label: 'Baggage', icon: <FaSuitcase/>}, {id: 'rules', label: 'Rules', icon: <FaExchangeAlt/>}].map(tab => (
                    <button key={tab.id} className={`btn btn-sm rounded-0 py-2 px-3 d-flex align-items-center gap-2 border-end ${activeTab === tab.id ? 'btn-white text-primary border-bottom border-primary border-2 fw-bold' : 'text-secondary bg-light'}`} onClick={() => setActiveTab(tab.id)}>{tab.icon} {tab.label}</button>
                ))}
            </div>

            <div className="p-4 bg-white overflow-hidden">
                {activeTab === 'flight' && (
                    <div className="d-flex overflow-auto pb-3 pt-2" style={{ scrollbarWidth: 'thin' }}>
                        {itinerary.flights.map((segment, index) => (
                            <React.Fragment key={index}>
                                <div className="d-flex flex-column align-items-center" style={{minWidth: '160px'}}>
                                    <div className="fw-bold text-primary mb-1">{segment.departureTime}</div>
                                    <div className="position-relative d-flex align-items-center justify-content-center mb-2">
                                        <FaCircle className="text-primary z-1" size={12} />
                                        <div className="position-absolute start-50 border-top border-2 border-primary w-100" style={{top: '6px'}}></div>
                                        {index > 0 && <div className="position-absolute end-50 border-top border-2 border-primary w-100" style={{top: '6px'}}></div>}
                                    </div>
                                    <div className="fw-bold">{segment.origin}</div>
                                    <div className="small text-muted text-center text-truncate w-100 px-2" title={getName(segment.origin)}>
                                      {getCity(segment.origin)}
                                    </div>
                                </div>

                                <div className="d-flex flex-column align-items-center justify-content-center px-2" style={{minWidth: '180px'}}>
                                    <div className="badge bg-light text-dark border mb-1">{segment.airline}</div>
                                    <div className="border-top border-2 border-secondary border-dashed w-100 my-1 position-relative">
                                         <FaPlane className="position-absolute top-0 start-50 translate-middle bg-white text-secondary px-1" />
                                    </div>
                                    <div className="small text-muted">{segment.duration}</div>
                                </div>

                                {index === itinerary.flights.length - 1 && (
                                    <div className="d-flex flex-column align-items-center" style={{minWidth: '160px'}}>
                                        <div className="fw-bold text-dark mb-1">{segment.arrivalTime}</div>
                                        <div className="position-relative d-flex align-items-center justify-content-center mb-2">
                                            <FaCircle className="text-dark z-1" size={12} />
                                            <div className="position-absolute end-50 border-top border-2 border-primary w-100" style={{top: '6px'}}></div>
                                        </div>
                                        <div className="fw-bold">{segment.destination}</div>
                                        <div className="small text-muted text-center text-truncate w-100 px-2" title={getName(segment.destination)}>
                                          {getCity(segment.destination)}
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {activeTab === 'fare' && (
                    <div className="row">
                        <div className="col-md-6">
                            <ul className="list-group list-group-flush small">
                                <li className="list-group-item d-flex justify-content-between px-0"><span>Base Fare</span><span>₹{Math.round(itinerary.totalPrice * 0.7)}</span></li>
                                <li className="list-group-item d-flex justify-content-between px-0"><span>Taxes & Fees</span><span>₹{Math.round(itinerary.totalPrice * 0.3)}</span></li>
                                <li className="list-group-item d-flex justify-content-between fw-bold border-top px-0 mt-2"><span>Total</span><span>₹{itinerary.totalPrice.toLocaleString()}</span></li>
                            </ul>
                        </div>
                    </div>
                )}
                {activeTab === 'baggage' && <div className="alert alert-light border small mb-0"><FaSuitcase className="me-2"/> <strong>15KG</strong> Check-in | <strong>7KG</strong> Cabin (Per Segment)</div>}
                {activeTab === 'rules' && <div className="small text-muted">Changes allowed up to 4 hours before departure with a fee of ₹3,000 per sector + fare difference.</div>}
            </div>
        </div>
      )}
    </div>
  );
};

// --- 3. MAIN COMPONENT ---
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {}; // Ensure state is read
  
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [airportMap, setAirportMap] = useState({});

  // Filter States
  const [priceRange, setPriceRange] = useState(50000);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedDepTimes, setSelectedDepTimes] = useState([]);
  const [selectedArrTimes, setSelectedArrTimes] = useState([]); 

  // --- HELPER: Safely extract code ---
  const getCode = (str) => {
    if (!str) return "";
    return str.match(/\(([^)]+)\)/)?.[1] || str; // Extract "HYD" from "Hyderabad (HYD)" or return "Hyderabad"
  };

  // --- HELPER: Generate Title (Hyd -> Delhi -> BBI) ---
  const getRouteTitle = () => {
    if (searchParams.type === 'Multi-City' && searchParams.segments?.length > 0) {
      
      // Loop through segments to build: "City1 -> City2 -> City3"
      return searchParams.segments.map((seg, index) => {
        const fromCode = getCode(seg.from);
        const toCode = getCode(seg.to);

        // Fallback: If map not loaded, use Code. If code missing, use "City"
        const fromCity = airportMap[fromCode]?.city || fromCode;
        const toCity = airportMap[toCode]?.city || toCode;
        
        // For the first segment, show "From -> To". For others, just append "-> To"
        if (index === 0) return `${fromCity} ➝ ${toCity}`;
        return ` ➝ ${toCity}`;
      }).join("");
    }
    
    // Standard OneWay/Return Logic
    const f = getCode(searchParams.from);
    const t = getCode(searchParams.to);
    return `${airportMap[f]?.city || f || "Origin"} ➝ ${airportMap[t]?.city || t || "Dest"}`;
  };

  useEffect(() => {
    setLoading(true);
    const AIRPORTS_API = 'https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json';
    const FLIGHTS_API = "https://gist.githubusercontent.com/ratnakarguru/9c7e9b4ffcdbf653fe8c467b470f2eec/raw";

    Promise.all([
        fetch(AIRPORTS_API).then(res => res.json()),
        fetch(FLIGHTS_API).then(res => res.json())
    ]).then(([airportsData, flightsData]) => {
        
        // 1. Build Map
        const map = {};
        airportsData.forEach(ap => { if(ap.iata_code) map[ap.iata_code] = { city: ap.city, name: ap.name }; });
        setAirportMap(map);

        let constructedItineraries = [];

        // 2. Build Itineraries
        if (searchParams.type === 'Multi-City' && searchParams.segments) {
            for(let i=0; i<5; i++) { // Generate 5 mock options
                const itineraryFlights = [];
                let totalPrice = 0;
                let valid = true;

                searchParams.segments.forEach(seg => {
                    const from = getCode(seg.from);
                    const to = getCode(seg.to);
                    // Filter flights that match this leg
                    const matches = flightsData.filter(f => f.origin === from && f.destination === to);

                    if(matches.length > 0) {
                        const flight = matches[i % matches.length]; 
                        itineraryFlights.push({...flight, date: seg.date});
                        totalPrice += flight.price;
                    } else {
                        valid = false;
                    }
                });

                if(valid && itineraryFlights.length > 0) {
                    constructedItineraries.push({
                        id: i,
                        flights: itineraryFlights,
                        totalPrice: totalPrice,
                        totalDuration: `${itineraryFlights.length * 2 + 1}h 30m`, 
                        airline: itineraryFlights[0].airline 
                    });
                }
            }
        } else {
            // Standard
            const fromCode = getCode(searchParams.from);
            const toCode = getCode(searchParams.to);
            const matches = flightsData.filter(f => (!fromCode || f.origin === fromCode) && (!toCode || f.destination === toCode));

            constructedItineraries = matches.map((f, idx) => ({
                id: idx,
                flights: [f],
                totalPrice: f.price,
                totalDuration: f.duration,
                airline: f.airline
            }));
        }
        setItineraries(constructedItineraries);
        setLoading(false);

    }).catch(err => { console.error(err); setLoading(false); });
  }, [searchParams]);

  const uniqueAirlines = [...new Set(itineraries.map(i => i.airline))];
  const getAirlineLogo = (name) => {
    const logos = {
      IndiGo: "https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg",
      "Air India": "https://www.logo.wine/a/logo/Air_India/Air_India-Logo.wine.svg",
      Vistara: "https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg",
      SpiceJet: "https://1000logos.net/wp-content/uploads/2021/07/SpiceJet-Logo.png",
      "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Akasa_Air_logo.svg/960px-Akasa_Air_logo.svg.png?20211225210806",
      AirAsia: "https://www.logo.wine/a/logo/AirAsia_India/AirAsia_India-Logo.wine.svg",
    };
    return logos[name] || null;
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* --- HEADER --- */}
      <div className="bg-dark text-white py-3 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {/* UPDATED HEADER: Shows Dynamic Multi-City Route */}
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                {getRouteTitle()}
              </h5>
              <small className="text-white-50">{searchParams.type} | Economy</small>
            </div>
            <button className="btn btn-sm btn-outline-light rounded-pill px-4" onClick={() => navigate("/")}>Modify</button>
          </div>
        </div>
      </div>

      <FareCalendar selectedDate={new Date()} />

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
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Scanning flights...</p>
              </div>
            ) : itineraries.length > 0 ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                   <h5 className="fw-bold text-dark mb-0">Available Options</h5>
                   <span className="badge bg-dark">{itineraries.length} Results</span>
                </div>
                {itineraries.map((itinerary) => (
                  <FlightItem 
                    key={itinerary.id} 
                    itinerary={itinerary} 
                    getAirlineLogo={getAirlineLogo} 
                    airportMap={airportMap} 
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-5 bg-white rounded shadow-sm">
                 <FaFilter size={40} className="text-muted mb-3 opacity-25" />
                 <h4>No flights found</h4>
                 <p className="text-muted">Try changing dates or cities.</p>
                 <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>Go Back</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;