import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Dashboard/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import RoomList from './components/Dashboard/RoomList';
import DeviceList from './components/Dashboard/DeviceList';
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Navbar />
                <RoomList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/room/:roomId" 
            element={
              <ProtectedRoute>
                <Navbar />
                <DeviceList />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default App;