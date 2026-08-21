import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ProcurementProvider } from './context/ProcurementContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <ProcurementProvider>
        <AppRoutes />
      </ProcurementProvider>
    </BrowserRouter>
  );
}

export default App;
