import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './view-polls.scss';

interface Poll {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  totalResponses: number;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  options: string[];
}

export function ViewPolls() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  useEffect(() => {
    const loadPolls = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch('http://localhost:8081/api/polls/my-polls', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch polls');
        }

        const pollsData = await response.json();
        setPolls(pollsData);
      } catch (error) {
        console.error('Error loading polls:', error);
        alert('Error loading polls. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPolls();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewPoll = (poll: Poll) => {
    setSelectedPoll(poll);
  };

  const handleCloseModal = () => {
    setSelectedPoll(null);
  };

  const handleDeletePoll = async (pollId: string) => {
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8081/api/polls/${pollId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete poll');
        }

        setPolls(polls.filter(poll => poll.id !== pollId));
        alert('Poll deleted successfully!');
      } catch (error) {
        console.error('Error deleting poll:', error);
        alert('Error deleting poll. Please try again.');
      }
    }
  };

  const handleEditPoll = (poll: Poll) => {
    // Navigate to edit poll page with poll data
    navigate('/create-poll', { 
      state: { 
        editMode: true, 
        pollData: poll 
      } 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="view-polls">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your polls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-polls">
      <header className="view-polls-header">
        <h1>My Polls</h1>
        <div className="header-actions">
          <button onClick={handleBackToDashboard} className="back-button">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/create-poll')} className="create-button">
            Create New Poll
          </button>
        </div>
      </header>

      <main className="view-polls-content">
        {polls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2>No polls yet</h2>
            <p>You haven't created any polls yet. Start by creating your first poll!</p>
            <button onClick={() => navigate('/create-poll')} className="create-first-poll-btn">
              Create Your First Poll
            </button>
          </div>
        ) : (
          <div className="polls-grid">
            {polls.map((poll) => (
              <div key={poll.id} className="poll-card">
                <div className="poll-header">
                  <h3>{poll.title}</h3>
                  <div className="poll-actions">
                    <button 
                      onClick={() => handleViewPoll(poll)}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => handleEditPoll(poll)}
                      className="action-btn edit-btn"
                      title="Edit Poll"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeletePoll(poll.id)}
                      className="action-btn delete-btn"
                      title="Delete Poll"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <p className="poll-description">{poll.description}</p>
                
                <div className="poll-stats">
                  <div className="stat">
                    <span className="stat-label">Questions:</span>
                    <span className="stat-value">{poll.questions.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Responses:</span>
                    <span className="stat-value">{poll.totalResponses}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Created:</span>
                    <span className="stat-value">{formatDate(poll.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Poll Details Modal */}
      {selectedPoll && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPoll.title}</h2>
              <button onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            
            <div className="modal-body">
              <p className="poll-description">{selectedPoll.description}</p>
              
              <div className="poll-info">
                <div className="info-item">
                  <strong>Created:</strong> {formatDate(selectedPoll.createdAt)}
                </div>
                <div className="info-item">
                  <strong>Total Responses:</strong> {selectedPoll.totalResponses}
                </div>
                <div className="info-item">
                  <strong>Questions:</strong> {selectedPoll.questions.length}
                </div>
              </div>

              <div className="questions-section">
                <h3>Questions</h3>
                {selectedPoll.questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <h4>Question {index + 1}: {question.text}</h4>
                    <div className="options-list">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option-item">
                          {optionIndex + 1}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={() => handleEditPoll(selectedPoll)} className="edit-btn">
                Edit Poll
              </button>
              <button onClick={handleCloseModal} className="close-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPolls;
