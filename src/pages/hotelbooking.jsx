import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useGeolocated } from "react-geolocated";
import Hotelfilter from "./hotelfilter";
import Hotelmodify from "./hotelmodify";

const HotelBooking = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  
  const [searchParams, setSearchParams] = useState(location.state || {
      checkIn: '',
      checkOut: '',
      guests: 2
  });

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  // --- DATA STATES ---
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- SHARED FILTER STATES ---
  const [searchText, setSearchText] = useState(searchParams.city || "");
  const [selectedType, setSelectedType] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState(50000);
  
  // --- NEW: SORT STATE ---
  const [sortBy, setSortBy] = useState("Recommended");

  // --- HELPER: Calculate Nights ---
  const calculateNights = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 1; // Default to 1 night if no dates
    
    const start = new Date(searchParams.checkIn);
    const end = new Date(searchParams.checkOut);
    
    // Calculate difference in time
    const timeDiff = end.getTime() - start.getTime();
    
    // Calculate difference in days (1000 * 3600 * 24)
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    // Return days, ensuring at least 1 night
    return daysDiff > 0 ? Math.ceil(daysDiff) : 1;
  };

  const totalNights = calculateNights();

  // 1. Fetch Data
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        const targetUrl = "https://gist.githubusercontent.com/ratnakarguru/a43a51ba64d74e3abb7ff764e6faabfc/raw";
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);
        const data = await response.json();

        const hotelList = Array.isArray(data) ? data : data.hotels || [];

        const centerLat = coords ? coords.latitude : 28.6139;
        const centerLng = coords ? coords.longitude : 77.2090;

        const normalized = hotelList.map((h) => ({
          ...h,
          type: h.type || h.category || "Standard",
          price: Number(h.price) || 0,
          rating: Number(h.rating) || 0,
          facilities: ["Free Wi-Fi", "Swimming Pool", "AC"],
          lat: centerLat + (Math.random() - 0.5) * 0.05,
          lng: centerLng + (Math.random() - 0.5) * 0.05,
        }));

        setAllHotels(normalized);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (coords || !isGeolocationEnabled || !isGeolocationAvailable) {
        fetchHotels();
    }
    
  }, [coords, isGeolocationEnabled, isGeolocationAvailable]);

  // 2. Filter & Sort Logic
  useEffect(() => {
    const query = searchText.toLowerCase().trim();

    // A. Filter
    let result = allHotels.filter((h) => {
      const matchesSearch =
        !query ||
        h.name?.toLowerCase().includes(query) ||
        h.city?.toLowerCase().includes(query) ||
        h.area?.toLowerCase().includes(query);

      const matchesType = selectedType === "All" || h.type === selectedType;
      const matchesRating = h.rating >= minRating;
      const matchesPrice = h.price <= priceRange;

      return matchesSearch && matchesType && matchesRating && matchesPrice;
    });

    // B. Sort
    switch (sortBy) {
        case "Price: Low to High":
            result.sort((a, b) => a.price - b.price);
            break;
        case "Price: High to Low":
            result.sort((a, b) => b.price - a.price);
            break;
        case "Top Rated":
            result.sort((a, b) => b.rating - a.rating);
            break;
        default: 
            result.sort((a, b) => a.price - b.price); 
            break;
    }

    setFilteredHotels(result);
  }, [searchText, selectedType, minRating, priceRange, allHotels, sortBy]);

  const getHotelImage = (id) => {
    const images = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    ];
    return images[(id || 0) % images.length];
  };

  const handleCardClick = (hotel) => {
    // Pass the calculated price or simply the hotel data
    navigate('/Hotel_Booking', { state: { hotel, totalNights } });
  };

  const getOriginalPrice = (price) => Math.floor(price * 1.45);

  return (
    <div className="bg-light min-vh-100 position-relative">
      
      <Hotelmodify
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      
      {!isGeolocationEnabled && (
        <div className="alert alert-warning py-2 small mb-3">
            <i className="fas fa-map-marker-slash me-2"></i>
            Location Disabled. Showing default results.
        </div>
      )}

      <div className="container py-4">
        <div className="row">
          <Hotelfilter 
            selectedType={selectedType} 
            setSelectedType={setSelectedType}
            minRating={minRating} 
            setMinRating={setMinRating}
            priceRange={priceRange} 
            setPriceRange={setPriceRange}
            searchText={searchText}
            setSearchText={setSearchText}
            filteredHotels={filteredHotels}
          />

          <div className="col-lg-9">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold m-0">
                {filteredHotels.length} Hotels in {searchText || "India"}
              </h5>
              
              <div className="dropdown">
                  <button 
                    className="btn btn-white border bg-white rounded-pill px-3 py-1 dropdown-toggle small shadow-sm d-flex align-items-center gap-2" 
                    type="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <span className="text-muted small">Sort by:</span> 
                    <span className="fw-bold text-dark">{sortBy}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 rounded-3">
                    {["Recommended", "Price: Low to High", "Price: High to Low", "Top Rated"].map((opt) => (
                        <li key={opt}>
                            <button 
                                className={`dropdown-item rounded-2 small fw-semibold py-2 ${sortBy === opt ? 'bg-light text-primary' : ''}`} 
                                onClick={() => setSortBy(opt)}
                            >
                                {opt}
                            </button>
                        </li>
                    ))}
                  </ul>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center p-5">
                <h4>No hotels found</h4>
              </div>
            ) : (
              filteredHotels.map((hotel, index) => {
                // --- CALCULATION LOGIC HERE ---
                const totalPrice = hotel.price * totalNights;
                const totalOriginalPrice = getOriginalPrice(hotel.price) * totalNights;

                return (
                <div
                  key={index}
                  className="card border-0 shadow-sm mb-3 hotel-card-hover"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCardClick(hotel)}
                >
                  <div className="row g-0">
                    <div className="col-md-4 position-relative">
                      <img
                        src={getHotelImage(hotel.id || index)}
                        className="h-100 w-100 object-fit-cover rounded-start"
                        alt={hotel.name}
                        style={{ minHeight: "200px" }}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                          <div className="bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                             <i className="far fa-heart text-muted"></i>
                          </div>
                      </div>
                    </div>

                    <div className="col-md-5 border-end">
                      <div className="card-body py-3">
                        <h4 className="fw-bold mb-1 text-dark">{hotel.name}</h4>
                        <div className="text-warning small mb-2">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star ${i < Math.floor(hotel.rating) ? "" : "text-muted opacity-25"}`}></i>
                          ))}
                          <span className="text-muted ms-2 bg-light px-2 py-1 rounded small border">
                             {hotel.type}
                          </span>
                        </div>
                        <div className="mb-3">
                            <p className="text-primary mb-1 small fw-bold">
                              <i className="fas fa-map-marker-alt me-1"></i> {hotel.area}, {hotel.city} - <span className="text-muted fw-normal">1.2 km to center</span>
                            </p>
                            <p className="small text-muted fst-italic mb-0">"Great location and clean rooms"</p>
                        </div>
                        <div className="mt-3">
                            <span className="text-success small fw-bold border border-success px-2 py-1 rounded me-2">
                                <i className="fas fa-check me-1"></i>Free Cancellation
                            </span>
                            <span className="text-secondary small border px-2 py-1 rounded">No prepayment needed</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 bg-light d-flex flex-column justify-content-between p-3 text-end">
                       <div className="d-flex justify-content-end align-items-center mb-3">
                          <div className="me-2">
                              <div className="fw-bold text-dark small">Very Good</div>
                              <div className="text-muted x-small">1,195 reviews</div>
                          </div>
                          <div className="bg-primary text-white fw-bold rounded p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                              {hotel.rating}
                          </div>
                       </div>
                       <div>
                           <div className="badge bg-danger mb-2">Today's Value Deal</div>
                           <div className="text-muted text-decoration-line-through small">
                               {/* Display Original Price for total nights */}
                               ₹ {totalOriginalPrice.toLocaleString()}
                           </div>
                           <h3 className="fw-bold text-danger mb-0">
                               {/* Display Discounted Price for total nights */}
                               ₹ {totalPrice.toLocaleString()}
                           </h3>
                           <div className="small text-muted mb-2">
                               {/* Added logic to show number of nights */}
                               {totalNights > 1 ? `price for ${totalNights} nights` : 'price per night'} 
                               <br />+ taxes & fees
                           </div>
                           <div className="text-primary fw-bold small">
                               See availability <i className="fas fa-chevron-right small"></i>
                           </div>
                       </div>
                    </div>

                  </div>
                </div>
              )})
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hotel-card-hover { transition: all 0.2s ease-in-out; border: 1px solid #e0e0e0 !important; }
        .hotel-card-hover:hover { transform: translateY(-2px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important; border-color: #a0a0a0 !important; }
        .x-small { font-size: 0.75rem; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default HotelBooking;