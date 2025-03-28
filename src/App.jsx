import React from 'react';
import { Route } from 'react-router-dom';
import BusinessSimulation from './BusinessSimulation';
import CultureCalendar from './CultureCalendar';

const App = () => {
  return (
    <Route path="/business-simulation" element={<BusinessSimulation />} />
    <Route path="/growthcalendar" element={<CultureCalendar />} />
  );
};

export default App; 