import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { 
  FaHotel, FaUser, FaCheckCircle, FaArrowRight, 
  FaShieldAlt, FaClock, FaRupeeSign, FaTicketAlt, 
  FaIdCard, FaUtensils, FaBed, FaCalendarAlt 
} from 'react-icons/fa';

const HotelBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- 1. DATA FROM HOTEL DETAILS PAGE ---
  const bookingData = location.state || {};
  const { hotel, room, dates, tax, totalPrice } = bookingData;

  // --- 2. STATE ---
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins timer
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
      title: 'Mr', firstName: '', lastName: '',
      email: '', phone: '', specialRequest: '',
      paymentMethod: 'Credit Card'
  });

  // --- 3. ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  useEffect(() => {
    // Redirect if no data
    if (!hotel || !room) {
        // navigate('/'); // Uncomment to enforce redirect
    }
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    setTimeout(() => setLoading(false), 800);
    return () => clearInterval(timer);
  }, [hotel, room, navigate]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  
  const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        alert(`Booking Confirmed for ${formData.firstName} at ${hotel?.name}!`);
        navigate('/');
    }, 1500);
  };

  if (loading) return (
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
            mask-image: radial-gradient(circle at 0 100%, transparent 10px, black 11px), 
                        radial-gradient(circle at 100% 100%, transparent 10px, black 11px);
        }
      `}</style>

      {/* --- NAVBAR --- */}
      <motion.nav initial={{ y: -50 }} animate={{ y: 0 }} className="navbar navbar-expand-lg bg-white shadow-sm sticky-top px-4 py-3">
        <div className="container-fluid max-w-7xl">
          <div className="d-flex align-items-center cursor-pointer" onClick={() => navigate(-1)}>
            <div className="bg-orange text-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                <FaHotel />
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
            {/* HOTEL & ROOM SUMMARY */}
            <motion.div variants={itemVariants} className="mb-4">
                <h5 className="fw-bold mb-3"><FaTicketAlt className="text-orange me-2"/> Booking Details</h5>
                <div className="ticket-card shadow-sm rounded-4 p-4 mb-3 border border-light d-flex flex-column flex-md-row gap-4">
                    <img src={hotel?.image} className="rounded-3 object-fit-cover" style={{width: '150px', height: '120px'}} alt="Hotel"/>
                    <div className="flex-grow-1">
                        <h4 className="fw-bold mb-1">{hotel?.name || "Hotel Name"}</h4>
                        <p className="text-muted small mb-3"><FaCheckCircle className="text-success me-1"/> {hotel?.area}, {hotel?.city}</p>
                        
                        <div className="d-flex gap-4 bg-light p-3 rounded-3">
                            <div>
                                <small className="text-muted d-block text-uppercase" style={{fontSize: '0.7rem'}}>Check-in</small>
                                <span className="fw-bold">{dates?.checkIn || "02 May 2026"}</span>
                            </div>
                            <div className="border-start"></div>
                            <div>
                                <small className="text-muted d-block text-uppercase" style={{fontSize: '0.7rem'}}>Check-out</small>
                                <span className="fw-bold">{dates?.checkOut || "06 May 2026"}</span>
                            </div>
                            <div className="border-start"></div>
                             <div>
                                <small className="text-muted d-block text-uppercase" style={{fontSize: '0.7rem'}}>Guests</small>
                                <span className="fw-bold">2 Adults</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4">
                    <h6 className="fw-bold text-orange mb-3"><FaBed className="me-2"/> Room Selected</h6>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold mb-1">{room?.name || "Standard Room"}</h5>
                            <span className="text-muted small">{room?.bed} • {room?.size}</span>
                        </div>
                        <div className="text-end">
                            <span className="badge bg-success bg-opacity-10 text-success border border-success">Free Cancellation</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* GUEST FORM */}
            <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white p-4 border-bottom">
                    <h5 className="fw-bold mb-0"><FaUser className="text-orange me-2"/>Guest Details</h5>
                </div>
                <div className="card-body p-4">
                    <form id="hotelForm" onSubmit={handleSubmit}>
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

                        <div className="row g-3 mb-4">
                            <div className="col-md-6"><div className="form-floating"><input type="email" className="form-control bg-light border-0" name="email" required onChange={handleInputChange} placeholder="E"/><label>Email Address</label></div></div>
                            <div className="col-md-6"><div className="form-floating"><input type="tel" className="form-control bg-light border-0" name="phone" required onChange={handleInputChange} placeholder="P"/><label>Phone Number</label></div></div>
                        </div>

                        <div className="form-floating mb-3">
                            <textarea className="form-control bg-light border-0" style={{height: '100px'}} name="specialRequest" placeholder="Req" onChange={handleInputChange}></textarea>
                            <label>Special Requests (Optional)</label>
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
                    <div className="d-flex justify-content-between mb-2"><span className="text-white-50">Room Price (1 Night)</span><span>₹ {(room?.price || 0).toLocaleString()}</span></div>
                    <div className="d-flex justify-content-between mb-2"><span className="text-white-50">Taxes & Fees</span><span>₹ {(tax || 0).toLocaleString()}</span></div>
                    
                    <div className="pt-3 mt-3 border-top border-secondary d-flex justify-content-between align-items-end">
                        <span className="h6 mb-0">Total Due</span>
                        <span className="h2 fw-bold mb-0 text-orange">₹ {(totalPrice || 0).toLocaleString()}</span>
                    </div>

                    <button type="submit" form="hotelForm" className="btn btn-patra w-100 py-3 mt-4 rounded-pill text-uppercase">
                        Confirm & Pay
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

export default HotelBooking;