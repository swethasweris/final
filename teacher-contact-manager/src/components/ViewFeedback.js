import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/view-feedback');
        setFeedbacks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to retrieve feedback');
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className="container">
      <h2 className="mt-4">Anonymous Feedback</h2>
      {loading ? (
        <p>Loading feedback...</p>
      ) : (
        feedbacks.map((feedbackEntry, index) => (
          <div key={index} className="card my-3">
            <div className="card-body">
              <h5>Student: {feedbackEntry.username}</h5>
              <ul>
                {feedbackEntry.feedbacks.map((feedback, i) => (
                  <li key={i}>
                    {feedback.message} (submitted on {new Date(feedback.timestamp).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewFeedback;
