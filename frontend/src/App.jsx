import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage.jsx';
import JobsPage from './jobsPage.jsx';
import '/fonts/ubuntu.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1 
          style={{
            textAlign: "center",                    
            fontFamily: "'Ubuntu', sans-serif"       
          }}
          >
          Job Portal</h1>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/jobs" element={<JobsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;