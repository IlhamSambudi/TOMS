import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Flights from './pages/master-data/Flights';
import Transport from './pages/operations/Transport';
import Assignments from './pages/operations/Assignments';
import Reports from './pages/Reports';
import HandlingCompanies from './pages/master-data/HandlingCompanies';
import Muthawifs from './pages/master-data/Muthawifs';
import TourLeaders from './pages/master-data/TourLeaders';
import GroupPrintView from './pages/GroupPrintView';
import Hotels from './pages/operations/Hotels';
import Trains from './pages/operations/Trains';
import Rawdahs from './pages/operations/Rawdahs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Print route — outside Layout so it's full-screen */}
        <Route path="groups/:id/print" element={<GroupPrintView />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="flights" element={<Flights />} />
          <Route path="transport" element={<Transport />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="trains" element={<Trains />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="rawdah" element={<Rawdahs />} />
          <Route path="muthawif" element={<Muthawifs />} />
          <Route path="tour-leaders" element={<TourLeaders />} />
          <Route path="handling-companies" element={<HandlingCompanies />} />
          <Route path="reports" element={<Reports />} />
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
