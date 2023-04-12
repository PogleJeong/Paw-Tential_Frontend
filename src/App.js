import { BrowserRouter, Routes, Route } from 'react-router-dom';


import './App.css';
import Home from './component/Home.js';
import Nav from './component/Nav.js';


import Login from './router/login/Login.js';
import Regi from './router/login/Regi.js';
import Pet_info from './router/login/Pet_info.js';
import Pet_info_detail from './router/login/Pet_info_detail.js';

function App() {
  return (
    <div>
    {/* 헤더 */}
    <header>
    <div>
    <h1>PAW-TENTIAL</h1>
    </div>
    </header>


    
    <BrowserRouter>
    <div>
    <nav>
      {/* 사이드메뉴 */}
      <div> 
      <Nav />
      </div>
    </nav>
    <main>
      <Routes>
        {/* 메인 홈 */}
        <Route path="/" element={<Home />} />

        {/* 로그인/회원가입 */}
        <Route path="/router/login" element={<Login />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/pet_info" element={<Pet_info />} />
        <Route path="/router/pet_info_detail" element={<Pet_info_detail />} />

        {/* 피드 */}
        <Route path="/router/feed" element={<Feed />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />

        {/* 콘테스트 */}
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />

        {/* 포텐스 */}
        <Route path="/router/regi" element={<Regi />} />

        {/* 마켓 */}
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />

        {/* 채팅 */}
        <Route path="/router/regi" element={<Regi />} />

        {/* 플레이스 */}
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />

        {/* 그룹 */}
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />

        {/* 관리자 */}
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />

        {/* 마이피드 */}
        <Route path="/router/myfeed" element={<Myfeed />} />
        <Route path="/router/regi" element={<Regi />} />
        <Route path="/router/regi" element={<Regi />} />
        




      </Routes>

      </main>
      </div>
    </BrowserRouter>
    {/* footer */}
    <footer>
        <div>
          <p>
            <small>Copyright &copy;Paw-Tential</small>
          </p>
        </div>
      </footer>
  </div>
  );

}

export default App;
