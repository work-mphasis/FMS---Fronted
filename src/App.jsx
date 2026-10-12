import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import FreshersPage from "./pages/FreshersPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/freshers" element={<ProtectedRoute><FreshersPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/freshers" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}