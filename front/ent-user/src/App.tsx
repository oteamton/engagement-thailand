import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserRegistrationForm1 from './components/UserForm1';
import UserPage from './components/UserPage';
import VerificationPage from './components/VerificationPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UserRegistrationForm1 />} />
          <Route path='/user' element={<UserPage />} />
          <Route path='/thanks' element={<VerificationPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
