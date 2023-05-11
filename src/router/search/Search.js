import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import "../../styles/search.css";
import "../../styles/page.css";
import { FeedImage } from "../../component/FeedData";
import { Tab, Tabs } from 'react-bootstrap';

function Search(){

    const [feedList, setFeedList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState("");
    const [tabKey, setTabKey] = useState('feedlist');

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
    const [userTotalCnt, setUserTotalCnt] = useState(0);

    function getSearchlist(sea, p) {
        axios.get("http://localhost:3000/search", { params:{"search":sea, "pageNumber":p} })
        .then(function(resp){
            setFeedList(resp.data.list);
            setTotalCnt(resp.data.cnt);
            setUserList(resp.data.userlist);
            setUserTotalCnt(resp.data.usercnt);
        })
        .catch(function(err){
            alert(err);
        });
    }

    // 피드 검색 결과 목록
    const feedListMap = feedList.map((feed, i) => {
        return(
            <div className="searchItem" key={i}><FeedImage content={feed.content} /></div>
        )
    });

    // 사용자 검색 결과 목록
    const userListMap = userList.map((user, i) => {
        console.log(user.content);
        return(
            <div className="searchItem" key={i}><img src={"feedimages/"+ user.profile +".png"} alt="프로필" /></div>
        )
    });

    // 검색
    function searchBtn() {
        getSearchlist(search, 0);
    }

    // 페이징
    function pageChange(p) {
        setPage(p);
        getSearchlist(search, p-1);
    }

    // 탭 이동
    const selectTab = (e) => {
        setTabKey(e);
        setPage(1);
        getSearchlist(search, 0);
    }

    useEffect(function(){
        getSearchlist("", 0);
    }, []);

    return (
        <div>
            <h1>검색</h1>

            <div className="search">
                <div>
                    <input value={search} id="keyword" onChange={(e) => setSearch(e.target.value)} placeholder="검색" autoComplete='off' />
                    <button id="submit_search" onClick={searchBtn}>검색하기</button>
                </div >

                <Tabs
                    id="controlled-tab-example"
                    activeKey={tabKey}
                    onSelect={selectTab}
                    className="mb-3"
                >
                    <Tab eventKey="feedlist" title="게시글목록">
                        <div className="searchList">
                            {feedListMap}
                        </div>
                        <Pagination
                            activePage={page}           // 현재 페이지
                            itemsCountPerPage={12}      // 보여줄 페이지 수
                            totalItemsCount={totalCnt}  // 글의 총 개수
                            pageRangeDisplayed={5}      // 페이지 버튼 개수
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={pageChange}
                        />
                    </Tab>
                    <Tab eventKey="userlist" title="사용자목록">
                        <div className="searchList">
                            {userListMap}
                        </div>
                        <Pagination
                            activePage={page}           // 현재 페이지
                            itemsCountPerPage={12}      // 보여줄 페이지 수
                            totalItemsCount={userTotalCnt}  // 글의 총 개수
                            pageRangeDisplayed={5}      // 페이지 버튼 개수
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={pageChange}
                        />
                    </Tab>
                </Tabs>
            </div>
            
        </div>
    );
}

export default Search;