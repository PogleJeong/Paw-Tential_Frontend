import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { FeedImage } from "./FeedData";
import { useNavigate } from 'react-router-dom';

const SearchFeed = (prop) => {
  const [feedList, setFeedList] = useState([]);
  const navigate = useNavigate();

  // paging
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);

  function getSearchlist(sea, p) {
    axios.get("http://localhost:3000/search", { params:{"search":sea, "pageNumber":p} })
    .then(function(resp){
        setFeedList(resp.data.list);
        setTotalCnt(resp.data.cnt);
        setPage(1);
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

  // 페이징
  function pageChange(p) {
    setPage(p);
    getSearchlist(prop.keyword, p-1);
  }

  useEffect(function(){
    getSearchlist("", 0);
  }, []);

  useEffect(function(){
    // 검색어가 변경될 때마다 검색을 수행
    const keyword = prop.keyword.trim();
    getSearchlist(keyword, 0);
  }, [prop.keyword]);

  return (
    <div>
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
    </div>
  );
};

export default SearchFeed;
