import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import PasswordRecovery from './pages/password-recovery';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<PasswordRecovery />} />
        <Route path="/reset-password/:uid/:token" element={<PasswordRecovery />} />
        <Route path="*" element={<main className="min-h-screen bg-[#0a0a1f] text-white p-12"><h1>Page not found</h1><Link to="/login">Back to sign in</Link></main>} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
