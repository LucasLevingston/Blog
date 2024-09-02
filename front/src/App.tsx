import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login.tsx';
function App() {
  return (
    <div className="font-mainFont">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} caseSensitive={false} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
