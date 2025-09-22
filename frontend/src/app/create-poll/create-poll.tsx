import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './create-poll.scss';

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface CreatePollRequest {
  title: string;
  description: string;
  questions: Question[];
}

export function CreatePoll() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pollTitle, setPollTitle] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', options: ['', ''] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pollId, setPollId] = useState<string | null>(null);

  // Initialize edit mode if coming from view-polls
  useEffect(() => {
    if (location.state?.editMode && location.state?.pollData) {
      const pollData = location.state.pollData;
      setIsEditMode(true);
      setPollId(pollData.id);
      setPollTitle(pollData.title);
      setPollDescription(pollData.description);
      setQuestions(pollData.questions.map((q: any) => ({
        id: q.id || Date.now().toString(),
        text: q.text,
        options: q.options
      })));
    }
  }, [location.state]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      options: ['', '']
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const updateQuestion = (questionId: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, text } : q
    ));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { 
        ...q, 
        options: q.options.filter((_, index) => index !== optionIndex)
      } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options.map((option, index) => 
          index === optionIndex ? value : option
        )
      } : q
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!pollTitle.trim()) {
      alert('Please enter a poll title');
      setIsLoading(false);
      return;
    }

    if (questions.some(q => !q.text.trim())) {
      alert('Please fill in all questions');
      setIsLoading(false);
      return;
    }

    if (questions.some(q => q.options.some(opt => !opt.trim()))) {
      alert('Please fill in all options');
      setIsLoading(false);
      return;
    }

    try {
      const pollData: CreatePollRequest = {
        title: pollTitle,
        description: pollDescription,
        questions: questions.map(q => ({
          text: q.text,
          options: q.options
        }))
      };

      const url = isEditMode 
        ? `http://localhost:8081/api/polls/${pollId}`
        : 'http://localhost:8081/api/polls';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} poll`);
      }

      const result = await response.json();
      console.log(`Poll ${isEditMode ? 'updated' : 'created'} successfully:`, result);
      
      alert(`Poll ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/dashboard');
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} poll:`, error);
      alert(`Error ${isEditMode ? 'updating' : 'creating'} poll. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="create-poll">
      <header className="create-poll-header">
        <h1>{isEditMode ? 'Edit Poll' : 'Create New Poll'}</h1>
        <button onClick={handleCancel} className="cancel-button">
          Back to Dashboard
        </button>
      </header>

      <main className="create-poll-content">
        <form onSubmit={handleSubmit} className="poll-form">
          <div className="form-section">
            <h2>Poll Information</h2>
            <div className="form-group">
              <label htmlFor="pollTitle">Poll Title *</label>
              <input
                type="text"
                id="pollTitle"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                placeholder="Enter poll title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pollDescription">Description</label>
              <textarea
                id="pollDescription"
                value={pollDescription}
                onChange={(e) => setPollDescription(e.target.value)}
                placeholder="Enter poll description (optional)"
                rows={3}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h2>Questions</h2>
              <button type="button" onClick={addQuestion} className="add-question-btn">
                + Add Question
              </button>
            </div>

            {questions.map((question, questionIndex) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <h3>Question {questionIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="remove-question-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Question Text *</label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, e.target.value)}
                    placeholder="Enter your question"
                    required
                  />
                </div>

                <div className="options-section">
                  <div className="options-header">
                    <label>Answer Options *</label>
                    <button
                      type="button"
                      onClick={() => addOption(question.id)}
                      className="add-option-btn"
                    >
                      + Add Option
                    </button>
                  </div>

                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-input">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(question.id, optionIndex)}
                          className="remove-option-btn"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading 
                ? (isEditMode ? 'Updating Poll...' : 'Creating Poll...') 
                : (isEditMode ? 'Update Poll' : 'Create Poll')
              }
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreatePoll;
