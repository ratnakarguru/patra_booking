import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlane, FaUser, FaEnvelope, FaRupeeSign, FaArrowRight, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdEventSeat } from 'react-icons/md';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Flight Data
  const flight = location.state || {
    airline: "IndiGo",
    flightCode: "6E-2093",
    origin: "BBI",
    destination: "DEL",
    departureTime: "09:15",
    arrivalTime: "11:35",
    duration: "2h 20m",
    price: 5400
  };

  // 2. Form State
  const [passenger, setPassenger] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male'
  });

  // 3. SEAT SELECTION STATE
  const [selectedSeat, setSelectedSeat] = useState(null);

  // --- SEAT MAP LOGIC ---
  // Generate 12 rows of mock seat data
  const rows = Array.from({ length: 12 }, (_, i) => i + 1);
  const colsLeft = ['A', 'B', 'C'];
  const colsRight = ['D', 'E', 'F'];
  
  // Mock "Already Booked" seats (random logic for demo)
  const isBooked = (row, col) => (row * col.charCodeAt(0)) % 5 === 0;

  const handleSeatClick = (seatId) => {
    setSelectedSeat(seatId);
  };

  const handleInputChange = (e) => {
    setPassenger({ ...passenger, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedSeat) {
      alert("Please select a seat before proceeding!");
      return;
    }
    alert(`Booking Confirmed for ${passenger.firstName}!\nSeat: ${selectedSeat}\nTotal: ₹${totalAmount}`);
    navigate('/');
  };

  // Pricing
  const taxes = Math.round(flight.price * 0.12);
  const seatCost = selectedSeat ? 350 : 0; // Flat fee for seat selection
  const totalAmount = flight.price + taxes + seatCost;

  return (
    <div className="container py-5 bg-light">
      <div className="row">
        
        {/* --- LEFT COLUMN --- */}
        <div className="col-lg-8">
          
          {/* 1. FLIGHT SUMMARY */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold text-dark">1. Flight Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="d-flex align-items-center mb-3 mb-md-0">
                  <div className="bg-light rounded p-2 me-3">
                     <FaPlane className="text-primary" size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{flight.airline}</h6>
                    <small className="text-muted badge bg-secondary text-white">{flight.flightCode}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-4 text-center">
                  <div>
                    <h4 className="fw-bold mb-0">{flight.departureTime}</h4>
                    <small className="text-muted fw-bold">{flight.origin}</small>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <small className="text-muted mb-1">{flight.duration}</small>
                    <div className="d-flex align-items-center w-100">
                        <div style={{height: '1px', background: '#ccc', width: '30px'}}></div>
                        <FaPlane size={12} className="mx-1 text-muted" />
                        <div style={{height: '1px', background: '#ccc', width: '30px'}}></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{flight.arrivalTime}</h4>
                    <small className="text-muted fw-bold">{flight.destination}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SEAT SELECTION MAP (NEW) */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">2. Select Seat</h5>
              {selectedSeat && <span className="badge bg-success">Selected: {selectedSeat}</span>}
            </div>
            <div className="card-body bg-light">
              
              {/* Legend */}
              <div className="d-flex justify-content-center gap-4 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div style={{width: '20px', height: '20px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px'}}></div>
                  <small>Free</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div style={{width: '20px', height: '20px', backgroundColor: '#e9ecef', border: '1px solid #ccc', borderRadius: '4px', cursor: 'not-allowed'}}></div>
                  <small>Booked</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div style={{width: '20px', height: '20px', backgroundColor: '#198754', borderRadius: '4px'}}></div>
                  <small>Selected</small>
                </div>
              </div>

              {/* The Plane Layout */}
              <div className="mx-auto bg-white p-4 rounded shadow-sm" style={{maxWidth: '400px', border: '1px solid #eee'}}>
                
                {/* Cockpit Indicator */}
                <div className="text-center text-muted mb-4 small text-uppercase fw-bold">Front of Plane</div>

                {rows.map((row) => (
                  <div key={row} className="d-flex justify-content-between align-items-center mb-2">
                    
                    {/* Left Column (A, B, C) */}
                    <div className="d-flex gap-2">
                      {colsLeft.map((col) => {
                        const seatId = `${row}${col}`;
                        const booked = isBooked(row, col);
                        const isSelected = selectedSeat === seatId;
                        
                        return (
                          <button
                            key={seatId}
                            disabled={booked}
                            onClick={() => handleSeatClick(seatId)}
                            className={`btn btn-sm d-flex align-items-center justify-content-center p-0 ${
                              isSelected ? 'btn-success text-white' : booked ? 'btn-light text-muted' : 'btn-outline-secondary'
                            }`}
                            style={{
                              width: '35px', 
                              height: '35px', 
                              cursor: booked ? 'not-allowed' : 'pointer',
                              backgroundColor: booked ? '#e9ecef' : ''
                            }}
                            title={booked ? 'Already Booked' : `Seat ${seatId}`}
                          >
                            {booked ? <FaTimesCircle size={12}/> : <small style={{fontSize: '10px'}}>{col}</small>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Aisle (Row Number) */}
                    <div className="text-muted small fw-bold" style={{width: '20px', textAlign: 'center'}}>{row}</div>

                    {/* Right Column (D, E, F) */}
                    <div className="d-flex gap-2">
                      {colsRight.map((col) => {
                        const seatId = `${row}${col}`;
                        const booked = isBooked(row, col);
                        const isSelected = selectedSeat === seatId;

                        return (
                          <button
                            key={seatId}
                            disabled={booked}
                            onClick={() => handleSeatClick(seatId)}
                            className={`btn btn-sm d-flex align-items-center justify-content-center p-0 ${
                              isSelected ? 'btn-success text-white' : booked ? 'btn-light text-muted' : 'btn-outline-secondary'
                            }`}
                            style={{
                              width: '35px', 
                              height: '35px', 
                              cursor: booked ? 'not-allowed' : 'pointer',
                              backgroundColor: booked ? '#e9ecef' : ''
                            }}
                            title={booked ? 'Already Booked' : `Seat ${seatId}`}
                          >
                            {booked ? <FaTimesCircle size={12}/> : <small style={{fontSize: '10px'}}>{col}</small>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. PASSENGER FORM */}
          <form id="bookingForm" onSubmit={handleSubmit}>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold text-dark">3. Passenger Details</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">First Name</label>
                    <input type="text" className="form-control" name="firstName" required onChange={handleInputChange}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Last Name</label>
                    <input type="text" className="form-control" name="lastName" required onChange={handleInputChange}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Email</label>
                    <input type="email" className="form-control" name="email" required onChange={handleInputChange}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Mobile</label>
                    <input type="tel" className="form-control" name="phone" required onChange={handleInputChange}/>
                  </div>
                </div>
              </div>
            </div>
          </form>

        </div>

        {/* --- RIGHT COLUMN: SUMMARY --- */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 position-sticky" style={{top: '20px'}}>
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 fw-bold">Fare Breakdown</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Base Fare</span>
                <span className="fw-bold">₹ {flight.price.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Taxes (12%)</span>
                <span className="fw-bold">₹ {taxes.toLocaleString()}</span>
              </div>
              
              {/* Dynamic Seat Cost */}
              <div className="d-flex justify-content-between mb-2 text-primary">
                <span className="text-muted">Seat Selection</span>
                <span className="fw-bold">
                  {selectedSeat ? `₹ ${seatCost}` : 'Pending'}
                </span>
              </div>
              {selectedSeat && <small className="d-block text-end text-success mb-2" style={{fontSize: '11px'}}>Seat {selectedSeat} Applied</small>}

              <hr className="my-3" />
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="h5 fw-bold text-dark mb-0">Total</span>
                <span className="h3 fw-bold text-danger mb-0">₹ {totalAmount.toLocaleString()}</span>
              </div>

              <div className="d-grid">
                <button onClick={handleSubmit} className="btn btn-warning text-white fw-bold py-3">
                  CONFIRM & PAY
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDetails;