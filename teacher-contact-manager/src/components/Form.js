import React, { useState, useContext } from 'react';
import { FormDataContext } from '../App'; // Import the shared FormDataContext
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Form = () => {
  const { formData, updateFormData } = useContext(FormDataContext); // Access shared context
  const [localFormData, setLocalFormData] = useState(formData.finalDetails || {
    areaOfInterest: '',
    softSkills: '',
    placementOrCareer: '',
    workshopsAttended: '',
    papersPresented: '',
    journal: '',
    conference: '',
    symposium: '',
    projectsExhibited: '',
    internationalLevel: '',
    nationalLevel: '',
    patentsFiled: '',
    professionalMemberships: '',
    coCurricularParticipation: '',
    extraCurricularParticipation: '',
    achievements: '',
    uniqueness: '',
    strength: '',
    weakness: '',
    menteeSignature: '',
    mentorSignature: ''
  });

  const navigate = useNavigate(); // Initialize navigate for page navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData({ ...localFormData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData('finalDetails', localFormData); // Save final form details
  
    // Combine all form data from context
    const fullData = {
      ...formData.menteeDetails,
      ...formData.performanceDetails,
      ...localFormData
    };
  
    // Generate PDF using jsPDF
    const doc = new jsPDF();
    let yOffset = 10; // Initial yOffset
    const lineHeight = 7; // Reduced line height to fit more text
    const margin = 10; // Left margin
    const maxY = 280; // Max Y before a page break is needed (adjusted)
    const fontSize = 10; // Default font size
  
    doc.setFontSize(fontSize); // Set font size for the document
  
    // Loop through the data and add it to the PDF
    Object.entries(fullData).forEach(([key, value], index) => {
      if (key.startsWith('course')) {
        if (typeof value === 'string') {
          if (yOffset + lineHeight > maxY) {
            doc.addPage();
            yOffset = 10;
          }
  
          doc.text(`${key}: ${value}`, margin, yOffset);
          yOffset += lineHeight;
        } else if (typeof value === 'object') {
          const { courseName, cat1, cat2, cat3, endSem } = value;
          const courseDetails = `Course Name: ${courseName}\nCAT 1: ${cat1}\nCAT 2: ${cat2}\nCAT 3: ${cat3}\nEnd Semester: ${endSem}`;
  
          if (yOffset + lineHeight * 4 > maxY) {
            doc.addPage();
            yOffset = 10;
          }
  
          doc.text(`${key}: \n${courseDetails}`, margin, yOffset);
          yOffset += lineHeight * 4;
        }
      } else {
        const text = `${key.replace(/([A-Z])/g, ' $1')}: ${value}`;
  
        if (yOffset + lineHeight > maxY) {
          doc.addPage();
          yOffset = 10;
        }
  
        doc.text(text, margin, yOffset);
        yOffset += lineHeight;
      }
    });
  
    doc.save('mentee_details.pdf');
  
    navigate('/upload');
  };
  
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Final Mentee Details</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="areaOfInterest">Area of Interest:</label>
              <input
                type="text"
                id="areaOfInterest"
                className="form-control"
                name="areaOfInterest"
                value={localFormData.areaOfInterest}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="softSkills">Soft Skills:</label>
              <input
                type="text"
                id="softSkills"
                className="form-control"
                name="softSkills"
                value={localFormData.softSkills}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="placementOrCareer">
                Placement (Core / Software) / Higher Studies / Entrepreneur:
              </label>
              <input
                type="text"
                id="placementOrCareer"
                className="form-control"
                name="placementOrCareer"
                value={localFormData.placementOrCareer}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="workshopsAttended">No. of Workshop / Training attended:</label>
              <input
                type="number"
                id="workshopsAttended"
                className="form-control"
                name="workshopsAttended"
                value={localFormData.workshopsAttended}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="papersPresented">No. of Papers Presented / Published:</label>
              <input
                type="number"
                id="papersPresented"
                className="form-control"
                name="papersPresented"
                value={localFormData.papersPresented}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="journal">Journal:</label>
              <input
                type="text"
                id="journal"
                className="form-control"
                name="journal"
                value={localFormData.journal}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="conference">Conference:</label>
              <input
                type="text"
                id="conference"
                className="form-control"
                name="conference"
                value={localFormData.conference}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="symposium">Symposium:</label>
              <input
                type="text"
                id="symposium"
                className="form-control"
                name="symposium"
                value={localFormData.symposium}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="projectsExhibited">No. of Project Exhibited:</label>
              <input
                type="number"
                id="projectsExhibited"
                className="form-control"
                name="projectsExhibited"
                value={localFormData.projectsExhibited}
                onChange={handleChange}
              />
            </div>

            <h4>Exhibition Levels</h4>
            <div className="form-group mb-3">
              <label htmlFor="internationalLevel">International Level:</label>
              <input
                type="number"
                id="internationalLevel"
                className="form-control"
                name="internationalLevel"
                value={localFormData.internationalLevel}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="nationalLevel">National Level:</label>
              <input
                type="number"
                id="nationalLevel"
                className="form-control"
                name="nationalLevel"
                value={localFormData.nationalLevel}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="patentsFiled">No. of Patent Filed / Sanctioned:</label>
              <input
                type="number"
                id="patentsFiled"
                className="form-control"
                name="patentsFiled"
                value={localFormData.patentsFiled}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="professionalMemberships">Membership in Professional Bodies:</label>
              <input
                type="text"
                id="professionalMemberships"
                className="form-control"
                name="professionalMemberships"
                value={localFormData.professionalMemberships}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="coCurricularParticipation">Participation in Co-curricular Activities:</label>
              <textarea
                id="coCurricularParticipation"
                className="form-control"
                name="coCurricularParticipation"
                value={localFormData.coCurricularParticipation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="extraCurricularParticipation">Participation in Extra-curricular Activities:</label>
              <textarea
                id="extraCurricularParticipation"
                className="form-control"
                name="extraCurricularParticipation"
                value={localFormData.extraCurricularParticipation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="achievements">Major Achievements:</label>
              <textarea
                id="achievements"
                className="form-control"
                name="achievements"
                value={localFormData.achievements}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="uniqueness">Uniqueness of the Student:</label>
              <textarea
                id="uniqueness"
                className="form-control"
                name="uniqueness"
                value={localFormData.uniqueness}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="strength">Strength:</label>
              <input
                type="text"
                id="strength"
                className="form-control"
                name="strength"
                value={localFormData.strength}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="weakness">Weakness:</label>
              <input
                type="text"
                id="weakness"
                className="form-control"
                name="weakness"
                value={localFormData.weakness}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="menteeSignature">Mentee Signature:</label>
              <input
                type="text"
                id="menteeSignature"
                className="form-control"
                name="menteeSignature"
                value={localFormData.menteeSignature}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mentorSignature">Mentor Signature:</label>
              <input
                type="text"
                id="mentorSignature"
                className="form-control"
                name="mentorSignature"
                value={localFormData.mentorSignature}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit and Generate PDF
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
