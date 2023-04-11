import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './component/Home.js';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
    // 테스트 주석
    // 테스트
    // psw
  );
}

export default App;
