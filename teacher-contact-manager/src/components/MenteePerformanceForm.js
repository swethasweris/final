import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormDataContext } from '../App'; // Assuming FormDataContext is correctly set up

const MenteePerformanceForm = ({ menteeNumber }) => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext); // Shared context

  // Initialize state for performance data with 6 sets of course details
  const [performanceData, setPerformanceData] = useState({
    studentName: '',
    rollNumber: '',
    course1: { courseName: '', cat1: '', cat2: '', cat3: '', endSem: '' },
    course2: { courseName: '', cat1: '', cat2: '', cat3: '', endSem: '' },
    course3: { courseName: '', cat1: '', cat2: '', cat3: '', endSem: '' },
    course4: { courseName: '', cat1: '', cat2: '', cat3: '', endSem: '' },
    course5: { courseName: '', cat1: '', cat2: '', cat3: '', endSem: '' },
    course6: { courseName: '', cat1: '', cat2: '', cat3: '', endSem: '' },
    coursesUnder50: '',
    coursesUnder70: '',
    coursesUnder90: '',
    coursesAbove90: '',
    attendance: '',
    menteeSignature: '',
    academicPerformance: '',
    coCurricular: '',
    extraCurricular: '',
    mentorSignature: ''
  });

  // Handle basic field changes (non-course-related)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerformanceData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes to course-specific fields
  const handleCourseChange = (courseKey, field, value) => {
    setPerformanceData((prev) => ({
      ...prev,
      [courseKey]: { ...prev[courseKey], [field]: value }
    }));
  };

  // Handle the Next Page button click
  const handleNextPage = () => {
    updateFormData('performanceDetails', performanceData); // Save to context
    navigate('/form'); // Navigate to final form page
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{
      backgroundImage: 'url(/images/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="card shadow-lg" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="card-title">Mentee {menteeNumber} - Performance Details</h2>
          </div>
          <form>
            {/* Basic Student Info */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="studentName"
                value={performanceData.studentName}
                onChange={handleChange}
                placeholder="Student Name"
                required
              />
              <label htmlFor="studentName">Name of the Student</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="rollNumber"
                value={performanceData.rollNumber}
                onChange={handleChange}
                placeholder="Roll Number"
                required
              />
              <label htmlFor="rollNumber">Roll Number</label>
            </div>

            <h4>Test Performance Marks</h4>

            {/* 6 Course Input Fields */}
            {[...Array(6)].map((_, index) => {
              const courseKey = `course${index + 1}`;
              return (
                <div key={index} className="course-section mb-4">
                  <h5>Course {index + 1} Details</h5>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name={`${courseKey}Name`}
                      value={performanceData[courseKey].courseName}
                      onChange={(e) => handleCourseChange(courseKey, 'courseName', e.target.value)}
                      placeholder="Course Name"
                      required
                    />
                    <label htmlFor={`${courseKey}Name`}>Course Name</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      name={`${courseKey}Cat1`}
                      value={performanceData[courseKey].cat1}
                      onChange={(e) => handleCourseChange(courseKey, 'cat1', e.target.value)}
                      placeholder="CAT 1"
                    />
                    <label htmlFor={`${courseKey}Cat1`}>CAT 1</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      name={`${courseKey}Cat2`}
                      value={performanceData[courseKey].cat2}
                      onChange={(e) => handleCourseChange(courseKey, 'cat2', e.target.value)}
                      placeholder="CAT 2"
                    />
                    <label htmlFor={`${courseKey}Cat2`}>CAT 2</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      name={`${courseKey}Cat3`}
                      value={performanceData[courseKey].cat3}
                      onChange={(e) => handleCourseChange(courseKey, 'cat3', e.target.value)}
                      placeholder="CAT 3"
                    />
                    <label htmlFor={`${courseKey}Cat3`}>CAT 3</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      name={`${courseKey}EndSem`}
                      value={performanceData[courseKey].endSem}
                      onChange={(e) => handleCourseChange(courseKey, 'endSem', e.target.value)}
                      placeholder="End Sem"
                    />
                    <label htmlFor={`${courseKey}EndSem`}>End Sem</label>
                  </div>
                </div>
              );
            })}

            {/* Course Scores */}
            <h4>Course Scores</h4>
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                name="coursesUnder50"
                value={performanceData.coursesUnder50}
                onChange={handleChange}
                placeholder="No. of Courses Scored < 50"
              />
              <label htmlFor="coursesUnder50">No. of Courses Scored &lt; 50</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                name="coursesUnder70"
                value={performanceData.coursesUnder70}
                onChange={handleChange}
                placeholder="No. of Courses Scored <= 70"
              />
              <label htmlFor="coursesUnder70">No. of Courses Scored &lt;= 70</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                name="coursesUnder90"
                value={performanceData.coursesUnder90}
                onChange={handleChange}
                placeholder="No. of Courses Scored <= 90"
              />
              <label htmlFor="coursesUnder90">No. of Courses Scored &lt;= 90</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                name="coursesAbove90"
                value={performanceData.coursesAbove90}
                onChange={handleChange}
                placeholder="No. of Courses Scored > 90"
              />
              <label htmlFor="coursesAbove90">No. of Courses Scored &gt; 90</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                name="attendance"
                value={performanceData.attendance}
                onChange={handleChange}
                placeholder="Attendance Percentage"
              />
              <label htmlFor="attendance">Attendance Percentage</label>
            </div>

            {/* Additional Details */}
            <h4>Additional Details</h4>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="menteeSignature"
                value={performanceData.menteeSignature}
                onChange={handleChange}
                placeholder="Mentee Signature"
              />
              <label htmlFor="menteeSignature">Mentee Signature with Date</label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                name="academicPerformance"
                value={performanceData.academicPerformance}
                onChange={handleChange}
                placeholder="Academic Performance Remarks"
                rows="3"
              />
              <label htmlFor="academicPerformance">Academic Performance</label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                name="coCurricular"
                value={performanceData.coCurricular}
                onChange={handleChange}
                placeholder="Co-curricular Activities"
                rows="3"
              />
              <label htmlFor="coCurricular">Co-curricular Activities</label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                name="extraCurricular"
                value={performanceData.extraCurricular}
                onChange={handleChange}
                placeholder="Extra-curricular Activities"
                rows="3"
              />
              <label htmlFor="extraCurricular">Extra-curricular Activities</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="mentorSignature"
                value={performanceData.mentorSignature}
                onChange={handleChange}
                placeholder="Mentor Signature"
              />
              <label htmlFor="mentorSignature">Mentor Signature with Date</label>
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextPage}
              >
                Next Page
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenteePerformanceForm;
