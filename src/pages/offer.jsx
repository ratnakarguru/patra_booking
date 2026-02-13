import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaMapMarkerAlt,
  FaWhatsapp,
  FaCar,
  FaPlane,
  FaHotel
} from 'react-icons/fa';
import { Ri24HoursLine, RiMoneyRupeeCircleFill } from 'react-icons/ri';

const SuperOffers = () => {
  const [activeTab, setActiveTab] = useState('All');

  // --- MOCK DATA ---
  const popularInternational = [
    { from: 'Bhubaneshwar', to: 'Dubai', type: 'International' },
    { from: 'Dubai', to: 'Bhubaneshwar', type: 'International' },
  ];

  const popularDomestic = [
    { from: 'Bhubaneshwar', to: 'Hyderabad', type: 'Domestic' },
    { from: 'Bhubaneshwar', to: 'Delhi', type: 'Domestic' },
  ];

  const hotelDeals = [
    {
      id: 1,
      name: 'Taj Mahal Tower',
      price: 6500,
      location: 'Mumbai, India',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'The Regale by Tunga',
      price: 2010,
      location: 'Bhubaneswar, Odisha',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Trident Bandra Kurla',
      price: 4050,
      location: 'Mumbai, India',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Mayfair Lagoon',
      price: 5500,
      location: 'Bhubaneswar, Odisha',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  // ADDED: Taxi specific data
  const [taxiDeals, setTaxiDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaxis = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/taxis');

        if (!response.ok) {
          throw new Error('Failed to fetch taxis');
        }

        const data = await response.json();
        setTaxiDeals(data);
      } catch (err) {
        console.error(err);
        setError('Could not load taxi deals');
      } finally {
        setLoading(false);
      }
    };

    fetchTaxis();
  }, []);

  // Helper to check which tab is open
  const shouldShow = (category) => activeTab === 'All' || activeTab === category;

  return (
    <div className="bg-light pb-5 position-relative">

      {/* --- 1. TOP FEATURES BANNER --- */}
      <div className="bg-white border-bottom py-4 mb-5 shadow-sm">
        <div className="container">
          <div className="row justify-content-center text-center text-md-start">

            {/* 24x7 Support */}
            <div className="col-md-5 d-flex align-items-center justify-content-center justify-content-md-start gap-3 mb-3 mb-md-0">
              <Ri24HoursLine size={50} className="text-secondary opacity-75" />
              <div>
                <h6 className="fw-bold mb-0 text-uppercase">24x7 Support</h6>
                <small className="text-muted">
                  We're always here for you - reach us 24 hours a day.
                </small>
              </div>
            </div>

            {/* Best Price Guarantee */}
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

        {/* --- 2. SUPER OFFERS HEADER & TABS --- */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-5">
          <h2 className="fw-bold text-dark m-0 mb-3 mb-md-0">Super <span className="fw-light text-warning">Offers</span></h2>

          <div className="d-flex gap-2">
            {['All', 'Flight', 'Hotel', 'Taxi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${activeTab === tab
                  ? 'btn-danger shadow'
                  : 'btn-outline-secondary'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- 3. FLIGHTS SECTION --- */}
        {shouldShow('Flight') && (
          <div className="mb-5 animate-fade-in">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaPlane className="text-warning" size={24} />
              <h4 className="text-secondary m-0">Popular <span className="fw-bold text-dark">Flights</span></h4>
            </div>

            <div className="row">
              {/* International */}
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h6 className="text-muted text-uppercase small fw-bold mb-3">International Routes</h6>
                <div className="row g-3">
                  {popularInternational.map((route, idx) => (
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

              {/* Domestic */}
              <div className="col-lg-6">
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Domestic Routes</h6>
                <div className="row g-3">
                  {popularDomestic.map((route, idx) => (
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

        {/* --- 4. HOTEL DEALS SECTION --- */}
        {shouldShow('Hotel') && (
          <div className="mb-5 animate-fade-in">
            <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
              <FaHotel className="text-warning" size={24} />
              <h3 className="fw-bold text-dark m-0">Hotel <span className="fw-light">Deals</span></h3>
            </div>

            <div className="row g-4">
              {hotelDeals.map((hotel) => (
                <div key={hotel.id} className="col-md-6 col-lg-3">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden hover-scale">
                    <div className="position-relative" style={{ height: '200px' }}>
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <span className="position-absolute top-0 end-0 bg-danger text-white small fw-bold px-2 py-1 m-2 rounded">
                        -20% OFF
                      </span>
                    </div>
                    <div className="card-body p-3">
                      <h6 className="fw-bold text-dark mb-1">{hotel.name}</h6>
                      <small className="text-muted d-block mb-2"><FaMapMarkerAlt size={12} /> {hotel.location}</small>
                      <div className="d-flex align-items-end justify-content-between">
                        <div>
                          <span className="h5 fw-bold text-danger mb-0">₹ {hotel.price.toLocaleString()}</span>
                          <small className="text-muted" style={{ fontSize: '10px' }}>/night</small>
                        </div>
                        <button className="btn btn-sm btn-outline-warning rounded-pill">View</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr className="my-5 text-muted opacity-25" />
          </div>
        )}

        {/* --- 5. TAXI DEALS SECTION --- */}
        {shouldShow('Taxi') && (
          <div className="d-flex overflow-auto gap-3 pb-3" style={{ scrollBehavior: "smooth" }}>
            {!loading && !error && taxiDeals.map((taxi) => (
              <div
                key={taxi.id}
                className="card shadow-sm border-0 p-3 flex-shrink-0"
                style={{ minWidth: "250px" }}
              >
                <h6 className="fw-bold text-dark mb-1">{taxi.name}</h6>
                <small className="text-muted">{taxi.desc}</small>

                <div className="my-3 bg-light rounded p-2 text-center">
                  <span className="h5 fw-bold text-dark">
                    ₹ {taxi.price || "Contact"}
                  </span>
                </div>

                <button className="btn btn-warning text-white w-100 fw-bold rounded-pill btn-sm">
                  Book Ride
                </button>
              </div>
            ))}
          </div>

        )}


      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919999999999" // Replace with real number
        target="_blank"
        rel="noreferrer"
        className="position-fixed bottom-0 end-0 m-4 bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg hover-scale"
        style={{ width: '60px', height: '60px', zIndex: 1000, textDecoration: 'none' }}
      >
        <FaWhatsapp size={35} />
      </a>

    </div>
  );
};

export default SuperOffers;