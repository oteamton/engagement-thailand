import React, { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import UserRegistrationForm1 from './components/UserForm1';
import UserPage from './components/UserPage';
import VerificationPage from './components/VerificationPage';
import AdminPanel from './components/Admin';
import Login from './components/Login';
import EditProfile from './components/EditForm';
import './App.css';

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route path='/' element={<UserRegistrationForm1 />} />
            <Route path='/login' element={<Login />} />
            <Route path='/user' element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            } />
            <Route path='/thanks' element={
              <ProtectedRoute>
                <VerificationPage />
              </ProtectedRoute>
            } />
            <Route path='/admin' element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path='/edit-profile' element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
