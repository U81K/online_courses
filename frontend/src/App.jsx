import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useAuth } from "./provider/authProvider";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const { isAuthenticated } = useAuth();

  console.log("Auth state:", { isAuthenticated }); // Add this for debugging

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard"/>} />
          {/* <Route path="/login" element={<Login/>}/> */}
          <Route path="/dashboard" element={<Dashboard/>} />
          {/* <Route path="/profile" element={<h1>profile route</h1>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
