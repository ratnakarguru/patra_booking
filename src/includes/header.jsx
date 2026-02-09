import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  FaPhoneAlt, 
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterest
} from 'react-icons/fa';
// Ensure you have react-icons v5+ installed for fa6
import { FaXTwitter, FaTumblr } from "react-icons/fa6"; 

const Header = () => {
  const brandOrange = '#fd7e14'; // Matches the orange in the image
  const brandGreen = '#25d366';  // WhatsApp Green

  return (
    <header className="font-sans">
      
      {/* =======================
          1. TOP INFO SECTION 
          (Your new code)
         ======================= */}
      <div className="bg-white py-3 border-bottom d-none d-lg-block">
        <div className="container">
          <div className="row align-items-center">
            
            {/* LEFT: LOGO & MINISTRY TEXT */}
            <div className="col-lg-5">
              <div className="d-flex flex-column">
                <h1 className="h2 fw-bold mb-0 lh-1" style={{ letterSpacing: '-1px' }}>
                  <span style={{ color: brandOrange, fontSize: '3.85rem' }}>P</span>
                  <span style={{ color: brandOrange }}>ATRA</span>
                  {' '}
                  <span className="text-dark">TRAVELS PVT. LTD.</span>
                </h1>
                <p className="text-secondary mb-0 mt-1" style={{ fontSize: '0.85rem' }}>
                  Recognized by Ministry of Tourism, Govt. of India
                </p>
              </div>
            </div>

            {/* RIGHT: CONTACT & SOCIALS */}
            <div className="col-lg-7">
              <div className="d-flex justify-content-between align-items-start">
                
                {/* Middle: Support Numbers */}
                <div className="d-flex flex-column justify-content-center ps-4">
                  <span className="text-secondary text-uppercase fw-semibold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                    Customer Support (Toll Free)
                  </span>
                  
                  {/* Phone */}
                  <div className="d-flex align-items-center mb-1">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                         style={{ backgroundColor: brandOrange, width: '24px', height: '24px' }}>
                      <FaPhoneAlt size={12} />
                    </div>
                    <span className="fw-bold h5 mb-0" style={{ color: brandOrange }}>
                      1800 120 8464
                    </span>
                  </div>

                  {/* WhatsApp */}
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                         style={{ backgroundColor: brandGreen, width: '24px', height: '24px' }}>
                      <FaWhatsapp size={14} />
                    </div>
                    <span className="fw-bold text-dark h6 mb-0">
                      +91 83379 11111
                    </span>
                  </div>
                </div>

                {/* Far Right: Socials & Email */}
                <div className="d-flex flex-column align-items-end ms-4">
                  <div className="d-flex gap-3 mb-2 text-dark">
                    <a href="https://www.facebook.com/patratoursandtravels" className="text-dark"><FaFacebookF /></a>
                    <a href="https://x.com/patra_travels" className="text-dark"><FaXTwitter /></a> 
                    <a href="https://www.instagram.com/patratravels" className="text-dark"><FaInstagram /></a>
                    <a href="https://www.youtube.com/@PatraTravelsIndia" className="text-dark"><FaYoutube /></a>
                    <a href="https://in.pinterest.com/patratravels/" className="text-dark"><FaPinterest /></a>
                    <a href="https://www.tumblr.com/patratravels" className="text-dark"><FaTumblr /></a>
                  </div>
                  <a href="mailto:sales@patratravels.com" className="text-dark text-decoration-none small fw-medium">
                    sales@patratravels.com
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          2. NAVIGATION BAR 
          (The Orange Menu)
         ======================= */}
      
      
    </header>
  );
};

export default Header;