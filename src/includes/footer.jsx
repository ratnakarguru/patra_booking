import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  FaCheck, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaWhatsapp,
  FaEnvelope
} from 'react-icons/fa';

const Footer = () => {
  const brandOrange = '#ff6b00';

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

  return (
    <footer className="bg-black text-white pt-5 pb-3 position-relative" style={{ fontSize: '0.85rem' }}>
      
      <div className="container">
        
        {/* --- TOP SECTION: LINKS & ADDRESS --- */}
        <div className="row g-4 border-bottom border-secondary pb-5 mb-4">
          
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

            {/* Payment Options Placeholder */}
          <h6 className="text-uppercase fw-bold mb-3 text-white-50">Payment Options</h6>
<div className="bg-white p-3 rounded mb-3">
  {/* Flex container for the icons */}
  <div className="d-flex gap-3 flex-wrap justify-content-center align-items-center">
    
    {/* VISA */}
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
      alt="Visa" 
      style={{ height: '24px', objectFit: 'contain' }} 
    />

    {/* MASTERCARD */}
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" 
      alt="Mastercard" 
      style={{ height: '30px', objectFit: 'contain' }} 
    />

    {/* RUPAY */}
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" 
      alt="Rupay" 
      style={{ height: '24px', objectFit: 'contain' }} 
    />

    {/* GOOGLE PAY */}
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" 
      alt="GPay" 
      style={{ height: '26px', objectFit: 'contain' }} 
    />

    {/* PAYTM */}
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" 
      alt="Paytm" 
      style={{ height: '20px', objectFit: 'contain' }} 
    />
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" 
      alt="UPI" 
      style={{ height: '20px', objectFit: 'contain' }} 
    />
    
    {/* NET BANKING (Generic Icon) */}
    <div className="d-flex align-items-center border px-1 rounded bg-light" style={{height: '30px'}}>
      <span className="small fw-bold text-secondary" style={{fontSize: '10px'}}>NET BANKING</span>
    </div>

  </div>
</div>
            
            {/* Number Box */}
            <div className="bg-white text-dark p-2 text-center rounded fw-bold border border-warning">
                <div className="small text-muted">PAYMENT SUPPORT</div>
                <div className="h5 mb-0 text-danger">8337911111</div>
            </div>
            
            <div className="mt-3 text-center bg-white p-2 rounded">
                 <small className="fw-bold text-dark">OFFLINE PAYMENT</small>
                 <div className="small text-muted">QR CODE & BANK DETAILS</div>
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
              <div className="d-flex text-secondary gap-3">
                <span><FaPhoneAlt color={brandOrange} className="me-1"/> +91 83379 11111</span>
                <span><FaPhoneAlt color={brandOrange} className="me-1"/> 1800 120 8464</span>
              </div>
            </div>

          </div>
        </div>

       {/* --- BOTTOM SECTION: LOGOS --- */}
<div className="row align-items-start mt-4">
  
  {/* Approved By */}
  <div className="col-md-6 mb-4 mb-md-0">
    <h6 className="fw-bold text-warning mb-2" style={{color: '#ff6b00'}}>Approved By</h6>
    <small className="text-bold d-block mb-3">
      Ministry Of Tourism, Govt. Of India & Department Of Tourism, Govt. Of Odisha
    </small>
    
    <div className="d-flex gap-3 align-items-center">
      
      {/* Ministry of Tourism (Incredible India) */}
      <div className="bg-white p-2 rounded shadow-sm d-flex align-items-center justify-content-center" style={{width: '150px', height: '90px'}}>
        <img 
          src="https://cdn.imgbin.com/22/4/13/imgbin-agra-government-of-india-ministry-of-tourism-travel-travel-ybR0ixWR5GCiqY2PQtLWLy795.jpg" 
          alt="Ministry of Tourism" 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'fill' }}
        />
      </div>

      {/* Odisha Tourism */}
      <div className="bg-white p-2 rounded shadow-sm d-flex align-items-center justify-content-center" style={{width: '150px', height: '90px'}}>
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
    <h6 className="fw-bold text-warning mb-2" style={{color: '#ff6b00'}}>Recognized By</h6>
    <small className="text-bold d-block mb-3">
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

      {/* BMC (Bhubaneswar Municipal Corporation) */}
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

      </div>

      {/* Inline Styles for Hover Effects */}
      <style jsx>{`
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