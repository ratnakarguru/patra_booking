import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 1. IMPORT HOOK

const HotelBooking = () => {
  // 2. DEFINE SEARCH PARAMS AT THE TOP
  const location = useLocation();
  const searchParams = location.state || {}; // This fixes "searchParams is not defined"

  // --- STATE MANAGEMENT ---
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]); 
  
  // Filters (Initialize with passed data OR defaults)
  const [selectedCity, setSelectedCity] = useState(searchParams.city || "Bhubaneswar");
  const [selectedType, setSelectedType] = useState("All");
  const [minRating, setMinRating] = useState(0);

  // 3. DEFINE FORMAT DATE HELPER HERE
  const formatDate = (date) => { // This fixes "formatDate is not defined"
    return date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '---';
  };

  // Helper: Get Random Image
  const getHotelImage = (id, type) => {
    const images = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", 
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    ];
    return images[id % images.length];
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('https://gist.github.com/ratnakarguru/a43a51ba64d74e3abb7ff764e6faabfc');
        const data = await response.json();
        const fileKey = Object.keys(data.files)[0];
        const rawContent = data.files[fileKey].content;
        const parsedHotels = JSON.parse(rawContent);
        const uniqueCities = [...new Set(parsedHotels.map(h => h.city))];
        
        setAllHotels(parsedHotels);
        setCities(uniqueCities);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        setIsLoading(false);
      }
    };

    fetchHotels();

    // Load Bootstrap & Icons
    const btLink = document.createElement("link");
    btLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    btLink.rel = "stylesheet";
    document.head.appendChild(btLink);
    
    const iconLink = document.createElement("link");
    iconLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
    iconLink.rel = "stylesheet";
    document.head.appendChild(iconLink);

  }, []);

  // --- FILTER LOGIC ---
  useEffect(() => {
    if (allHotels.length > 0) {
        let result = allHotels.filter(h => h.city.toLowerCase().includes(selectedCity.toLowerCase()));
        
        if (selectedType !== "All") {
          result = result.filter(h => h.type === selectedType);
        }
        
        if (minRating > 0) {
          result = result.filter(h => h.rating >= minRating);
        }

        setFilteredHotels(result);
    }
  }, [allHotels, selectedCity, selectedType, minRating]);

  return (
    <div className="bg-light min-vh-100 font-sans">
      
      {/* --- TOP SUMMARY BAR --- */}
      <div className="sticky-top bg-white shadow-sm py-3" style={{ zIndex: 1020 }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-2">
              <span className="badge bg-primary fs-6">MMT Clone</span>
            </div>
            <div className="col-md-10">
              <div className="d-flex bg-light rounded-pill px-3 py-2 border cursor-pointer">
                 {/* City */}
                 <div className="me-4">
                    <span className="text-muted small text-uppercase fw-bold d-block" style={{fontSize: '10px'}}>City</span>
                    <select 
                      className="form-select border-0 bg-transparent p-0 fw-bold text-primary shadow-none"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 {/* Check In */}
                 <div className="me-4 border-start ps-4">
                    <span className="text-muted small text-uppercase fw-bold d-block" style={{fontSize: '10px'}}>Check-In</span>
                    {/* USAGE FIX: formatDate and searchParams are now defined */}
                    <span className="fw-bold text-dark">{formatDate(searchParams.checkIn)}</span>
                 </div>
                 {/* Check Out */}
                 <div className="me-4 border-start ps-4">
                    <span className="text-muted small text-uppercase fw-bold d-block" style={{fontSize: '10px'}}>Check-Out</span>
                    <span className="fw-bold text-dark">{formatDate(searchParams.checkOut)}</span>
                 </div>
                 {/* Guests */}
                 <div className="border-start ps-4">
                    <span className="text-muted small text-uppercase fw-bold d-block" style={{fontSize: '10px'}}>Guests</span>
                    <span className="fw-bold text-dark">
                        {searchParams.guests?.adults || 2} Adults, {searchParams.guests?.rooms || 1} Room
                    </span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container py-4">
        <div className="row">
          
          {/* --- FILTERS SIDEBAR --- */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="bg-white rounded shadow-sm p-3 mb-3">
              <h5 className="fw-bold mb-3">Filters</h5>
              
              <div className="mb-4">
                <label className="fw-bold small text-muted mb-2">HOTEL TYPE</label>
                {['All', 'Luxury', 'Premium', 'Budget'].map(type => (
                  <div className="form-check" key={type}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="hotelType" 
                      id={`type-${type}`} 
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                    />
                    <label className="form-check-label" htmlFor={`type-${type}`}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="fw-bold small text-muted mb-2">RATING</label>
                {[4.5, 4.0, 3.5].map(rate => (
                  <div className="form-check" key={rate}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={minRating === rate}
                      onChange={() => setMinRating(minRating === rate ? 0 : rate)}
                    />
                    <label className="form-check-label" htmlFor={`rate-${rate}`}>
                      {rate}+ Excellent
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- HOTEL LIST --- */}
          <div className="col-lg-9">
            {isLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Fetching hotels...</p>
                </div>
            )}

            {!isLoading && filteredHotels.length === 0 && (
              <div className="alert alert-warning">No hotels found in {selectedCity} for these filters.</div>
            )}

            {!isLoading && filteredHotels.map((hotel) => (
              <div key={hotel.id} className="card border-0 shadow-sm mb-4 overflow-hidden hover-shadow">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img 
                      src={getHotelImage(hotel.id, hotel.type)} 
                      className="img-fluid h-100 w-100 object-fit-cover" 
                      alt={hotel.name}
                      style={{minHeight: '200px'}}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body d-flex flex-column h-100">
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="d-flex align-items-center mb-1">
                             {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star small ${i < Math.floor(hotel.rating) ? 'text-warning' : 'text-muted opacity-25'}`}></i>
                            ))}
                            <span className="badge bg-light text-dark border ms-2" style={{fontSize: '10px'}}>{hotel.type}</span>
                          </div>
                          <h4 className="card-title fw-bold mb-1">{hotel.name}</h4>
                          <p className="card-text text-muted small">
                            <i className="fas fa-map-marker-alt me-1 text-primary"></i> {hotel.area}, {hotel.city}
                          </p>
                        </div>
                        <div className="text-end">
                           <span className="badge bg-primary fs-5 p-2 rounded-2">{hotel.rating}</span>
                           <div className="small text-muted mt-1">Very Good</div>
                        </div>
                      </div>

                      <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-end">
                         <div>
                            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger small mb-1">Deal of the Day</span>
                            <div className="text-muted small">Per Night</div>
                         </div>
                         <div className="text-end">
                            <h3 className="fw-bold mb-0">₹ {hotel.price}</h3>
                            <div className="small text-muted mb-2">+ taxes & fees</div>
                            <button className="btn btn-outline-primary rounded-pill px-4 fw-bold">View Details</button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
      <style>{`.hover-shadow:hover { box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important; transition: 0.3s; }`}</style>
    </div>
  );
};

export default HotelBooking;