import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [mentorEmail, setMentorEmail] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('mentorEmail', mentorEmail);
    formData.append('studentEmail', studentEmail);
    formData.append('file1', file1);
    formData.append('file2', file2);
    formData.append('file3', file3);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Upload Documents</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="mentorEmail">Mentor Email:</label>
              <input
                type="email"
                id="mentorEmail"
                className="form-control"
                value={mentorEmail}
                onChange={(e) => setMentorEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="studentEmail">Student Email:</label>
              <input
                type="email"
                id="studentEmail"
                className="form-control"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="file1">Upload File 1:</label>
              <input
                type="file"
                id="file1"
                className="form-control"
                onChange={(e) => handleFileChange(e, setFile1)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="file2">Upload File 2:</label>
              <input
                type="file"
                id="file2"
                className="form-control"
                onChange={(e) => handleFileChange(e, setFile2)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="file3">Upload File 3:</label>
              <input
                type="file"
                id="file3"
                className="form-control"
                onChange={(e) => handleFileChange(e, setFile3)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
