import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  FaPlane, FaUser, FaCheckCircle, FaTimesCircle, 
  FaChair, FaArrowRight, FaLuggageCart, FaInfoCircle
} from 'react-icons/fa';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- 1. DATA RETRIEVAL & SAFETY ---
  const rawData = location.state;

  // Normalize Data Logic
  const getSegments = () => {
    if (!rawData) return []; 
    if (rawData.segments) return rawData.segments; 
    if (rawData.flights && Array.isArray(rawData.flights)) return rawData.flights; 
    if (rawData.outbound && rawData.returnFlight) return [rawData.outbound, rawData.returnFlight]; 
    return [rawData]; 
  };

  const segments = getSegments();
  
  const calculateBasePrice = () => {
    if (!rawData) return 0;
    return rawData.totalPrice || segments.reduce((sum, seg) => sum + (seg.price || 0), 0);
  };
  
  const basePrice = calculateBasePrice();

  // --- 2. STATE ---
  const [selectedSeats, setSelectedSeats] = useState({}); 
  const [activeLegIndex, setActiveLegIndex] = useState(0); 
  const [passenger, setPassenger] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: 'Male'
  });

  // Safety Redirect
  useEffect(() => {
    if (!rawData) {
       // navigate('/'); // Uncomment in production
    }
  }, [rawData, navigate]);

  // --- 3. SEAT MAP CONFIG (HORIZONTAL) ---
  const rows = Array.from({ length: 15 }, (_, i) => i + 1); // 15 Rows
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F']; // Vertical stack in horizontal view
  
  // Mock Availability
  const isBooked = (row, letter, legIndex) => (row * letter.charCodeAt(0) + legIndex) % 5 === 0;

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prev => ({ ...prev, [activeLegIndex]: seatId }));
  };

  const handleInputChange = (e) => {
    setPassenger({ ...passenger, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const seatsPicked = Object.keys(selectedSeats).length;
    if(seatsPicked < segments.length) {
       const confirm = window.confirm(`You haven't selected seats for all flights. Continue anyway?`);
       if(!confirm) return;
    }
    alert(`Booking Confirmed for ${passenger.firstName}!\nTotal Paid: ₹${grandTotal.toLocaleString()}`);
    navigate('/');
  };

  // --- 4. CALCULATIONS ---
  const taxes = Math.round(basePrice * 0.12);
  const seatPricePerSeat = 350;
  const totalSeatCost = Object.keys(selectedSeats).length * seatPricePerSeat;
  const grandTotal = basePrice + taxes + totalSeatCost;

  if (!rawData && segments.length === 0) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Header Accent */}
      <div className="bg-primary pb-5 pt-4">
        <div className="container">
          <h2 className="text-white fw-bold">Complete Your Booking</h2>
          <p className="text-white-50">Secure your seats and fly!</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px' }}>
        <div className="row g-4">
          
          {/* --- LEFT COLUMN --- */}
          <div className="col-lg-8">
            
            {/* A. FLIGHT SUMMARY CARDS */}
            <div className="d-flex flex-column gap-3 mb-4">
              {segments.map((segment, index) => (
                <div key={index} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-header bg-white border-bottom-0 pt-3 px-4 d-flex justify-content-between align-items-center">
                     <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                        {segments.length > 1 ? (index === 0 ? "OUTBOUND" : "RETURN / LEG 2") : "FLIGHT DETAILS"}
                     </span>
                     <span className="small text-muted fw-bold"><FaLuggageCart className="me-1"/> 15kg / 7kg</span>
                  </div>
                  <div className="card-body px-4 pb-4">
                    <div className="d-flex align-items-center justify-content-between">
                        {/* Origin */}
                        <div className="text-start">
                            <div className="display-6 fw-bold text-dark">{segment.departureTime || "00:00"}</div>
                            <div className="text-muted fw-bold">{segment.origin || "ORG"}</div>
                        </div>

                        {/* Graphic */}
                        <div className="flex-grow-1 mx-4 text-center position-relative">
                            <small className="text-muted mb-1 d-block">{segment.duration || "2h 10m"}</small>
                            <div className="d-flex align-items-center text-primary opacity-50">
                                <div className="border-top border-2 flex-grow-1"></div>
                                <FaPlane className="mx-2" style={{ transform: 'rotate(90deg)' }} />
                                <div className="border-top border-2 flex-grow-1"></div>
                            </div>
                            <small className="text-primary fw-bold mt-1 d-block">{segment.airline}</small>
                        </div>

                        {/* Destination */}
                        <div className="text-end">
                            <div className="display-6 fw-bold text-dark">{segment.arrivalTime || "00:00"}</div>
                            <div className="text-muted fw-bold">{segment.destination || "DES"}</div>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* B. HORIZONTAL SEAT SELECTION */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><FaChair className="me-2 text-primary"/>Select Seats</h5>
                {segments.length > 1 && (
                    <div className="btn-group">
                        {segments.map((s, i) => (
                            <button 
                                key={i}
                                className={`btn btn-sm rounded-pill px-3 ms-1 ${activeLegIndex === i ? 'btn-primary' : 'btn-light text-muted'}`}
                                onClick={() => setActiveLegIndex(i)}
                            >
                                {s.origin}-{s.destination}
                            </button>
                        ))}
                    </div>
                )}
              </div>

              <div className="card-body px-4">
                {/* Legend */}
                <div className="d-flex gap-4 mb-4 small">
                    <div className="d-flex align-items-center gap-2"><div className="rounded bg-white border" style={{width:18, height:18}}></div> Free</div>
                    <div className="d-flex align-items-center gap-2"><div className="rounded bg-secondary opacity-25" style={{width:18, height:18}}></div> Booked</div>
                    <div className="d-flex align-items-center gap-2"><div className="rounded bg-success" style={{width:18, height:18}}></div> Selected</div>
                </div>

                {/* THE HORIZONTAL SCROLL CONTAINER */}
                <div className="position-relative bg-light rounded-4 p-3 border">
                    <div className="text-muted small fw-bold mb-2 sticky-start"><FaArrowRight className="me-1"/> FRONT OF PLANE</div>
                    
                    <div className="d-flex overflow-auto pb-3 custom-scrollbar" style={{ gap: '12px' }}>
                        {/* Map Rows Horizontally */}
                        {rows.map(rowNum => (
                            <div key={rowNum} className="d-flex flex-column align-items-center">
                                {/* Row Number Header */}
                                <div className="small text-muted mb-2 fw-bold">{rowNum}</div>
                                
                                <div className="d-flex flex-column gap-1 p-2 bg-white rounded-3 border">
                                    {seatLetters.map((letter, idx) => {
                                        const seatId = `${rowNum}${letter}`;
                                        const booked = isBooked(rowNum, letter, activeLegIndex);
                                        const isSelected = selectedSeats[activeLegIndex] === seatId;
                                        
                                        // Add Aisle Gap after 'C' (index 2)
                                        return (
                                            <React.Fragment key={seatId}>
                                                <button
                                                    disabled={booked}
                                                    onClick={() => handleSeatClick(seatId)}
                                                    className={`btn btn-sm p-0 d-flex align-items-center justify-content-center transition-all ${
                                                        isSelected ? 'btn-success text-white shadow' : 
                                                        booked ? 'bg-secondary bg-opacity-25 border-0 text-muted' : 
                                                        'btn-outline-secondary'
                                                    }`}
                                                    style={{ 
                                                        width: '32px', height: '32px', 
                                                        borderRadius: '6px',
                                                        cursor: booked ? 'not-allowed' : 'pointer',
                                                        fontSize: '0.65rem'
                                                    }}
                                                    title={`Seat ${seatId}`}
                                                >
                                                    {booked ? <FaTimesCircle size={10}/> : letter}
                                                </button>
                                                {/* The Aisle Spacer */}
                                                {idx === 2 && <div style={{ height: '15px' }}></div>}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-2 small text-muted"><FaInfoCircle className="me-1"/>Scroll right to see more rows</div>
              </div>
            </div>

            {/* C. PASSENGER DETAILS FORM */}
            <form id="bookingForm" onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                <h5 className="mb-0 fw-bold"><FaUser className="me-2 text-primary"/>Passenger Details</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">First Name</label>
                    <input type="text" className="form-control form-control-lg bg-light border-0" name="firstName" required onChange={handleInputChange} placeholder="e.g. John" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Last Name</label>
                    <input type="text" className="form-control form-control-lg bg-light border-0" name="lastName" required onChange={handleInputChange} placeholder="e.g. Doe" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Email Address</label>
                    <input type="email" className="form-control form-control-lg bg-light border-0" name="email" required onChange={handleInputChange} placeholder="john@example.com" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Mobile Number</label>
                    <input type="tel" className="form-control form-control-lg bg-light border-0" name="phone" required onChange={handleInputChange} placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>
            </form>

          </div>

          {/* --- RIGHT COLUMN: STICKY BILLING --- */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: '20px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Fare Breakdown</h5>
                
                <div className="d-flex justify-content-between mb-2">
                   <span className="text-muted">Base Fare</span>
                   <span className="fw-bold">₹ {basePrice.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                   <span className="text-muted">Taxes & Surcharges</span>
                   <span className="fw-bold">₹ {taxes.toLocaleString()}</span>
                </div>

                <div className="bg-light p-3 rounded-3 mb-3">
                   <div className="d-flex justify-content-between mb-2">
                      <span className="small fw-bold text-dark">Seat Fees</span>
                      <span className="fw-bold text-primary">₹ {totalSeatCost}</span>
                   </div>
                   {segments.map((seg, idx) => (
                       selectedSeats[idx] ? (
                           <div key={idx} className="d-flex justify-content-between small text-muted">
                               <span>{seg.origin}-{seg.destination} <span className="text-dark fw-bold">({selectedSeats[idx]})</span></span>
                               <span>₹ 350</span>
                           </div>
                       ) : (
                           <div key={idx} className="small text-danger fst-italic text-end" style={{fontSize: '0.7rem'}}>
                              * Select seat for {seg.origin}-{seg.destination}
                           </div>
                       )
                   ))}
                </div>

                <div className="border-top pt-3 d-flex justify-content-between align-items-center mb-4">
                   <span className="h5 fw-bold mb-0">Grand Total</span>
                   <span className="h3 fw-bold text-primary mb-0">₹ {grandTotal.toLocaleString()}</span>
                </div>

                <button type="submit" form="bookingForm" className="btn btn-warning w-100 py-3 rounded-pill fw-bold shadow-sm text-white text-uppercase letter-spacing-1">
                   Confirm & Pay
                </button>
                <div className="text-center mt-3">
                    <small className="text-muted"><FaCheckCircle className="text-success me-1"/>Secure SSL Payment</small>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetails;