import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Agents from './pages/Agents';
import Conversations from './pages/Conversations';
import Settings from './pages/Settings';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const { authenticated } = useAuth();
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { authenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WebSocketProvider>
              <MainLayout />
            </WebSocketProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="agentes" element={<Agents />} />
        <Route path="conversas" element={<Conversations />} />
        <Route path="configuracoes" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
