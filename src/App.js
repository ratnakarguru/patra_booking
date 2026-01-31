import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

// Components
import Loader from "./component/loader";
import TopHeader from "./includes/header";
import Navbar from "./includes/topbar";
import Home from "./pages/home";
import Flight from "./pages/flightsec";
import SearchResults from "./pages/searchResults";
import Offer from "./pages/offer";
import Footer from "./includes/footer";
import BookingDetails from "./pages/booking";
import Hotels from "./pages/hotelsec";
import HotelDetails from "./pages/hotelbooking";

// Handles routing + loader logic
function AppContent() {
  const location = useLocation();

  const [loading, setLoading] = useState(location.pathname === "/");

  useEffect(() => {
    if (location.pathname === "/") {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="app">
      <TopHeader />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/flight"
          element={
            <>
              <Flight />
              <Offer />
            </>
          }
        />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/booking" element={<BookingDetails />} />
        <Route
          path="/Hotels"
          element={
            <>
              <Hotels />
              <Offer />
            </>
          }
        />
        <Route path="/Hotel_details" element={<HotelDetails />} />
      </Routes>

      <Footer />
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
