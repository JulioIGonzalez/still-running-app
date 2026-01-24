import { Routes, Route, Navigate } from 'react-router-dom';
import RunScreen from './screens/RunScreen';
import HistoryScreen from './screens/HistoryScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/run" replace />} />
      <Route path="/run" element={<RunScreen />} />
      <Route path="/history" element={<HistoryScreen />} />
    </Routes>
  );
}
