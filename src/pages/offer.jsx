import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaMapMarkerAlt,
  FaWhatsapp,
  FaCar,
  FaPlane,
  FaHotel,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { Ri24HoursLine, RiMoneyRupeeCircleFill } from "react-icons/ri";

const SuperOffers = () => {
  // --- 1. STATE & REFS MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("All");

  // Separate refs for separate sliders
  const taxiScrollRef = useRef(null);
  const hotelScrollRef = useRef(null);

  // Taxi State
  const [taxiDeals, setTaxiDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hotel State
  const [hotelDeals, setHotelDeals] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);

  // --- 2. DATA FETCHING ---

  // Fetch Taxis
  useEffect(() => {
    const fetchTaxis = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/taxis");
        if (!response.ok) throw new Error("Failed to fetch taxis");

        const data = await response.json();
        setTaxiDeals(data);
      } catch (err) {
        console.error(err);
        setError("Could not load taxi deals");
      } finally {
        setLoading(false);
      }
    };

    fetchTaxis();
  }, []);

  // Fetch Hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(
          "https://gist.githubusercontent.com/ratnakarguru/a43a51ba64d74e3abb7ff764e6faabfc/raw/Hotels"
        );
        if (!res.ok) throw new Error("Failed to load hotels");

        const data = await res.json();

        // Safely access data.hotels, filter, and take up to 10
        const luxuryHotels = (data?.hotels || []).filter((h) => h.type === "Luxury");
        setHotelDeals(luxuryHotels.slice(0, 10));

      } catch (err) {
        console.error(err);
        setHotelError("Could not load hotels");
      } finally {
        setHotelLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // --- 3. HELPER FUNCTIONS ---

  // Scroll Handler for Taxis
  const handleTaxiScroll = (direction) => {
    const { current } = taxiScrollRef;
    if (!current) return;

    const scrollAmount = 300;
    if (direction === "left") {
      current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Scroll Handler for Hotels
  const handleHotelScroll = (direction) => {
    const { current } = hotelScrollRef;
    if (!current) return;

    const scrollAmount = 320; // Slightly larger scroll for hotel cards
    if (direction === "left") {
      current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const shouldShow = (category) => activeTab === "All" || activeTab === category;

  // Inline style to hide the physical scrollbar but keep scrollability
  const hideScrollbarStyle = {
    scrollBehavior: "smooth",
    overflowX: "auto",
    scrollbarWidth: "none", /* Firefox */
    msOverflowStyle: "none", /* IE/Edge */
  };

  return (
    <div className="bg-light pb-5 position-relative">
      {/* --- TOP FEATURES BANNER --- */}
      <div className="bg-white border-bottom py-4 mb-5 shadow-sm">
        <div className="container">
          <div className="row justify-content-center text-center text-md-start">
            <div className="col-md-5 d-flex align-items-center justify-content-center justify-content-md-start gap-3 mb-3 mb-md-0">
              <Ri24HoursLine size={50} className="text-secondary opacity-75" />
              <div>
                <h6 className="fw-bold mb-0 text-uppercase">24x7 Support</h6>
                <small className="text-muted">
                  We're always here for you - reach us 24 hours a day.
                </small>
              </div>
            </div>

            <div className="col-md-5 d-flex align-items-center justify-content-center justify-content-md-start gap-3">
              <RiMoneyRupeeCircleFill size={50} className="text-secondary opacity-75" />
              <div>
                <h6 className="fw-bold mb-0 text-uppercase">Best Price Guaranteed</h6>
                <small className="text-muted">
                  Find a lower price? We'll refund you 200% of the difference.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* --- SUPER OFFERS HEADER & TABS --- */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-5">
          <h2 className="fw-bold text-dark m-0 mb-3 mb-md-0">
            Super <span className="fw-light text-warning">Offers</span>
          </h2>

          <div className="d-flex gap-2">
            {["All", "Flight", "Hotel", "Taxi"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${activeTab === tab ? "btn-danger shadow" : "btn-outline-secondary"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- FLIGHTS SECTION --- */}
        {shouldShow("Flight") && (
          <div className="mb-5 animate-fade-in">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaPlane className="text-warning" size={24} />
              <h4 className="text-secondary m-0">
                Popular <span className="fw-bold text-dark">Flights</span>
              </h4>
            </div>

            <div className="row">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h6 className="text-muted text-uppercase small fw-bold mb-3">International Routes</h6>
                <div className="row g-3">
                  {[
                    { from: "Bhubaneshwar", to: "Dubai" },
                    { from: "Dubai", to: "Bhubaneshwar" },
                  ].map((route, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="card shadow-sm border-0 h-100 hover-lift">
                        <div className="card-body d-flex align-items-center gap-3 py-3">
                          <div className="rounded-circle bg-light p-2 text-primary">
                            <FaMapMarkerAlt />
                          </div>
                          <div className="fw-bold small">
                            {route.from} <span className="text-muted mx-1">✈</span> {route.to}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-6">
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Domestic Routes</h6>
                <div className="row g-3">
                  {[
                    { from: "Bhubaneshwar", to: "Hyderabad" },
                    { from: "Bhubaneshwar", to: "Delhi" },
                  ].map((route, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="card shadow-sm border-0 h-100 hover-lift">
                        <div className="card-body d-flex align-items-center gap-3 py-3">
                          <div className="rounded-circle bg-light p-2 text-primary">
                            <FaMapMarkerAlt />
                          </div>
                          <div className="fw-bold small">
                            {route.from} <span className="text-muted mx-1">✈</span> {route.to}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <hr className="my-5 text-muted opacity-25" />
          </div>
        )}

        {/* --- HOTEL DEALS SECTION --- */}
        {shouldShow("Hotel") && (
          <div className="mb-5 position-relative animate-fade-in">
            <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
              <FaHotel className="text-warning" size={24} />
              <h3 className="fw-bold text-dark m-0">
                Hotel <span className="fw-light">Deals</span>
              </h3>
            </div>

            {hotelLoading && <p className="text-center">Loading hotels...</p>}
            {hotelError && <p className="text-danger text-center">{hotelError}</p>}

            {!hotelLoading && hotelDeals.length === 0 && !hotelError && (
              <p className="text-center text-muted">No luxury hotels available right now.</p>
            )}

            {!hotelLoading && !hotelError && hotelDeals.length > 0 && (
              <>
                {/* LEFT ARROW (HOTELS) */}
                <button
                  className="btn btn-light shadow position-absolute top-50 start-0 translate-middle-y z-3 rounded-circle"
                  onClick={() => handleHotelScroll("left")}
                  style={{ width: "40px", height: "40px" }}
                >
                  <FaChevronLeft />
                </button>

                {/* RIGHT ARROW (HOTELS) */}
                <button
                  className="btn btn-light shadow position-absolute top-50 end-0 translate-middle-y z-3 rounded-circle"
                  onClick={() => handleHotelScroll("right")}
                  style={{ width: "40px", height: "40px" }}
                >
                  <FaChevronRight />
                </button>

                {/* HOTEL SLIDER */}
                <div
                  ref={hotelScrollRef}
                  className="d-flex gap-4 px-4 py-2"
                  style={hideScrollbarStyle}
                >
                  {hotelDeals.map((hotel) => (
                    <div
                      key={hotel.id || hotel.name}
                      className="card border-0 shadow-sm overflow-hidden hover-scale flex-shrink-0"
                      style={{ minWidth: "280px" }} // Fixed width for slider cards
                    >
                      <div className="card-body p-3">
                        <h6 className="fw-bold text-dark mb-1">{hotel.name}</h6>
                        <small className="text-muted d-block mb-2">
                          <FaMapMarkerAlt size={12} className="me-1" />
                          {hotel.city}, {hotel.area}
                        </small>
                        <div className="d-flex align-items-end justify-content-between mt-3">
                          <div>
                            <span className="h5 fw-bold text-danger mb-0">
                              ₹ {hotel.price?.toLocaleString()}
                            </span>
                            <small className="text-muted" style={{ fontSize: "10px" }}>
                              /night
                            </small>
                          </div>
                          <div className="bg-warning text-white rounded-pill px-2 py-1 small fw-bold">
                            {hotel.rating} ⭐
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <hr className="my-5 text-muted opacity-25" />
          </div>
        )}

        {/* --- TAXI DEALS SECTION --- */}
        {shouldShow("Taxi") && (
          <div className="mb-5 position-relative animate-fade-in">
            <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
              <FaCar className="text-warning" size={24} />
              <h3 className="fw-bold text-dark m-0">
                Taxi <span className="fw-light">Deals</span>
              </h3>
            </div>

            {loading && <p className="text-center">Loading taxis...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            {!loading && !error && taxiDeals.length > 0 && (
              <>
                {/* LEFT ARROW (TAXIS) */}
                <button
                  className="btn btn-light shadow position-absolute top-50 start-0 translate-middle-y z-3 rounded-circle"
                  onClick={() => handleTaxiScroll("left")}
                  style={{ width: "40px", height: "40px" }}
                >
                  <FaChevronLeft />
                </button>

                {/* RIGHT ARROW (TAXIS) */}
                <button
                  className="btn btn-light shadow position-absolute top-50 end-0 translate-middle-y z-3 rounded-circle"
                  onClick={() => handleTaxiScroll("right")}
                  style={{ width: "40px", height: "40px" }}
                >
                  <FaChevronRight />
                </button>

                {/* TAXI SLIDER */}
                <div
                  ref={taxiScrollRef}
                  className="d-flex gap-4 px-4 py-2"
                  style={hideScrollbarStyle}
                >
                  {taxiDeals.map((taxi) => (
                    <div
                      key={taxi.id}
                      className="card shadow-sm border-0 p-3 flex-shrink-0 hover-scale"
                      style={{ minWidth: "260px" }}
                    >
                      <h6 className="fw-bold text-dark mb-1">{taxi.name}</h6>
                      <small className="text-muted">{taxi.desc}</small>

                      <div className="my-3 bg-light rounded p-2 text-center">
                        <span className="h5 fw-bold text-dark">
                          ₹ {taxi.price || "Contact"}
                        </span>
                        {taxi.unit && <small className="text-muted ms-1">{taxi.unit}</small>}
                      </div>

                      <button className="btn btn-warning text-white w-100 fw-bold rounded-pill btn-sm">
                        Book Ride
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!loading && !error && taxiDeals.length === 0 && (
              <p className="text-center text-muted">No taxi deals available at the moment.</p>
            )}

          </div>
        )}
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        className="position-fixed bottom-0 end-0 m-4 bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg hover-scale"
        style={{ width: "60px", height: "60px", zIndex: 1000, textDecoration: "none" }}
      >
        <FaWhatsapp size={35} />
      </a>

      {/* Global CSS to hide webkit scrollbars for the sliders */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SuperOffers;