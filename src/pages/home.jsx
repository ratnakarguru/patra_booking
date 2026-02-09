// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <div 
      className="App d-flex justify-content-center align-items-center vh-100 text-white text-center" 
      style={{ backgroundColor: '#ffe4c4' }}
    >
      <div>
        {/* Added a slight shadow for better visibility against the light background */}
        <h1 className="display-1 fw-bold text-dark">
          PATRA TRAVELS
        </h1>
        <p className="fs-4 mt-3 text-dark">
          Welcome to your journey!
        </p>
      </div>
    </div>
  );
}

export default App;