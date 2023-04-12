import { BrowserRouter, Routes, Route } from 'react-router-dom';


import './App.css';
import Home from './component/Home.js';
import Nav from './component/Nav.js';

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
        <Route path="/" element={<Home />} />


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
