import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const Hotelfilter = ({ 
  selectedType, setSelectedType, 
  minRating, setMinRating, 
  priceRange, setPriceRange,
  searchText, setSearchText,
  filteredHotels = [],
  userLocation // <--- ADDED THIS HERE TO FIX THE ERROR
}) => {
  
  const [showMap, setShowMap] = useState(false);

  // Default center logic now works because userLocation is defined
  const centerPosition = userLocation 
    ? userLocation 
    : (filteredHotels.length > 0 ? [filteredHotels[0].lat, filteredHotels[0].lng] : [28.6139, 77.2090]);

  const amenities = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: 'fa-wifi' },
    { id: 'pool', label: 'Swimming Pool', icon: 'fa-swimming-pool' },
    { id: 'parking', label: 'Free Parking', icon: 'fa-parking' },
    { id: 'ac', label: 'Air Conditioning', icon: 'fa-wind' }
  ];

  return (
    <div className="col-lg-3 d-none d-lg-block">
      <div className="filter-sidebar bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: '20px', zIndex: 1000 }}>
        
        {/* --- 1. REALTIME MAP TRIGGER --- */}
        <div className="mb-4 position-relative rounded-3 overflow-hidden border shadow-sm map-trigger" style={{height: '120px', cursor: 'pointer'}} onClick={() => setShowMap(true)}>
             <MapContainer center={centerPosition} zoom={10} zoomControl={false} dragging={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* Preview Markers */}
                {filteredHotels.slice(0, 3).map((hotel, idx) => (
                    <Marker key={idx} position={[hotel.lat, hotel.lng]} />
                ))}
             </MapContainer>
             <div className="position-absolute top-50 start-50 translate-middle w-100 text-center" style={{zIndex: 999}}>
                 <button className="btn btn-light btn-sm fw-bold shadow text-primary rounded-pill px-3">
                    <i className="fas fa-map-marker-alt me-2"></i>Map View
                 </button>
             </div>
        </div>

        {/* --- 2. SEARCH --- */}
        <div className="mb-4">
          <label className="text-muted small fw-bold mb-2">SEARCH PROPERTY</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0"><i className="fas fa-search text-muted small"></i></span>
            <input 
              type="text" 
              className="form-control bg-light border-start-0 shadow-none small" 
              placeholder="Hotel name or area..." 
              value={searchText || ""} 
              onChange={(e) => setSearchText && setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold m-0">Filters</h5>
          <span 
            className="text-primary small fw-bold cursor-pointer" 
            style={{ cursor: 'pointer', color: '#d46f1b' }}
            onClick={() => {
              setSelectedType('All'); 
              setMinRating(0); 
              setPriceRange(50000);
              if(setSearchText) setSearchText('');
            }}
          >
            Reset All
          </span>
        </div>

        <hr className="opacity-10" />
        
        {/* Price Filter */}
        <div className="mb-4">
          <label className="text-muted small fw-bold mb-2">BUDGET</label>
          <div className="fw-bold mb-2" style={{color: '#d46f1b'}}>Up to ₹{priceRange.toLocaleString()}</div>
          <input 
            type="range" 
            className="form-range custom-range" 
            min="500" 
            max="50000" 
            step="500"
            value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))} 
          />
        </div>

        <hr className="opacity-10" />

        {/* Rating Filter */}
        <div className="mb-4">
          <label className="text-muted small fw-bold mb-2">RATING</label>
          {[4, 3, 2].map(rating => (
            <div 
              key={rating} 
              className={`d-flex align-items-center p-2 rounded-3 mb-1 filter-item ${minRating === rating ? 'active-filter' : ''}`}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              style={{ cursor: 'pointer' }}
            >
              <input type="checkbox" className="form-check-input me-2" checked={minRating === rating} readOnly />
              <span className="small fw-bold">{rating}+ Stars</span>
              <div className="ms-auto text-warning small">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < rating ? '' : 'text-muted opacity-25'}`}></i>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr className="opacity-10" />

        {/* Type Filter */}
        <div className="mb-4">
          <label className="text-muted small fw-bold mb-2">TYPE</label>
          {['All', 'Luxury', 'Premium', 'Budget'].map(t => (
            <div className="form-check mb-2 custom-checkbox" key={t}>
              <input 
                className="form-check-input shadow-none" 
                type="radio" 
                name="hotelType" 
                checked={selectedType === t} 
                onChange={() => setSelectedType(t)} 
              />
              <label className="form-check-label small fw-semibold">{t}</label>
            </div>
          ))}
        </div>

        <hr className="opacity-10" />

        {/* Amenities */}
        <div className="mb-2">
          <label className="text-muted small fw-bold mb-2">AMENITIES</label>
          {amenities.map(item => (
            <div className="d-flex align-items-center mb-2 small fw-semibold text-muted opacity-75" key={item.id}>
               <i className={`fas ${item.icon} me-2`} style={{width: '20px'}}></i>
               <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- 3. FULL SCREEN MAP MODAL --- */}
      {showMap && (
        <div className="map-modal-overlay">
           <div className="map-modal-content">
              <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">
                 <h5 className="fw-bold m-0"><i className="fas fa-map-marked-alt me-2"></i>Map View</h5>
                 <button className="btn-close" onClick={() => setShowMap(false)}></button>
              </div>
              <div className="flex-grow-1 position-relative">
                  <MapContainer center={centerPosition} zoom={12} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      
                      {/* Auto-Recenter when modal opens */}
                      <RecenterAutomatically lat={centerPosition[0]} lng={centerPosition[1]} />

                      {filteredHotels.map((hotel, index) => (
                          <Marker key={index} position={[hotel.lat, hotel.lng]}>
                              <Popup>
                                  <div className="text-center">
                                      <h6 className="fw-bold mb-1">{hotel.name}</h6>
                                      <div className="text-warning small mb-1">
                                          {hotel.rating} ★
                                      </div>
                                      <div className="fw-bold text-danger">₹ {hotel.price.toLocaleString()}</div>
                                  </div>
                              </Popup>
                          </Marker>
                      ))}
                  </MapContainer>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .active-filter { background: #fff4e6; color: #d46f1b !important; }
        .filter-item:hover { background: #f8f9fa; }
        .custom-range::-webkit-slider-thumb { background: #d46f1b; }
        .form-check-input:checked { background-color: #d46f1b; border-color: #d46f1b; }
        
        .map-trigger { transition: transform 0.2s; }
        .map-trigger:hover { transform: translateY(-2px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }

        /* Map Modal Styles */
        .map-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.7); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
            animation: fadeIn 0.2s;
        }
        .map-modal-content {
            width: 90vw; height: 85vh; background: white;
            border-radius: 10px; overflow: hidden; display: flex; flex-direction: column;
        }
        /* Fix leaflet z-index issues inside modals */
        .leaflet-pane { z-index: 1; }
        .leaflet-top, .leaflet-bottom { z-index: 1000; }
      `}</style>
    </div>
  );
};

export default Hotelfilter;