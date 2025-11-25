import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { ListPage } from './pages/ListPage';
import { ItemPage } from './pages/ItemPage';
import { StatsPage } from './pages/StatsPage';

const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/list" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
