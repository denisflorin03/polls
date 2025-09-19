import React from 'react';
import './dashboard.scss';

export function Dashboard() {
  const handleLogout = () => {
    // Simple logout for now
    window.location.href = '/#/login';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Polls Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to your Polls Dashboard!</h2>
          <p>You have successfully logged in. This is where you can manage your polls and surveys.</p>
          
          <div className="quick-actions">
            <button className="action-button primary">
              Create New Poll
            </button>
            <button className="action-button secondary">
              View My Polls
            </button>
            <button className="action-button secondary">
              Analytics
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
