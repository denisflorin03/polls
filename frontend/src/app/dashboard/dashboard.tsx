import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.scss';

export function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('polls_auth_token');
    // Redirect to login
    navigate('/login');
  };

  const handleCreatePoll = () => {
    navigate('/create-poll');
  };

  const handleViewPolls = () => {
    navigate('/view-polls');
  };

  const handleAnalytics = () => {
    navigate('/analytics');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Polls Dashboard</h1>
        <button onClick={handleLogout} className="logout-button" disabled={isLoading}>
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to your Polls Dashboard!</h2>
          <p>You have successfully logged in. This is where you can manage your polls and surveys.</p>
          
          <div className="quick-actions">
            <button 
              className="action-button primary" 
              onClick={handleCreatePoll}
              disabled={isLoading}
            >
              Create New Poll
            </button>
            <button 
              className="action-button secondary" 
              onClick={handleViewPolls}
              disabled={isLoading}
            >
              View My Polls
            </button>
            <button 
              className="action-button secondary" 
              onClick={handleAnalytics}
              disabled={isLoading}
            >
              Analytics
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
