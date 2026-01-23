import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // Fixed imports
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

// Components
import Loader from "./component/loader";
import TopHeader from "./includes/header";
import Navbar from "./includes/topbar";
import HeroSection from "./pages/home";
import SearchResults from "./pages/searchResults";
import Offer from "./pages/offer";
import Footer from "./includes/footer";
import BookingDetails from "./pages/booking";

// 1. Create a child component to handle the Logic
function AppContent() {
  const location = useLocation();
  
  // Initialize loading: true ONLY if we land on Home ('/')
  const [loading, setLoading] = useState(location.pathname === "/");

  useEffect(() => {
    // If we are on Home page, run the timer
    if (location.pathname === "/") {
      // Optional: If you want the loader to show EVERY time you go back home, uncomment the line below:
      // setLoading(true); 
      
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // If on any other page, ensure loading is off immediately
      setLoading(false);
    }
  }, [location.pathname]);

  // Show Loader only if loading state is true
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="app">
      <TopHeader />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <Offer />
            </>
          }
        />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/booking" element={<BookingDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

// 2. Main App Component wraps everything in Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;