import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { FeedImage } from "./FeedData";
import { useNavigate } from 'react-router-dom';
import FeedDetailModal from "../router/home/modals/FeedDetailModal";

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
    })
    .catch(function(err){
        alert(err);
    });
  }

  const [feedDetailModal, setFeedDetailModal] = useState(false);

  const [seq, setSeq] = useState(0);

  // 피드 자세히 보기 함수
  function handleClick(seqs) {
    setSeq(seqs);
  }

  // 피드 검색 결과 목록
  const feedListMap = feedList.map((feed, i) => {
    return(
      <>
        <div class="searchItem">
          <div class="user-images position-relative overflow-hidden">
            <a href="javascript:void(0);" onClick={()=>handleClick(feed.seq)}>
              <FeedImage content={feed.content}/>
            </a>
            <div class="image-hover-data">
                <div class="product-elements-icon">
                  <ul class="d-flex align-items-center m-0 p-0 list-inline">
                      <li><a href="#" class="pe-3 text-white"> 60 <i class="ri-thumb-up-line"></i> </a></li>
                      <li><a href="#" class="pe-3 text-white"> 30 <i class="ri-chat-3-line"></i> </a></li>
                      <li><a href="#" class="pe-3 text-white"> 10 <i class="ri-bookmark-line"></i> </a></li>
                  </ul>
                </div>
            </div>
          </div>
        </div>
      </>
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
    setPage(1);
  }, [prop.keyword]);

  return (
    <>

      <div class="friend-list-tab">
          <div class="tab-content">
          <div class="tab-pane fade active show" id="photosofyou" role="tabpanel">
              <div class="card-body p-0">
                  <div class="d-grid gap-2 d-grid-template-1fr-13">
                    {feedListMap}
                  </div>
              </div>
          </div>
          </div>
      </div>
      
      <div className="mt-3">
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

    </>
  );
};

export default SearchFeed;