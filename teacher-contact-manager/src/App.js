// App.js
import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AddContact from './components/AddContact';
import ViewContacts from './components/ViewContacts';
import CreateGroup from './components/CreateGroup';
import ViewGroups from './components/ViewGroups';
import HomePage from './components/HomePage';
import StudentRegister from './components/StudentRegister';
import StudentLogin from './components/StudentLogin';
import MenteeForm from './components/MenteeForm';
import MenteePerformanceForm from './components/MenteePerformanceForm';
import Form from './components/Form';
import Upload from './components/Upload';
import './components/styles.css';

// Create a context to store form data
export const FormDataContext = createContext();

function App() {
  const [formData, setFormData] = useState({
    menteeDetails: {},
    performanceDetails: {},
    finalDetails: {}
  });

  // Function to update specific sections of the form data
  const updateFormData = (section, data) => {
    setFormData((prevData) => ({ ...prevData, [section]: data }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      <Router>
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/homepage" />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-contact" element={<AddContact />} />
            <Route path="/view-contacts" element={<ViewContacts />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/view-groups" element={<ViewGroups />} />
            <Route path="/studentregister" element={<StudentRegister />} />
            <Route path="/studentlogin" element={<StudentLogin />} />
            <Route path="/menteeform" element={<MenteeForm />} />
            <Route path="/menteeperformanceform" element={<MenteePerformanceForm />} />
            <Route path="/form" element={<Form />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </div>
      </Router>
    </FormDataContext.Provider>
  );
}

export default App;
