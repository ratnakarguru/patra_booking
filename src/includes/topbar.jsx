import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  // 1. Updated links to include 'path'
  const navItems = [
    { label: "HOME", path: "/" },
    { label: "FLIGHT", path: "/flight" },
    { label: "HOTEL", path: "/hotels"},
    { label: "CABS", path: "/cabs", hasDropdown: true },
    { label: "CAR RENTALS", path: "/car-rentals", hasDropdown: true },
    { label: "HOLIDAYS", path: "/holidays", hasDropdown: true },
    { label: "FOREX", path: "/forex" },
    { label: "VISA", path: "/visa" },
    { label: "CANCEL RESERVATION", path: "/cancel" },
    { label: "SPECIAL OFFERS", path: "/offers" },
    { label: "TESTIMONIALS", path: "/testimonials" },
    { label: "CONTACT US", path: "/contact" }
  ];

  const brandOrange = '#ff6b00'; 

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: brandOrange }}>
      <div className="container">
        
        <a className="navbar-brand d-lg-none fw-bold" href="/">Patra Travels</a>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="offcanvas" 
          data-bs-target="#leftSidebarMenu" 
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div 
          className="offcanvas offcanvas-start text-bg-dark" 
          id="leftSidebarMenu" 
          style={{ backgroundColor: brandOrange, border: 'none' }}
        >
          
          <div className="offcanvas-header border-bottom border-secondary">
            <h5 className="offcanvas-title fw-bold">PATRA TOURS</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-between flex-grow-1">
              {navItems.map((item, index) => (
                item.hasDropdown ? (
                  <li key={index} className="nav-item dropdown">
                    <a 
                      className="nav-link dropdown-toggle text-white fw-bold" 
                      href="#" 
                      role="button" 
                      data-bs-toggle="dropdown" 
                      style={{ fontSize: '0.75rem' }}
                    >
                      {item.label}
                    </a>
                    <ul className="dropdown-menu border-0 shadow-sm">
                      {/* Add specific sub-links here */}
                      <li><a className="dropdown-item" href={`${item.path}/option1`}>Option 1</a></li>
                      <li><a className="dropdown-item" href={`${item.path}/option2`}>Option 2</a></li>
                    </ul>
                  </li>
                ) : (
                  <li key={index} className="nav-item">
                    <a 
                      className="nav-link text-white fw-bold" 
                      href={item.path} // 2. Link applied here
                      style={{ fontSize: '0.75rem' }}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;