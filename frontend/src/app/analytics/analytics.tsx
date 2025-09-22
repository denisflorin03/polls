import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './analytics.scss';

interface PollStats {
  id: string;
  title: string;
  totalResponses: number;
  questions: QuestionStats[];
}

interface QuestionStats {
  id: string;
  text: string;
  options: OptionStats[];
}

interface OptionStats {
  text: string;
  count: number;
  percentage: number;
}

export function Analytics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PollStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState<PollStats | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
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
        
        // Convert polls to analytics format
        const analyticsData: PollStats[] = pollsData.map((poll: any) => ({
          id: poll.id.toString(),
          title: poll.title,
          totalResponses: poll.totalResponses || 0,
          questions: poll.questions.map((q: any) => ({
            id: q.id.toString(),
            text: q.text,
            options: q.options.map((option: string) => ({
              text: option,
              count: 0, // TODO: Get real response counts from backend
              percentage: 0
            }))
          }))
        }));
        
        setStats(analyticsData);
      } catch (error) {
        console.error('Error loading analytics:', error);
        alert('Error loading analytics. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewPollDetails = (poll: PollStats) => {
    setSelectedPoll(poll);
  };

  const handleCloseModal = () => {
    setSelectedPoll(null);
  };

  const getTotalPolls = () => stats.length;
  const getTotalResponses = () => stats.reduce((sum, poll) => sum + poll.totalResponses, 0);
  const getAverageResponses = () => {
    if (stats.length === 0) return 0;
    return Math.round(getTotalResponses() / stats.length);
  };

  const getMostPopularOption = (question: QuestionStats) => {
    return question.options.reduce((max, option) => 
      option.count > max.count ? option : max
    );
  };

  if (isLoading) {
    return (
      <div className="analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <header className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <button onClick={handleBackToDashboard} className="back-button">
          Back to Dashboard
        </button>
      </header>

      <main className="analytics-content">
        {/* Overview Stats */}
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Total Polls</h3>
              <p className="stat-number">{getTotalPolls()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Responses</h3>
              <p className="stat-number">{getTotalResponses()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>Avg Responses</h3>
              <p className="stat-number">{getAverageResponses()}</p>
            </div>
          </div>
        </div>

        {/* Polls List */}
        <div className="polls-analytics">
          <h2>Poll Analytics</h2>
          
          {stats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No analytics data</h3>
              <p>Create some polls and collect responses to see analytics here.</p>
              <button onClick={() => navigate('/create-poll')} className="create-poll-btn">
                Create Your First Poll
              </button>
            </div>
          ) : (
            <div className="polls-list">
              {stats.map((poll) => (
                <div key={poll.id} className="poll-analytics-card">
                  <div className="poll-header">
                    <h3>{poll.title}</h3>
                    <button 
                      onClick={() => handleViewPollDetails(poll)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>
                  </div>
                  
                  <div className="poll-summary">
                    <div className="summary-stat">
                      <span className="label">Total Responses:</span>
                      <span className="value">{poll.totalResponses}</span>
                    </div>
                    <div className="summary-stat">
                      <span className="label">Questions:</span>
                      <span className="value">{poll.questions.length}</span>
                    </div>
                  </div>

                  <div className="quick-insights">
                    <h4>Quick Insights:</h4>
                    {poll.questions.map((question, index) => {
                      const mostPopular = getMostPopularOption(question);
                      return (
                        <div key={question.id} className="insight">
                          <strong>Q{index + 1}:</strong> Most popular answer is "{mostPopular.text}" 
                          ({mostPopular.percentage}%)
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detailed Analytics Modal */}
      {selectedPoll && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPoll.title} - Detailed Analytics</h2>
              <button onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            
            <div className="modal-body">
              <div className="poll-overview">
                <div className="overview-item">
                  <strong>Total Responses:</strong> {selectedPoll.totalResponses}
                </div>
                <div className="overview-item">
                  <strong>Questions:</strong> {selectedPoll.questions.length}
                </div>
              </div>

              {selectedPoll.questions.map((question, questionIndex) => (
                <div key={question.id} className="question-analytics">
                  <h3>Question {questionIndex + 1}: {question.text}</h3>
                  
                  <div className="options-analytics">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-bar">
                        <div className="option-info">
                          <span className="option-text">{option.text}</span>
                          <span className="option-stats">
                            {option.count} responses ({option.percentage}%)
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${option.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="modal-footer">
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

export default Analytics;
