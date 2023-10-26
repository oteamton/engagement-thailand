import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserRegistrationForm1 from './components/UserForm1';
import UserPage from './components/UserPage';
import VerificationPage from './components/VerificationPage';
import AdminPanel from './components/Admin';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UserRegistrationForm1 />} />
          <Route path='/user' element={<UserPage />} />
          <Route path='/thanks' element={<VerificationPage />} />
          <Route path='/admin' element={<AdminPanel />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
