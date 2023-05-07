import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import Nav from "./component/Nav.js";

import Home from "./router/home/Home";

import Login from "./router/login/Login";
import KakaoAuth from "./router/login/KakaoAuth";

import RegisterPage1 from "./router/register/RegisterPage1";
import RegisterPage2 from "./router/register/RegisterPage2";
import RegisterPage3 from "./router/register/RegisterPage3";

import FeedPost from "./router/Feed/FeedPost";

import Place from "./router/place/Place.js";
import Place_detail from "./router/place/Place_detail";

import Myfeed from "./router/myfeed/Myfeed";
import User_update from "./router/myfeed/User_update";
import Pet_update from "./router/myfeed/Pet_update";
import MarketHome from "./router/market/Market_home";
import MarketWrite from "./router/market/Market_write";
import MarketUpdate from "./router/market/Market_update";
import MarketDetail from "./router/market/Market_detail";
import FindAccount from './router/login/findAccount';

import Admin from './router/admin/Admin';
import QnA from './router/admin/QnA';
import Reports from './router/admin/Reports';
import Users from './router/admin/Users';
import Data from './router/admin/Data';
import PetChart from './router/admin/PetChart';
import UserChart from './router/admin/UserChart';

import NewsFeed from './router/group/NewsFeed';
import CreateGroup from './router/group/CreateGroup';
import GroupList from './router/group/GroupList';
import MyGroup from './router/group/MyGroup';
import ModifyGroup from './router/group/ModifyGroup';
import GroupFeed from './router/group/GroupFeed';

import Pawtens from "./router/pawtens/Pawtens";
import Pawtens_detail from "./router/pawtens/Pawtens_detail";

import Contest from "./router/contest/Contest";
import Contest_detail from "./router/contest/Contest_detail";

import Search from "./router/search/Search";


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
            <Route path="/home/home" element={<Home />} />

            {/* 로그인/회원가입 */}
            <Route path="/login" element={<Login />} />
            <Route path="/login/findAccount" element={<FindAccount />} />
            <Route path="/register" element={<RegisterPage1 />} />
            <Route path="/register/petHave" element={<RegisterPage2 />} />
            <Route path="register/petInfo" element={<RegisterPage3 />} />
            <Route path="/login/kakaoAuth" element={<KakaoAuth />} />
      
            {/* 피드 */}
            <Route path="/router/regi" element={null} />
            <Route path="/router/regi" element={null} />
            <Route path="/router/regi" element={null} />

            {/* 콘테스트 */}
            <Route path="/contest" element={<Contest />} />
            <Route path="/contest/detail" element={<Contest_detail />} />

            {/* 검색 */}
            <Route path="/search" element={<Search />} />

            {/* 포텐스 */}
            <Route path="/pawtens" element={<Pawtens />} />
            <Route path="/pawtens/detail" element={<Pawtens_detail />} />

            {/* 마켓 */}
            <Route path="/market" element={<MarketHome />} />
            <Route path="/market/write" element={<MarketWrite />} />
            <Route path="/market/update/:posting" element={<MarketUpdate />} />
            <Route path="/market/detail/:posting" element={<MarketDetail />} />

            {/* 채팅 */}
            <Route path="/router/regi" element={null} />

            {/* 플레이스 */}
            <Route path="/place" element={<Place />} />
            <Route path="/place/:search?/:category?" element={<Place />} />
            <Route path="/place/detail/:search?/:category?" element={<Place_detail />} />

            {/* 그룹 */}
            {/* TO-DO : NewsFeed 뒤에 Member 테이블 id 붙이기 */}
            <Route path="/group/NewsFeed" element={<NewsFeed />} />
            <Route path="/group/CreateGroup" element={<CreateGroup />} />
            <Route path="/group/GroupList" element={<GroupList />} />
            <Route path="/group/GroupList/:search" element={<GroupList />} />
            <Route path="/group/MyGroup" element={<MyGroup />} />
            <Route path="/group/ModifyGroup/:grpNo" exact element={<ModifyGroup />} />
            <Route path="/group/GroupFeed/:grpNo/:grpName" exact element={<GroupFeed />} />
            <Route path="/router/regi" element={null} />

            {/* 관리자 */}
            <Route path="admin/admin" element={<Admin />} />
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/users/:choice/:search" element={<Users />} />
            <Route path="admin/QnA" element={<QnA />} />
            <Route path="admin/QnA/:choice/:search" element={<QnA />} />
            <Route path="admin/reports" element={<Reports />} />
            <Route path="admin/reports/:choice/:search" element={<Reports />} />
            <Route path="admin/data" element={<Data />} />
            <Route path="admin/petChart" element={<PetChart />} />
            <Route path="admin/userChart" element={<UserChart />} />



            

            {/* 마이피드 */}
            <Route path="/myfeed/myfeed" element={<Myfeed />} />
            <Route path="/myfeed/user_update" element={<User_update />} />
            <Route path="/myfeed/pet_update" element={<Pet_update />} />
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
