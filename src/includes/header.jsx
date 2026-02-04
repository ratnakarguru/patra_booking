import React from 'react';
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
// If using react-icons v4+, you might use FaXTwitter from 'react-icons/fa6' for the exact X logo
import 'bootstrap/dist/css/bootstrap.min.css';

const TopHeader = () => {
  const brandOrange = '#fd7e14'; // Matches the orange in the image
  const brandGreen = '#25d366';  // WhatsApp Green

  return (
    <header className="bg-white py-3 border-bottom d-none d-lg-block font-sans">
      <div className="container">
        <div className="row align-items-center">
          
          {/* =======================
              LEFT SECTION: LOGO 
             ======================= */}
          <div className="col-lg-5">
            <div className="d-flex flex-column">
              <h1 className="h2 fw-bold mb-0 lh-1" style={{ letterSpacing: '-1px' }}>
                <span  style={{ color: brandOrange ,fontSize: '3.85rem' }}>P</span>
                <span style={{ color: brandOrange }}>ATRA</span>
                {' '}
                <span className="text-dark">TRAVELS PVT. LTD.</span>
              </h1>
              <p className="text-secondary mb-0 mt-1" style={{ fontSize: '0.85rem' }}>
                Recognized by Ministry of Tourism, Govt. of India
              </p>
            </div>
          </div>

          {/* =======================
              RIGHT SECTION: INFO
             ======================= */}
          <div className="col-lg-7">
            <div className="d-flex justify-content-between align-items-start">
              
              {/* --- Middle Column: Support Numbers --- */}
              <div className="d-flex flex-column justify-content-center ps-4 ">
                <span className="text-secondary text-uppercase fw-semibold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                  Customer Support (Toll Free)
                </span>
                
                {/* Orange Phone Line */}
                <div className="d-flex align-items-center mb-1">
                  <div className="rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                       style={{ backgroundColor: brandOrange, width: '24px', height: '24px' }}>
                    <FaPhoneAlt size={12} />
                  </div>
                  <span className="fw-bold h5 mb-0" style={{ color: brandOrange }}>
                    1800 120 8464
                  </span>
                </div>

                {/* WhatsApp Line */}
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

              {/* --- Far Right Column: Socials & Email --- */}
              <div className="d-flex flex-column align-items-end ms-4">
                
                {/* Social Icons Row */}
                <div className="d-flex gap-3 mb-2 text-dark">
                  <a href="https://www.facebook.com/patratoursandtravels" className="text-dark"><FaFacebookF /></a>
                  <a href="https://x.com/patra_travels" className="text-dark"><FaXTwitter /></a> 
                  <a href="https://www.instagram.com/patratravels" className="text-dark"><FaInstagram /></a>
                  <a href="https://www.youtube.com/@PatraTravelsIndia" className="text-dark"><FaYoutube /></a>
                  <a href="https://in.pinterest.com/patratravels/" className="text-dark"><FaPinterest /></a>
                  <a href="https://www.tumblr.com/patratravels" className="text-dark"><FaTumblr /></a>
                </div>

                {/* Email Address */}
                <a href="mailto:sales@patratravels.com" className="text-dark text-decoration-none small fw-medium">
                  sales@patratravels.com
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default TopHeader;