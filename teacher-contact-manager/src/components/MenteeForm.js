import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormDataContext } from '../App'; // Import the shared FormDataContext

const MenteeForm = ({ menteeNumber }) => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext); // Use shared context
  const [localFormData, setLocalFormData] = useState(formData.menteeDetails || {
    name: '',
    rollNumber: '',
    contactNumber: '',
    email: '',
    address: '',
    admissionMode: '',
    accommodation: '',
    sslcMarks: '',
    hscMarks: '',
    diplomaMarks: '',
    gpa1: '',
    gpa2: '',
    gpa3: '',
    gpa4: '',
    gpa5: '',
    gpa6: '',
    gpa7: '',
    gpa8: '',
    cgpa: '',
    menteeSignature: '',
    mentorSignature: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData({ ...localFormData, [name]: value });
  };

  const handleNextPage = () => {
    updateFormData('menteeDetails', localFormData); // Save data to context
    navigate('/menteeperformanceform'); // Navigate to the performance form page
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h3>Mentee {menteeNumber} Details</h3>
          <form>
            <div className="form-group mb-3">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={localFormData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="rollNumber">Roll Number:</label>
              <input
                type="text"
                name="rollNumber"
                className="form-control"
                value={localFormData.rollNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="contactNumber">Contact Number:</label>
              <input
                type="text"
                name="contactNumber"
                className="form-control"
                value={localFormData.contactNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email ID:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={localFormData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="address">Communication Address with Pincode:</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={localFormData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="admissionMode">Mode of Admission:</label>
              <select
                name="admissionMode"
                className="form-control"
                value={localFormData.admissionMode}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Counseling">Counseling</option>
                <option value="Management">Management</option>
                <option value="Sports Quota">Sports Quota</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="accommodation">Accommodation Details:</label>
              <select
                name="accommodation"
                className="form-control"
                value={localFormData.accommodation}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Day scholar">Day scholar</option>
                <option value="Hosteller">Hosteller</option>
                <option value="Outside Room">Outside Room</option>
                <option value="Relative Home">Relative Home</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="sslcMarks">% Marks in SSLC:</label>
              <input
                type="number"
                name="sslcMarks"
                className="form-control"
                value={localFormData.sslcMarks}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="hscMarks">% Marks in HSC:</label>
              <input
                type="number"
                name="hscMarks"
                className="form-control"
                value={localFormData.hscMarks}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="diplomaMarks">% Marks in Diploma:</label>
              <input
                type="number"
                name="diplomaMarks"
                className="form-control"
                value={localFormData.diplomaMarks}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="gpa1">I Sem GPA:</label>
              <input
                type="number"
                name="gpa1"
                className="form-control"
                value={localFormData.gpa1}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="gpa2">II Sem GPA:</label>
              <input
                type="number"
                name="gpa2"
                className="form-control"
                value={localFormData.gpa2}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="gpa3">III Sem GPA:</label>
              <input
                type="number"
                name="gpa3"
                className="form-control"
                value={localFormData.gpa3}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="gpa4">IV Sem GPA:</label>
              <input
                type="number"
                name="gpa4"
                className="form-control"
                value={localFormData.gpa4}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="gpa5">V Sem GPA:</label>
              <input
                type="number"
                name="gpa5"
                className="form-control"
                value={localFormData.gpa5}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="gpa6">VI Sem GPA:</label>
              <input
                type="number"
                name="gpa6"
                className="form-control"
                value={localFormData.gpa6}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="gpa7">VII Sem GPA:</label>
              <input
                type="number"
                name="gpa7"
                className="form-control"
                value={localFormData.gpa7}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="gpa8">VIII Sem GPA:</label>
              <input
                type="number"
                name="gpa8"
                className="form-control"
                value={localFormData.gpa8}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="cgpa">CGPA:</label>
              <input
                type="number"
                name="cgpa"
                className="form-control"
                value={localFormData.cgpa}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="menteeSignature">Mentee Signature with Date:</label>
              <input
                type="text"
                name="menteeSignature"
                className="form-control"
                value={localFormData.menteeSignature}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mentorSignature">Mentor Name:</label>
              <input
                type="text"
                name="mentorSignature"
                className="form-control"
                value={localFormData.mentorSignature}
                onChange={handleChange}
              />
            </div>

            <button type="button" className="btn btn-primary" onClick={handleNextPage}>Next Page</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenteeForm;
