import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserRegistrationForm1 from './components/UserForm1';
import UserPage from './components/UserPage';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UserRegistrationForm1 />} />
          <Route path='/user' element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
