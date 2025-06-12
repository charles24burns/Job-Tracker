import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage.jsx';
import JobsPage from './jobsPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Job Portal</h1>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/jobs" element={<JobsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;