import React, { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import UserRegister from './components/Register';
import UserPage from './components/UserPage';
import VerificationPage from './components/VerificationPage';
import AdminPanel from './components/Admin';
import Login from './components/Login';
import UpdateProfile from './components/UserUpdateProfile';
import JoinUs from './components/UserUpgradeRole';
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

            <Route path='/' element={<UserRegister />} />
            <Route path='/login' element={<Login />} />
            <Route path='/user' element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            } />
            <Route path='/thanks' element={<VerificationPage />} />
            <Route path='/admin' element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path='/edit-profile' element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            } />
            <Route path='/upgrade-role' element={
              <ProtectedRoute>
                <JoinUs />
              </ProtectedRoute>
            } />
            <Route path='*' element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
