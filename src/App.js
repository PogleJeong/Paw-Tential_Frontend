import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useMatch } from "react-router-dom";

import "./App.css";
import Nav from "./component/Nav.js";
import AdminSidebar from "./component/AdminSidebar";

import Home from "./router/home/Home";

import Login from "./router/login/LoginHome";
import KakaoAuth from "./router/login/KakaoAuth";

import RegisterPage1 from "./router/register/RegisterPage1";
import RegisterPage2 from "./router/register/RegisterPage2";
import RegisterPage3 from "./router/register/RegisterPage3";

import FeedPost from "./router/Feed/FeedPost";

import Place from "./router/place/Place.js";
import Place_detail from "./router/place/Place_detail";

import Myfeed from "./router/myfeed/Myfeed";
import Myfeed2 from "./router/myfeed/Myfeed2";
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


import NewsFeed from './router/group/NewsFeed';
import CreateGroup from './router/group/CreateGroup';
import GroupList from './router/group/GroupList';
import MyGroup from './router/group/MyGroup';
import ModifyGroup from './router/group/ModifyGroup';
import GroupFeed from './router/group/GroupFeed';
import ThemedExample from "./component/chatbot";

import Pawtens from "./router/pawtens/Pawtens";

import Contest from "./router/contest/Contest";

import SearchUser from "./component/SearchUser";
import ChatroomHome from "./router/chat/ChatroomHome";
import Chatroom from "./router/chat/Chatroom";

import NewGroupFeed from "./router/group/NewGroupFeed";
import Search from "./router/search/Search";
import Navbar from "./component/NavBar";
import InitPage from "./router/home/InitPage";
import NewNewsFeed from "./router/group/NewNewsFeed";


function App() {
    return (
        <div>
      {/* 헤더 */}
      <BrowserRouter>
      <div className="wrapper">
          {/* 사이드메뉴 */}
          {window.location.pathname.startsWith("/admin") ? <AdminSidebar /> : <Navbar />}
          {/*쳇봇*/}
          {/* <ThemedExample/> */}

          <Routes>
            {/* home */}
            <Route path="/" element={<InitPage />} />

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

            {/* 검색 */}
            <Route path="/search" element={<Search />} />

            {/* 포텐스 */}
            <Route path="/pawtens" element={<Pawtens />} />

            {/* 마켓 */}
            <Route path="/market" element={<MarketHome />} />
            <Route path="/market/write" element={<MarketWrite />} />
            <Route path="/market/update/:posting" element={<MarketUpdate />} />
            <Route path="/market/detail/:posting" element={<MarketDetail />} />


            {/* 플레이스 */}
            <Route path="/place" element={<Place />} />
            <Route path="/place/:search?/:category?" element={<Place />} />
            <Route path="/place/detail/:search?/:category?" element={<Place_detail />} />

            {/* 그룹 */}
            {/* TO-DO : NewsFeed 뒤에 Member 테이블 id 붙이기 */}
            <Route path="/group/NewsFeed" element={<NewNewsFeed/>} />
            <Route path="/group/CreateGroup" element={<CreateGroup />} />
            <Route path="/group/GroupList" element={<GroupList />} />
            <Route path="/group/GroupList/:search" element={<GroupList />} />
            <Route path="/group/MyGroup/" element={<MyGroup />} />
            <Route path="/group/ModifyGroup/:grpNo" exact element={<ModifyGroup />} />
            <Route path="/group/GroupFeed/:grpNo/:grpName" exact element={<NewGroupFeed />} />
            <Route path="/router/regi" element={null} />

            {/* 관리자 */}
            <Route path="/admin/admin" element={<Admin />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/:choice/:search" element={<Users />} />
            <Route path="/admin/QnA" element={<QnA />} />
            <Route path="/admin/QnA/:choice/:search" element={<QnA />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/reports/:choice/:search" element={<Reports />} />
            <Route path="/admin/data" element={<Data />} />

            {/* 채팅 */}
            <Route path="/chat/home" element={<ChatroomHome />} />
            <Route path="/chat/:id" element={<Chatroom />} />


            {/* 마이피드 */}
            <Route path="/myfeed/myfeed" element={<Myfeed />} />
            <Route path="/myfeed/myfeed2/:userId" element={<Myfeed2 />} />
            <Route path="/myfeed/user_update" element={<User_update />} />
            <Route path="/myfeed/pet_update" element={<Pet_update />} />
            <Route path="/searchUser" element={<SearchUser />} />
          </Routes>
        </div>
      </BrowserRouter>

      {/* footer */}
      <footer style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', backgroundColor: '#cee0c2', textAlign: 'center', zIndex: 1 }}>
      <div>
        <p>
          <small>&copy; Paw-Tential</small>
        </p>
      </div>
    </footer>
    </div>
  );
}

export default App;
