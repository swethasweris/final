import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch username from localStorage or server
    const storedUsername = localStorage.getItem('username'); // Assume username is stored in local storage after login
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) {
      setMessage('Please enter your feedback before submitting');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/studentdashboard', {
        feedback,
        username,
      });
      setMessage('Feedback submitted successfully!');
      setFeedback(''); // Clear feedback field after submission
    } catch (error) {
      setMessage('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{
      backgroundImage: 'url(/images/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Student Dashboard</h2>
          <h5 className="text-center mb-4">
            Welcome, <span className="text-primary">{username}</span>
          </h5>

          <form onSubmit={handleFeedbackSubmit}>
            <div className="mb-3">
              <label htmlFor="feedback" className="form-label">Anonymous Feedback</label>
              <textarea
                className="form-control"
                id="feedback"
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                placeholder="Type your feedback here..."
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              <i className="fas fa-paper-plane me-2"></i>Submit Feedback
            </button>
          </form>

          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
