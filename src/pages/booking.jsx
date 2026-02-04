import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlane, FaUser, FaArrowRight, 
  FaLuggageCart, FaShieldAlt, FaClock, 
  FaTicketAlt, FaPassport, FaIdCard, FaUtensils 
} from 'react-icons/fa';
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- 1. DATA & CONFIG ---
  const rawData = location.state;
  
  const getSegments = () => {
    if (!rawData) return []; 
    if (rawData.segments) return rawData.segments; 
    if (rawData.flights && Array.isArray(rawData.flights)) return rawData.flights; 
    if (rawData.outbound && rawData.returnFlight) return [rawData.outbound, rawData.returnFlight]; 
    return [rawData]; 
  };

  const segments = getSegments();
  
  // Fixed: Ensure baseFlightPrice is defined for the calculation logic
  const baseFlightPrice = rawData?.totalPrice || segments.reduce((sum, seg) => sum + (seg.price || 0), 0);

  // --- 2. STATE ---
  const [selectedSeats, setSelectedSeats] = useState({}); 
  const [activeLegIndex, setActiveLegIndex] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(900);
  const [loading, setLoading] = useState(true);
  const [isInternational, setIsInternational] = useState(false);

  const [formData, setFormData] = useState({
      title: 'Mr', firstName: '', middleName: '', lastName: '',
      gender: 'Male', dob: '', nationality: 'Indian', type: 'Adult',
      govIdType: 'Aadhaar', govIdNumber: '',
      passportNum: '', passportExpiry: '', passportCountry: 'India',
      email: '', phone: '',
      meal: 'Standard Veg', baggage: '0', freqFlyer: ''
  });

  // --- 3. ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // --- 4. EFFECTS ---
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    const loadingTimer = setTimeout(() => setLoading(false), 800);
    return () => {
      clearInterval(timer);
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculations
  const taxes = Math.round(baseFlightPrice * 0.12);
  const seatTotal = Object.values(selectedSeats).reduce((acc, curr) => acc + curr.price, 0);
  const baggageCost = parseInt(formData.baggage) || 0;
  const grandTotal = baseFlightPrice + taxes + seatTotal + baggageCost;

  // Seat Map Config
  const rows = Array.from({ length: 15 }, (_, i) => i + 1);
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const isBooked = (row, letter, legIndex) => (row * letter.charCodeAt(0) + legIndex) % 7 === 0;
  const isPremium = (row) => row <= 3;
  
  const handleSeatClick = (seatId, price) => {
    setSelectedSeats(prev => ({ ...prev, [activeLegIndex]: { id: seatId, price: price } }));
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if(Object.keys(selectedSeats).length < segments.length) {
       if(!window.confirm(`You haven't selected seats for all flights. Continue?`)) return;
    }
    setLoading(true);
    setTimeout(() => {
        alert(`Booking Confirmed for ${formData.firstName} ${formData.lastName}!`);
        navigate('/');
    }, 1500);
  };

  if (loading && !rawData) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
       <div className="spinner-border text-warning" role="status"></div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        :root {
          --patra-orange: #ff6b00;
          --patra-deep: #cc5500;
          --patra-dark: #2d3436;
          --patra-bg: #f4f7f6;
        }
        body { font-family: 'Poppins', sans-serif; background-color: var(--patra-bg); }
        .text-orange { color: var(--patra-orange) !important; }
        .bg-orange { background-color: var(--patra-orange) !important; }
        .btn-patra {
          background: linear-gradient(135deg, var(--patra-orange), var(--patra-deep));
          color: white; border: none; font-weight: 600;
        }
        .btn-patra:hover { color: white; box-shadow: 0 10px 20px rgba(255, 107, 0, 0.3); }
        .ticket-card {
            background: white;
            position: relative;
            mask-image: radial-gradient(circle at 0 50%, transparent 10px, black 11px), 
                        radial-gradient(circle at 100% 50%, transparent 10px, black 11px);
        }
        .notch-left, .notch-right {
            position: absolute; top: 50%; width: 20px; height: 20px;
            background-color: var(--patra-bg); border-radius: 50%; transform: translateY(-50%);
        }
        .notch-left { left: -10px; }
        .notch-right { right: -10px; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffd0a8; border-radius: 10px; }
      `}</style>

      {/* --- NAVBAR --- */}
      <motion.nav initial={{ y: -50 }} animate={{ y: 0 }} className="navbar navbar-expand-lg bg-white shadow-sm sticky-top px-4 py-3">
        <div className="container-fluid max-w-7xl">
          <div className="d-flex align-items-center cursor-pointer" onClick={() => navigate(-1)}>
            <div className="bg-orange text-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                <FaPlane style={{ transform: 'rotate(-45deg)'}} />
            </div>
            <h4 className="fw-bold text-dark m-0">PATRA <span className="text-orange">TRAVELS</span></h4>
          </div>
          <div className="d-flex align-items-center bg-light px-3 py-2 rounded-pill">
            <FaClock className="text-orange me-2"/>
            <span className="small fw-bold font-monospace">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </motion.nav>

      <motion.div className="container py-5" variants={containerVariants} initial="hidden" animate="visible">
        <div className="row g-4">
          
          <div className="col-lg-8">
            {/* ITINERARY */}
            <motion.div variants={itemVariants} className="mb-4">
                <h5 className="fw-bold mb-3"><FaTicketAlt className="text-orange me-2"/> Your Itinerary</h5>
                {segments.map((segment, index) => (
                  <div key={index} className="ticket-card shadow-sm rounded-4 p-4 mb-3 border border-light">
                    <div className="notch-left"></div><div className="notch-right"></div>
                    <div className="row align-items-center">
                        <div className="col-3 text-center border-end border-dashed">
                             <h3 className="fw-bold mb-0">{segment.origin || "DEL"}</h3>
                             <small className="text-muted">{segment.departureTime || "10:00 AM"}</small>
                        </div>
                        <div className="col-6 text-center">
                             <div className="text-orange small fw-bold mb-1">{segment.duration || "2h 45m"}</div>
                             <div className="d-flex align-items-center text-muted">
                                 <div className="border-top flex-grow-1"></div>
                                 <FaPlane className="mx-3 text-orange" style={{transform: 'rotate(90deg)'}} />
                                 <div className="border-top flex-grow-1"></div>
                             </div>
                             <small className="d-block mt-2 fw-bold">{segment.airline}</small>
                        </div>
                        <div className="col-3 text-center border-start border-dashed">
                             <h3 className="fw-bold mb-0">{segment.destination || "BOM"}</h3>
                             <small className="text-muted">{segment.arrivalTime || "12:45 PM"}</small>
                        </div>
                    </div>
                  </div>
                ))}
            </motion.div>

            {/* SEAT MAP */}
            <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-bold mb-0"><MdOutlineAirlineSeatReclineExtra className="text-orange me-2"/>Select Seats</h5>
                    </div>
                    {segments.length > 1 && (
                        <div className="btn-group bg-light rounded-pill p-1">
                            {segments.map((s, i) => (
                                <button key={i} onClick={() => setActiveLegIndex(i)} className={`btn btn-sm rounded-pill px-3 ${activeLegIndex === i ? 'bg-orange text-white' : 'text-muted border-0'}`}>
                                    {s.origin} <FaArrowRight size={10}/> {s.destination}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="card-body bg-light p-4 overflow-auto custom-scrollbar">
                    <div className="d-flex" style={{ gap: '12px' }}>
                        {rows.map(row => (
                            <div key={row} className="d-flex flex-column align-items-center flex-shrink-0">
                                <small className="mb-2 text-muted fw-bold">{row}</small>
                                <div className="d-flex flex-column gap-1 bg-white p-2 rounded-3 shadow-sm border">
                                    {seatLetters.map((letter, idx) => {
                                        const seatId = `${row}${letter}`;
                                        const booked = isBooked(row, letter, activeLegIndex);
                                        const isSel = selectedSeats[activeLegIndex]?.id === seatId;
                                        const price = isPremium(row) ? 600 : 350;
                                        return (
                                            <React.Fragment key={seatId}>
                                                <button
                                                    disabled={booked}
                                                    onClick={() => handleSeatClick(seatId, price)}
                                                    className={`btn btn-sm p-0 d-flex align-items-center justify-content-center ${isSel ? 'bg-orange text-white' : (booked ? 'bg-secondary bg-opacity-25' : 'btn-outline-secondary')}`}
                                                    style={{ width: '32px', height: '32px', borderRadius: '6px', fontSize: '0.7rem' }}
                                                >
                                                    {letter}
                                                </button>
                                                {idx === 2 && <div style={{height: 10}}></div>}
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* PASSENGER FORM */}
            <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0"><FaUser className="text-orange me-2"/>Passenger Details</h5>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="flightType" checked={isInternational} onChange={() => setIsInternational(!isInternational)} />
                        <label className="form-check-label small fw-bold" htmlFor="flightType">{isInternational ? 'International' : 'Domestic'}</label>
                    </div>
                </div>
                <div className="card-body p-4">
                    <form id="patraForm" onSubmit={handleSubmit}>
                        <h6 className="text-muted text-uppercase small fw-bold mb-3">Personal Information</h6>
                        <div className="row g-3 mb-4">
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <select className="form-select bg-light border-0" name="title" value={formData.title} onChange={handleInputChange}>
                                        <option>Mr</option><option>Mrs</option><option>Ms</option>
                                    </select>
                                    <label>Title</label>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="form-floating">
                                    <input type="text" className="form-control bg-light border-0" name="firstName" required onChange={handleInputChange} placeholder="First" />
                                    <label>First Name</label>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="form-floating">
                                    <input type="text" className="form-control bg-light border-0" name="lastName" required onChange={handleInputChange} placeholder="Last" />
                                    <label>Last Name</label>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={isInternational ? 'int' : 'dom'} initial={{opacity: 0}} animate={{opacity: 1}} className="bg-light p-3 rounded-3 mb-4 border">
                                {isInternational ? (
                                    <div className="row g-3">
                                        <div className="col-12"><h6 className="text-orange small fw-bold"><FaPassport className="me-2"/>Passport Required</h6></div>
                                        <div className="col-md-6"><div className="form-floating"><input type="text" className="form-control" name="passportNum" placeholder="P" onChange={handleInputChange}/><label>Passport Number</label></div></div>
                                        <div className="col-md-6"><div className="form-floating"><input type="date" className="form-control" name="passportExpiry" onChange={handleInputChange}/><label>Expiry Date</label></div></div>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        <div className="col-12"><h6 className="text-success small fw-bold"><FaIdCard className="me-2"/>Government ID</h6></div>
                                        <div className="col-md-4"><div className="form-floating"><select className="form-select" name="govIdType" onChange={handleInputChange}><option>Aadhaar</option><option>PAN</option></select><label>ID Type</label></div></div>
                                        <div className="col-md-8"><div className="form-floating"><input type="text" className="form-control" name="govIdNumber" placeholder="N" onChange={handleInputChange}/><label>ID Number</label></div></div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="row g-3">
                            <div className="col-md-6"><div className="form-floating"><input type="email" className="form-control bg-light border-0" name="email" required onChange={handleInputChange} placeholder="E"/><label>Email</label></div></div>
                            <div className="col-md-6"><div className="form-floating"><input type="tel" className="form-control bg-light border-0" name="phone" required onChange={handleInputChange} placeholder="P"/><label>Phone</label></div></div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <select className="form-select bg-light border-0" name="meal" onChange={handleInputChange}>
                                        <option>Standard Veg</option><option>Standard Non-Veg</option>
                                    </select>
                                    <label><FaUtensils className="me-2"/>Meal</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <select className="form-select bg-light border-0" name="baggage" onChange={handleInputChange}>
                                        <option value="0">Standard (15kg)</option>
                                        <option value="1500">+ 10kg (₹1,500)</option>
                                    </select>
                                    <label><FaLuggageCart className="me-2"/>Baggage</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
          </div>

          {/* BILLING */}
          <div className="col-lg-4">
            <motion.div variants={itemVariants} className="card border-0 shadow-lg rounded-4 overflow-hidden sticky-top" style={{ top: '100px', backgroundColor: '#2d3436' }}>
                <div className="card-body p-4 text-white">
                    <h4 className="fw-bold mb-4 border-bottom border-secondary pb-3">Fare Summary</h4>
                    <div className="d-flex justify-content-between mb-2"><span className="text-white-50">Base Fare</span><span>₹ {baseFlightPrice.toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between mb-2"><span className="text-white-50">Taxes</span><span>₹ {taxes.toLocaleString()}</span></div>
                    
                    {Object.keys(selectedSeats).length > 0 && (
                        <div className="mt-3">
                            <small className="text-orange d-block mb-2">Selected Seats:</small>
                            {segments.map((seg, idx) => selectedSeats[idx] && (
                                <div key={idx} className="d-flex justify-content-between small mb-1 bg-white bg-opacity-10 p-2 rounded">
                                    <span>{seg.origin} Leg (Seat {selectedSeats[idx].id})</span>
                                    <span>₹ {selectedSeats[idx].price}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {baggageCost > 0 && <div className="d-flex justify-content-between text-warning small mt-2"><span>Extra Baggage</span><span>+ ₹ {baggageCost}</span></div>}

                    <div className="pt-3 mt-3 border-top border-secondary d-flex justify-content-between align-items-end">
                        <span className="h6 mb-0">Total Due</span>
                        <span className="h2 fw-bold mb-0 text-orange">₹ {grandTotal.toLocaleString()}</span>
                    </div>

                    <button type="submit" form="patraForm" className="btn btn-patra w-100 py-3 mt-4 rounded-pill text-uppercase">
                        Confirm Booking
                    </button>
                    <div className="text-center mt-3 text-white-50 small"><FaShieldAlt className="me-1"/> Secure SSL Payment</div>
                </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default BookingDetails;