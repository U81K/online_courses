import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header>
        <h1>Online Courses Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      
      <div className="welcome-section">
        <h2>Welcome, {user?.name}!</h2>
        <p>Email: {user?.email}</p>
      </div>
      
      <div className="content">
        <div className="card">
          <h3>Your Courses</h3>
          <p>No courses enrolled yet.</p>
        </div>
        
        <div className="card">
          <h3>Available Courses</h3>
          <p>No courses available at the moment.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
