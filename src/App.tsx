import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';

export function App() {
  // Using HashRouter instead of BrowserRouter for GitHub Pages compatibility
  return (
    <HashRouter>
      <AuthProvider>
        <div className="min-h-screen bg-amber-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
