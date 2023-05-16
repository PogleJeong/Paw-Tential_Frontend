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

  // 검색 목록
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
  const [feed, setFeed] = useState([]);

  // 피드 상세 모달로 넘겨줄 데이터(1) - 이미지 데이터
  // props로 받은 데이터 중, 이미지 데이터만 추려서 배열에 담기
  const [photo, setPhoto] = useState([]);

  const getPhoto = () => {
    const regex = /<img src="([^"]+)"/g;
    const urls = [];

    let match;
    while ((match = regex.exec(feed.content)) !== null) {
      urls.push(match[1]);
    }

    setPhoto(urls);
  }

  // 피드 상세 모달로 넘겨줄 데이터(2) - 이미지 제외 데이터
  // props로 받은 데이터 중, 이미지 제외한 데이터만 추려서 배열에 담기
  const [noPhoto, setNoPhoto] = useState([]);

  const getNoPhoto = () => {
    const content = feed.content;

    const regex = /<img.*?>|<figure.*?>|<\/figure>/gi;
    const result = content.replace(regex, '');

    setNoPhoto(result);
  }

  // 상세 페이지로 넘겨줄 댓글 리스트
  const [commentList, setCommentList] = useState([]);

  const getCommentList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/home/getCommentList", { params: { "feedSeq": feed.seq } });
      const data = response.data.commentList;
      setCommentList(data);
    } catch (error) {
      alert(error);
    }
  };

  const handleClick = async (seq) => {
    try {
      const response = await axios.get('http://localhost:3000/home/loadPost', { params: { 'seq': seq } });
      const data = response.data;
      console.log('피드 데이터:', data);
      setFeed(data);
      getPhoto();
      getNoPhoto();
      getCommentList();
      setFeedDetailModal(true);
      console.log('피드 데이터:', data);
    } catch (error) {
      console.log(error);
    }
  };

  // 피드 검색 결과 목록
  const feedListMap = feedList.map((feed, i) => {
    return(
      <>
        <div class="searchItem" key={i}>
          <div class="user-images position-relative overflow-hidden">
            <a href="javascript:void(0);" onClick={()=>{handleClick(feed.seq)}}>
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
      {feedDetailModal && 
        <FeedDetailModal
          show={feedDetailModal}
          onHide={() => setFeedDetailModal(false)}
          feedData={feed}
          photo={photo}
          noPhoto={noPhoto}
          getComment={getCommentList}
        />
      }
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
