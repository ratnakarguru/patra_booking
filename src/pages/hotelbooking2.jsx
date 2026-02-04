import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Retrieve Data
  const baseHotelData = location.state?.hotel;

  // 2. State
  const [hotelData, setHotelData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!baseHotelData) {
      navigate("/");
      return;
    }

    // Enhanced Mock Data
    const enhancedData = {
      ...baseHotelData,
      rooms: [
        { id: 1, name: "Standard Room", size: "25 m²", bed: "1 Queen Bed", price: baseHotelData.price, features: ["Free Wi-Fi", "City View"] },
        { id: 2, name: "Deluxe Ocean View", size: "35 m²", bed: "1 King Bed", price: Math.floor(baseHotelData.price * 1.4), features: ["Ocean View", "Balcony", "Bathtub"] },
        { id: 3, name: "Executive Suite", size: "50 m²", bed: "1 King Bed + Sofa", price: Math.floor(baseHotelData.price * 2.2), features: ["Lounge Access", "Kitchenette", "Jacuzzi"] },
      ],
      reviews: [
        { user: "John D.", rating: 9.0, date: "Oct 2023", comment: "Amazing stay! The location is perfect and staff were very helpful." },
        { user: "Sarah M.", rating: 8.5, date: "Sep 2023", comment: "Great value for money. Breakfast could be better but room was clean." },
      ],
      policies: {
        checkIn: "14:00",
        checkOut: "11:00",
        cancellation: "Free cancellation until 24 hours before check-in.",
        pets: "Pets are not allowed.",
      },
      detailedFacilities: [
        { icon: "fa-wifi", name: "Free Wi-Fi" },
        { icon: "fa-swimming-pool", name: "Swimming Pool" },
        { icon: "fa-dumbbell", name: "Fitness Center" },
        { icon: "fa-utensils", name: "Restaurant" },
        { icon: "fa-spa", name: "Spa & Wellness" },
        { icon: "fa-parking", name: "Free Parking" },
        { icon: "fa-concierge-bell", name: "24h Room Service" },
        { icon: "fa-glass-martini-alt", name: "Bar/Lounge" },
      ]
    };

    setHotelData(enhancedData);
    setSelectedRoom(enhancedData.rooms[0]); 
  }, [baseHotelData, navigate]);

  if (!hotelData) return null;

  // --- HANDLERS ---
  const handleScroll = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const calculateTax = (price) => Math.floor(price * 0.18);
  const taxAmount = selectedRoom ? calculateTax(selectedRoom.price) : 0;
  const totalAmount = selectedRoom ? selectedRoom.price + taxAmount : 0;

  // --- NEW: HANDLE BOOKING NAVIGATION ---
  const handleBooking = () => {
    if (!selectedRoom) return;

    // Helper to get formatted dates (Tomorrow & Day After)
    // In a real app, you would use a DatePicker component
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const formatDate = (date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const bookingPayload = {
      hotel: {
        name: hotelData.name,
        image: hotelData.image,
        area: hotelData.area,
        city: hotelData.city
      },
      room: selectedRoom,
      dates: {
        checkIn: formatDate(tomorrow),
        checkOut: formatDate(dayAfter)
      },
      tax: taxAmount,
      totalPrice: totalAmount
    };

    // Navigate to the booking page with the data
    navigate("/Hotel_Booking2", { state: bookingPayload });
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* --- HERO HEADER --- */}
      <div className="bg-white shadow-sm pb-4 pt-3">
        <div className="container">
            {/* Breadcrumb / Back */}
            <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-muted p-0 mb-3 small">
                <i className="fas fa-arrow-left me-1"></i> Back to Search
            </button>

            {/* Title & Rating */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                <div>
                    <h2 className="fw-bold text-dark mb-1">{hotelData.name}</h2>
                    <div className="d-flex align-items-center text-muted small">
                        <span className="badge bg-warning text-dark me-2">{hotelData.type}</span>
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star text-warning ${i < Math.floor(hotelData.rating) ? '' : 'opacity-25'}`}></i>
                        ))}
                        <span className="mx-2">•</span>
                        <i className="fas fa-map-marker-alt text-primary me-1"></i> {hotelData.area}, {hotelData.city}
                    </div>
                </div>
                <div className="text-end mt-2 mt-md-0">
                    <h3 className="fw-bold text-danger mb-0">₹ {hotelData.price.toLocaleString()}</h3>
                    <p className="small text-muted">per night</p>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="row g-2 mb-4" style={{height: '350px'}}>
                <div className="col-md-8 h-100">
                    <img src={hotelData.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80"} className="w-100 h-100 object-fit-cover rounded" alt="Main" />
                </div>
                <div className="col-md-4 d-flex flex-column gap-2 h-100">
                    <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80" className="w-100 h-50 object-fit-cover rounded" alt="Sub 1" />
                    <div className="position-relative h-50">
                        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80" className="w-100 h-100 object-fit-cover rounded" alt="Sub 2" />
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center rounded cursor-pointer">
                            <span className="text-white fw-bold">+ 15 Photos</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- STICKY NAV BAR --- */}
      <div className="sticky-top bg-white border-bottom shadow-sm mb-4" style={{zIndex: 1020}}>
        <div className="container">
            <nav className="nav nav-pills nav-fill py-2">
                {['Overview', 'Rooms', 'Facilities', 'Reviews', 'Location', 'Policies'].map((item) => {
                    const id = item.toLowerCase();
                    return (
                        <button 
                            key={id}
                            id={`nav-${id}`}
                            className={`nav-link fw-bold border-0 bg-transparent ${activeTab === id ? 'text-primary border-bottom border-primary border-3 rounded-0' : 'text-muted'}`}
                            onClick={() => handleScroll(id)}
                        >
                            {item}
                        </button>
                    );
                })}
            </nav>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container">
        <div className="row">
            {/* LEFT COLUMN */}
            <div className="col-lg-8">
                
                {/* 1. OVERVIEW */}
                <section id="overview" className="card border-0 shadow-sm p-4 mb-4 scroll-mt">
                    <h5 className="fw-bold mb-3">Overview</h5>
                    <p className="text-muted mb-0">
                        Experience world-class service at {hotelData.name}. Located in the heart of {hotelData.city}, this property offers a perfect blend of luxury and comfort.
                    </p>
                </section>

                {/* 2. ROOMS SELECTION */}
                <section id="rooms" className="card border-0 shadow-sm p-4 mb-4 scroll-mt">
                    <h5 className="fw-bold mb-4">Available Rooms</h5>
                    {hotelData.rooms.map((room) => (
                        <div key={room.id} className={`border rounded p-3 mb-3 ${selectedRoom?.id === room.id ? 'border-primary bg-primary bg-opacity-10' : ''}`}>
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h6 className="fw-bold text-dark">{room.name}</h6>
                                    <div className="d-flex gap-3 text-muted small mb-2">
                                        <span><i className="fas fa-ruler-combined me-1"></i> {room.size}</span>
                                        <span><i className="fas fa-bed me-1"></i> {room.bed}</span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {room.features.map((f, i) => (
                                            <span key={i} className="badge bg-light text-secondary border">{f}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-4 text-end mt-3 mt-md-0">
                                    <h5 className="fw-bold text-dark mb-0">₹ {room.price.toLocaleString()}</h5>
                                    <p className="x-small text-muted mb-2">+ taxes</p>
                                    <button 
                                        className={`btn btn-sm px-4 fw-bold ${selectedRoom?.id === room.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        {selectedRoom?.id === room.id ? 'Selected' : 'Select'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 3. FACILITIES */}
                <section id="facilities" className="card border-0 shadow-sm p-4 mb-4 scroll-mt">
                    <h5 className="fw-bold mb-4">Facilities & Amenities</h5>
                    <div className="row g-3">
                        {hotelData.detailedFacilities.map((fac, i) => (
                            <div key={i} className="col-6 col-md-4">
                                <div className="d-flex align-items-center text-muted">
                                    <i className={`fas ${fac.icon} me-3 text-primary fa-lg w-25`}></i>
                                    <span>{fac.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. REVIEWS */}
                <section id="reviews" className="card border-0 shadow-sm p-4 mb-4 scroll-mt">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold mb-0">Guest Reviews</h5>
                        <span className="badge bg-primary fs-6">{hotelData.rating} / 10</span>
                    </div>
                    {hotelData.reviews.map((review, i) => (
                        <div key={i} className="border-bottom pb-3 mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-bold">{review.user}</span>
                                <span className="text-muted small">{review.date}</span>
                            </div>
                            <p className="text-muted mb-0 fst-italic">"{review.comment}"</p>
                        </div>
                    ))}
                </section>

                {/* 5. LOCATION */}
                <section id="location" className="card border-0 shadow-sm p-4 mb-4 scroll-mt">
                    <h5 className="fw-bold mb-3">Location</h5>
                    <p className="text-muted mb-3"><i className="fas fa-map-pin me-2 text-danger"></i> {hotelData.area}, {hotelData.city}</p>
                    <div className="rounded overflow-hidden shadow-sm bg-light d-flex align-items-center justify-content-center" style={{height: '350px'}}>
                         <iframe 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(hotelData.area + ', ' + hotelData.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            width="100%" 
                            height="100%" 
                            style={{border:0}} 
                            allowFullScreen="" 
                            loading="lazy"
                            title="Hotel Location"
                        ></iframe>
                    </div>
                </section>

                {/* 6. POLICIES */}
                <section id="policies" className="card border-0 shadow-sm p-4 mb-4 scroll-mt">
                    <h5 className="fw-bold mb-3">Property Policies</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <h6 className="fw-bold small text-muted">Check-in</h6>
                            <p className="mb-0">{hotelData.policies.checkIn}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <h6 className="fw-bold small text-muted">Check-out</h6>
                            <p className="mb-0">{hotelData.policies.checkOut}</p>
                        </div>
                        <div className="col-md-12 mb-3">
                            <h6 className="fw-bold small text-muted">Cancellation</h6>
                            <p className="mb-0 text-success">{hotelData.policies.cancellation}</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* RIGHT SIDEBAR: BOOKING SUMMARY */}
            <div className="col-lg-4">
                <div className="card border-0 shadow-sm sticky-top" style={{top: '100px', zIndex: 1000}}>
                    <div className="card-header bg-primary text-white py-3">
                        <h5 className="fw-bold mb-0">Booking Summary</h5>
                    </div>
                    <div className="card-body p-4">
                        <h6 className="text-dark fw-bold mb-1">{selectedRoom?.name}</h6>
                        <p className="text-muted small mb-3">1 Night, 2 Guests</p>
                        
                        <div className="d-flex justify-content-between mb-2 small">
                            <span>Base Price</span>
                            <span>₹ {selectedRoom?.price.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3 small text-muted">
                            <span>Taxes & Fees (18%)</span>
                            <span>₹ {taxAmount.toLocaleString()}</span>
                        </div>
                        
                        <hr className="border-dashed" />
                        
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="fw-bold h5 mb-0">Total</span>
                            <span className="fw-bold h4 text-danger mb-0">₹ {totalAmount.toLocaleString()}</span>
                        </div>

                        {/* --- THE UPDATED BUTTON --- */}
                        <button 
                            className="btn btn-warning w-100 py-3 fw-bold text-white shadow-sm" 
                            style={{backgroundColor: '#d46f1b', border: 'none'}}
                            onClick={handleBooking}
                        >
                            Proceed to Book
                        </button>
                        
                        <p className="text-center text-muted x-small mt-3 mb-0">
                            <i className="fas fa-lock me-1"></i> Secure Transaction
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <style>{`
        .scroll-mt { scroll-margin-top: 140px; }
        .cursor-pointer { cursor: pointer; }
        .x-small { font-size: 0.75rem; }
        .border-dashed { border-style: dashed !important; opacity: 0.3; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default HotelDetails;