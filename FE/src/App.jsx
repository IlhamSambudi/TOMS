import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Flights from './pages/Flights';
import Transport from './pages/Transport';
import Assignments from './pages/Assignments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import HandlingCompanies from './pages/resources/HandlingCompanies';
import Muthawifs from './pages/resources/Muthawifs';
import TourLeaders from './pages/resources/TourLeaders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="flights" element={<Flights />} />
          <Route path="transport" element={<Transport />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="muthawif" element={<Muthawifs />} />
          <Route path="tour-leaders" element={<TourLeaders />} />
          <Route path="handling-companies" element={<HandlingCompanies />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
          },
        }}
      />
    </Router>
  );
}

export default App;
