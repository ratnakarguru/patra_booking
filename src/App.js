import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Loader from "./component/loader";
import TopHeader from "./includes/header";
import Navbar from "./includes/topbar";
import HeroSection from "./pages/home";
import SearchResults from "./pages/searchResults";
import Offer from "./pages/offer";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate page load time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <div className="app">
        <TopHeader />
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/results" element={<SearchResults />} />
        </Routes>
        <Offer />
      </div>
    </Router>
  );
}

export default App;
