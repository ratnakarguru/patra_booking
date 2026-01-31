import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HotelBooking = () => {
  const location = useLocation();
  const searchParams = location.state || {}; 

  // --- STATE ---
  const [allHotels, setAllHotels] = useState([]); // Stores the 200 hotels from Gist
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search State
  const [searchText, setSearchText] = useState(searchParams.city || ""); 
  const [selectedType, setSelectedType] = useState("All");
  const [minRating, setMinRating] = useState(0);

  // --- HELPERS ---
  const formatDate = (date) => {
    if (!date) return '---';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getHotelImage = (id) => {
    const images = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", 
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    ];
    return images[(id || 0) % images.length];
  };

  // --- 1. FETCH DATA FROM YOUR GIST ---
 // --- FETCH DATA (Updated for New Structure & Localhost) ---
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);

        const targetUrl = 'https://gist.githubusercontent.com/ratnakarguru/a43a51ba64d74e3abb7ff764e6faabfc/raw';
        // Using Proxy for Localhost
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        // FIX: The Gist is now an object { hotels: [...] }, not an array directly.
        // We also check if 'data.hotels' exists.
        let hotelList = [];
        
        if (Array.isArray(data)) {
            hotelList = data; // Old format
        } else if (data.hotels && Array.isArray(data.hotels)) {
            hotelList = data.hotels; // New format
        }

        // FIX: Some hotels use 'category' instead of 'type'. We standardize this here.
        // This ensures the Filter (Luxury/Budget) works for ALL 150 hotels.
        const normalizedHotels = hotelList.map(h => ({
            ...h,
            type: h.type || h.category // Use 'type' if exists, else use 'category'
        }));

        setAllHotels(normalizedHotels);
        setFilteredHotels(normalizedHotels);

      } catch (error) {
        console.error("Error fetching hotel data:", error);
        alert("Failed to load hotels. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
    
    // Inject CSS
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const iconLink = document.createElement("link");
    iconLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
    iconLink.rel = "stylesheet";
    document.head.appendChild(iconLink);
  }, []);

  // --- 2. FILTER LOGIC ---
  useEffect(() => {
    // Only run filter if we have data
    if (allHotels.length > 0) {
      const query = searchText.toLowerCase().trim();

      let result = allHotels.filter(h => {
        // Safe checks using optional chaining (?)
        const matchName = h.name?.toLowerCase().includes(query);
        const matchCity = h.city?.toLowerCase().includes(query);
        const matchArea = h.area?.toLowerCase().includes(query);
        
        // If search is empty, show everything. If not, match fields.
        return query === "" || matchName || matchCity || matchArea;
      });
      
      if (selectedType !== "All") {
        result = result.filter(h => h.type === selectedType);
      }
      
      if (minRating > 0) {
        result = result.filter(h => h.rating >= minRating);
      }

      setFilteredHotels(result);
    }
  }, [searchText, selectedType, minRating, allHotels]);

  return (
    <div className="bg-light min-vh-100 font-sans">
      
      {/* HEADER */}
      <div className="sticky-top bg-white shadow-sm py-3" style={{ zIndex: 1020 }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-2">
              <span className="badge fs-6" style={{backgroundColor: '#d46f1b'}}>PATRA TRAVELS</span>
            </div>
            <div className="col-md-10">
              <div className="d-flex bg-light rounded-pill px-3 py-2 border">
                 <div className="me-4 flex-grow-1">
                    <span className="text-muted small text-uppercase fw-bold d-block" style={{fontSize: '10px'}}>Location / Hotel</span>
                    <input 
                      type="text" 
                      className="form-control border-0 bg-transparent p-0 fw-bold shadow-none"
                      style={{ color: '#d46f1b'}}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search city, hotel name..."
                    />
                 </div>
                 <div className="me-4 border-start ps-4">
                    <span className="text-muted small text-uppercase fw-bold d-block" style={{fontSize: '10px'}}>Check-In</span>
                    <span className="fw-bold text-dark">{formatDate(searchParams.checkIn)}</span>
                 </div>
                 <div className="me-4 border-start ps-4">
                    <span className="text-muted small text-uppercase fw-bold d-block" style={{fontSize: '10px'}}>Check-Out</span>
                    <span className="fw-bold text-dark">{formatDate(searchParams.checkOut)}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="container py-4">
        <div className="row">
          
          {/* FILTERS */}
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
                    <label className="form-check-label" htmlFor={`type-${type}`}>{type}</label>
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

          {/* LIST */}
          <div className="col-lg-9">
            {isLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Loading 200+ Hotels...</p>
                </div>
            )}

            {!isLoading && filteredHotels.length === 0 && (
              <div className="alert alert-warning text-center p-5">
                <h4>No hotels found</h4>
                <p>We couldn't find matches for "<strong>{searchText}</strong>".</p>
                <button className="btn btn-outline-dark btn-sm" onClick={() => setSearchText('')}>Show All Hotels</button>
              </div>
            )}

            {!isLoading && filteredHotels.map((hotel, index) => (
              <div key={index} className="card border-0 shadow-sm mb-4 overflow-hidden hover-shadow">
                <div className="row g-0">
                  <div className="col-md-4">
                    {/* Using hotel.id if available, otherwise index */}
                    <img src={getHotelImage(hotel.id || index)} className="img-fluid h-100 w-100 object-fit-cover" alt={hotel.name} style={{minHeight: '220px'}} />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body d-flex flex-column h-100 p-4">
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="d-flex align-items-center mb-1">
                             {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star small ${i < Math.floor(hotel.rating || 0) ? 'text-warning' : 'text-muted opacity-25'}`}></i>
                             ))}
                             <span className="badge bg-light text-dark border ms-2" style={{fontSize: '10px'}}>{hotel.type}</span>
                          </div>
                          <h4 className="card-title fw-bold mb-1">{hotel.name}</h4>
                          <p className="card-text text-muted small"><i className="fas fa-map-marker-alt me-1 text-primary"></i> {hotel.area}, {hotel.city}</p>
                        </div>
                        <div className="text-end">
                           <span className="badge fs-5 p-2 rounded-2" style={{ backgroundColor: '#d46f1b'}}>{hotel.rating || "New"}</span>
                        </div>
                      </div>
                      <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-end">
                         <div className="text-end ms-auto">
                            <h3 className="fw-bold mb-0">₹ {hotel.price}</h3>
                            <div className="small text-muted mb-2">+ taxes</div>
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