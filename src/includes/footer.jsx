import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  FaCheck, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';
import { FaXTwitter,FaTumblr,FaPinterest   } from "react-icons/fa6";
const Footer = () => {
  const brandOrange = '#ff6b00';
  const currentYear = new Date().getFullYear();

  // --- DATA LISTS ---
  const companyLinks = [
    "About Us", "FAQs", "Terms & Conditions", "Privacy Policy", 
    "Disclaimer", "Careers", "Gallery", "Blog", "Reviews", 
    "Payment", "Contact Us"
  ];

  const serviceLinks = [
    "Flights", "Hotels", "Domestic Holidays", "International Holidays", 
    "Forex", "Events", "Mice", "Visa Assistance", "Passport Assistance", 
    "Car & Coach Rentals", "Tempo Traveller", "Wedding Cabs", 
    "Luxury Cabs", "View & Print Flight Ticket"
  ];

  const partnerLinks = [
    "Register Your Hotel", "Register Your Taxi", "Travel Agent Sign Up"
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://www.facebook.com/patratoursandtravels", color: "#3b5998" },
    { icon: <FaXTwitter />, url: "https://x.com/patra_travels", color: "#1da1f2" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/patratravels", color: "#e1306c" },
    { icon: <FaTumblr  />, url: "https://www.tumblr.com/patratravels", color: "#0077b5" },
    { icon: <FaYoutube />, url: "https://www.youtube.com/@PatraTravelsIndia", color: "#ff0000" },
    { icon: <FaPinterest />, url: "https://in.pinterest.com/patratravels/", color: "#ff0000" },

  ];

  return (
    <footer className="bg-black text-white pt-5 pb-2 position-relative" style={{ fontSize: '0.85rem' }}>
      
      <div className="container">
        
        {/* --- TOP SECTION: LINKS & ADDRESS --- */}
        <div className="row g-4 border-bottom border-secondary pb-4 mb-4">
          
          {/* COLUMN 1: COMPANY */}
          <div className="col-lg-2 col-md-4">
            <h6 className="text-uppercase fw-bold mb-4 text-white-50">Company</h6>
            <ul className="list-unstyled">
              {companyLinks.map((link, index) => (
                <li key={index} className="mb-2 d-flex align-items-start">
                  <FaCheck size={10} color={brandOrange} className="mt-1 me-2 flex-shrink-0" />
                  <a href="#" className="text-decoration-none text-secondary hover-orange transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 2: OUR SERVICES */}
          <div className="col-lg-3 col-md-4">
            <h6 className="text-uppercase fw-bold mb-4 text-white-50">Our Services</h6>
            <ul className="list-unstyled">
              {serviceLinks.map((link, index) => (
                <li key={index} className="mb-2 d-flex align-items-start">
                  <FaCheck size={10} color={brandOrange} className="mt-1 me-2 flex-shrink-0" />
                  <a href="#" className="text-decoration-none text-secondary hover-orange transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: PARTNER & PAYMENTS */}
          <div className="col-lg-3 col-md-4">
            {/* Partner */}
            <h6 className="text-uppercase fw-bold mb-4 text-white-50">Partner With Us</h6>
            <ul className="list-unstyled mb-4">
              {partnerLinks.map((link, index) => (
                <li key={index} className="mb-2 d-flex align-items-start">
                  <FaCheck size={10} color={brandOrange} className="mt-1 me-2 flex-shrink-0" />
                  <a href="#" className="text-decoration-none text-secondary hover-orange transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            {/* Payment Options */}
            <h6 className="text-uppercase fw-bold mb-3 text-white-50">Payment Options</h6>
            <div className="bg-white p-3 rounded mb-3">
              <div className="d-flex gap-3 flex-wrap justify-content-center align-items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: '20px', objectFit: 'contain' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" style={{ height: '26px', objectFit: 'contain' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="Rupay" style={{ height: '20px', objectFit: 'contain' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" style={{ height: '22px', objectFit: 'contain' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style={{ height: '18px', objectFit: 'contain' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: '18px', objectFit: 'contain' }} />
                <div className="d-flex align-items-center border px-1 rounded bg-light" style={{height: '25px'}}>
                  <span className="small fw-bold text-secondary" style={{fontSize: '9px'}}>NET BANKING</span>
                </div>
              </div>
            </div>
            
            {/* Payment Support Box */}
            <div className="bg-white text-dark p-2 text-center rounded fw-bold border border-warning">
                <div className="small text-muted" style={{fontSize:'0.75rem'}}>PAYMENT SUPPORT</div>
                <div className="h5 mb-0 text-danger">8337911111</div>
            </div>
            
            <div className="mt-2 text-center bg-white p-2 rounded">
                 <small className="fw-bold text-dark d-block">OFFLINE PAYMENT</small>
                 <div className="text-muted" style={{fontSize: '0.7rem'}}>QR CODE & BANK DETAILS</div>
            </div>
          </div>

          {/* COLUMN 4: ADDRESS */}
          <div className="col-lg-4 col-md-12">
            <h6 className="text-uppercase fw-bold mb-4 text-white-50">Address</h6>
            
            <div className="mb-3">
              <strong className="d-block text-white mb-1">Registered Address:</strong>
              <div className="d-flex text-secondary">
                <FaMapMarkerAlt className="me-2 mt-1 flex-shrink-0" color={brandOrange} />
                <p className="mb-0 small">
                  149B, Ashok Nagar In-front of Allahabad Bank, Near Rajmahal Square, Bhubaneswar – 751009, Odisha, India.
                </p>
              </div>
              <div className="d-flex text-secondary mt-1 ms-4">
                <FaPhoneAlt size={12} className="me-2 mt-1" /> <span>+91-674-2598173</span>
              </div>
            </div>

            <div className="mb-3">
              <strong className="d-block text-white mb-1">Branch Office (New Delhi):</strong>
              <div className="d-flex text-secondary">
                <FaMapMarkerAlt className="me-2 mt-1 flex-shrink-0" color={brandOrange} />
                <p className="mb-0 small">
                  B/4, 3rd Floor, Utkalika Building, State Emporia Complex, Baba Kharag Singh Marg, Connaught Place, New Delhi - 110001
                </p>
              </div>
              <div className="d-flex text-secondary mt-1 ms-4">
                <FaPhoneAlt size={12} className="me-2 mt-1" /> <span>+91-11-23340666</span>
              </div>
            </div>

            <div className="mb-3">
              <strong className="d-block text-white mb-1">Sales Office:</strong>
              <div className="d-flex text-secondary">
                <FaMapMarkerAlt className="me-2 mt-1 flex-shrink-0" color={brandOrange} />
                <p className="mb-0 small">
                  Plot No.38 (Ground Floor), Ashok Nagar, Infront of Sai Swastik Hotel, Near Rajmahal Square, Bhubaneswar - 751009.
                </p>
              </div>
            </div>

            <div className="border-top border-secondary pt-3 mt-3">
              <strong className="d-block text-white mb-2">Support Contact Number:</strong>
              <div className="d-flex flex-column flex-sm-row text-secondary gap-3">
                <span><FaPhoneAlt color={brandOrange} className="me-1"/> +91 83379 11111</span>
                <span><FaPhoneAlt color={brandOrange} className="me-1"/> 1800 120 8464</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: LOGOS --- */}
        <div className="row g-4 mb-4">
          
          {/* Approved By */}
          <div className="col-md-6">
            <h6 className="fw-bold mb-2" style={{color: brandOrange}}>Approved By</h6>
            <small className="text-white-50 d-block mb-3">
              Ministry Of Tourism, Govt. Of India & Department Of Tourism, Govt. Of Odisha
            </small>
            
            <div className="d-flex gap-3 align-items-center flex-wrap">
              {/* Ministry of Tourism */}
              <div className="bg-white p-2 rounded shadow-sm d-flex align-items-center justify-content-center" style={{width: '140px', height: '80px'}}>
                <img 
                  src="https://cdn.imgbin.com/22/4/13/imgbin-agra-government-of-india-ministry-of-tourism-travel-travel-ybR0ixWR5GCiqY2PQtLWLy795.jpg" 
                  alt="Ministry of Tourism" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Odisha Tourism */}
              <div className="bg-white p-2 rounded shadow-sm d-flex align-items-center justify-content-center" style={{width: '140px', height: '80px'}}>
                <img 
                  src="https://odishatourism.gov.in/content/dam/tourism/home/new-logo-2023/Odisha%20State%20Logo%20-%20CMYK-new.png" 
                  alt="Odisha Tourism" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>

          {/* Recognized By */}
          <div className="col-md-6">
            <h6 className="fw-bold mb-2" style={{color: brandOrange}}>Recognized By</h6>
            <small className="text-white-50 d-block mb-3">
              IATO, BMC, EcoTour Odisha, EKTTA
            </small>
            
            <div className="d-flex gap-2 flex-wrap">
              {/* IATO */}
              <div className="bg-white p-1 rounded shadow-sm d-flex align-items-center justify-content-center" style={{width: '80px', height: '60px'}}>
                <img 
                  src="https://www.iato.in/frontend/img/logo.png" 
                  onError={(e) => {e.target.onerror = null; e.target.src="https://placehold.co/70x50?text=IATO"}}
                  alt="IATO" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* BMC */}
              <div className="bg-white p-1 rounded shadow-sm d-flex align-items-center justify-content-center" style={{width: '80px', height: '60px'}}>
                <img 
                  src="https://www.bmc.gov.in/officePortal/images/bmclogo.png"
                  onError={(e) => {e.target.onerror = null; e.target.src="https://placehold.co/70x50?text=BMC"}} 
                  alt="BMC" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* EcoTour Odisha */}
              <div className="bg-white p-1 rounded shadow-sm d-flex align-items-center justify-content-center" style={{width: '80px', height: '60px'}}>
                <img 
                  src="https://www.jhargramtourism.com/gallery/recognition/ecotourodisha-logo.jpg" 
                  alt="EcoTour" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* EKTTA */}
              <div className="bg-white p-1 rounded shadow-sm d-flex align-items-center justify-content-center" style={{width: '80px', height: '60px'}}>
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4P30nvpkE5Tymkkq6LgdaSeMCz-mlRgD1Qw&s" 
                  alt="EKTTA" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM ROW: COPYRIGHT & SOCIAL ICONS --- */}
        <div className="border-top border-secondary pt-3 mt-4">
          <div className="row align-items-center">
            
            {/* Left: Copyright */}
            <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
               <p className="text-secondary mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                Copyright © {currentYear} <strong>PATRA TRAVELS PRIVATE LIMITED</strong> | CIN: U79120OD2026PTC052252
               </p>
               <p className="text-white-50 small mb-0">All Rights Reserved.</p>
            </div>

            {/* Right: Social Icons (Aligned Bottom Right) */}
            <div className="col-md-4">
               <div className="d-flex justify-content-center justify-content-md-end gap-3">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    className="social-icon-circle d-flex align-items-center justify-content-center text-white text-decoration-none"
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      border: '1px solid #555', 
                      transition: '0.3s',
                      backgroundColor: 'rgba(255,255,255,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = social.color;
                      e.currentTarget.style.borderColor = social.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = '#555';
                    }}
                  >
                    <span style={{fontSize: '14px'}}>{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
        
      </div>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <a 
        href="https://wa.me/918337911111" 
        target="_blank"
        rel="noreferrer"
        className="position-fixed bottom-0 end-0 m-4 bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg hover-scale"
        style={{ width: '60px', height: '60px', zIndex: 1050, transition: 'transform 0.2s' }}
      >
        <FaWhatsapp size={35} />
      </a>

      {/* Styles */}
      <style>{`
        .hover-orange:hover {
          color: #ff6b00 !important;
        }
        .hover-scale:hover {
          transform: scale(1.1);
        }
      `}</style>
    </footer>
  );
};

export default Footer;