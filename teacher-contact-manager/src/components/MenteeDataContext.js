// MenteeDataContext.js
import React, { createContext, useContext, useState } from 'react';

const MenteeDataContext = createContext();

export const MenteeDataProvider = ({ children }) => {
  const [menteeData, setMenteeData] = useState({});

  const updateMenteeData = (key, data) => {
    setMenteeData((prevData) => ({ ...prevData, [key]: data }));
  };

  return (
    <MenteeDataContext.Provider value={{ menteeData, updateMenteeData }}>
      {children}
    </MenteeDataContext.Provider>
  );
};

export const useMenteeData = () => useContext(MenteeDataContext);
