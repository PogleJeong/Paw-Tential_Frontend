
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";
import { useCookies } from "react-cookie";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/MyFeed.css';
import { PreFeedImage } from '../../component/FeedData';

import ProfileCard from '../../component/ProfileCard';
import FeedDetailModal from "../home/modals/FeedDetailModal";



const Myfeed = () => {

  const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
  const [userInfo, setUserInfo] = useState(null);
  const [bookmarkFeeds, setBookmarkFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedFeed, setLoadedFeed] = useState([]);
  const [petList, setPetList] = useState([]);
  const [showPetInfo, setShowPetInfo] = useState(false);






  const observer = useRef();
  const lastFeedElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get("http://localhost:3000/userInfo", {params: {id : cookies.USER_ID}});
      setUserInfo(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  const fetchFeed = async () => {
    try {
      const res = await axios.get("http://localhost:3000/Myfeed", { 
        params: {
          id: cookies.USER_ID,
          page: pageNumber
        }
      });
      setFeeds(prevFeed => {
        return [...prevFeed, ...res.data];
      });
      setHasMore(res.data.length > 0);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBookmarkFeeds = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getBookmark", {
        params: {
          id: cookies.USER_ID,
        },
      });
      setBookmarkFeeds(response.data);
    } catch (error) {
      console.error("Error fetching bookmark feeds:", error);
    }
  };

  
  


  useEffect(() => {
    fetchUserInfo();
    fetchFeed();
    fetchBookmarkFeeds(); 
  }, []);

  useEffect(() => {
    // 중복된 피드 항목 제거하기
    const uniqueFeed = feeds.filter((item) => !loadedFeed.find((loadedItem) => loadedItem.id === item.id));
    setLoadedFeed(prevLoadedFeed => [...prevLoadedFeed, ...uniqueFeed]);
  }, [feeds]);

  useEffect(() => {
    if (!loading && hasMore) {
      fetchFeed();
    }
  }, [pageNumber]);
  
  const handleBookmarkClick = () => {
    setFeeds(bookmarkFeeds);
    setLoadedFeed(bookmarkFeeds);
    setPageNumber(1);
    setHasMore(false); 
    setShowPetInfo(false);

  };
  

  const handleHomemarkClick = () => {
    setFeeds([]);
    setLoadedFeed([]);
    setPageNumber(1);
    setHasMore(true); 
    fetchFeed(); 
    setShowPetInfo(false);

  };

  const handlePetInfoClick = () => {
    setShowPetInfo(true);
    setFeeds([]);
    setLoadedFeed([]);


  };
  

  const [feed, setFeed] = useState([]);
  const [feedDetailModal, setFeedDetailModal] = useState(false);

  // 피드 상세 모달로 넘겨줄 데이터(1) - 이미지 데이터
  // props로 받은 데이터 중, 이미지 데이터만 추려서 배열에 담기
  const [photo, setPhoto] = useState([]);

  const getPhoto = (content) => {
    const regex = /<img src="([^"]+)"/g;
    const urls = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
      urls.push(match[1]);
    }

    setPhoto(urls);
  }

  // 피드 상세 모달로 넘겨줄 데이터(2) - 이미지 제외 데이터
  // props로 받은 데이터 중, 이미지 제외한 데이터만 추려서 배열에 담기
  const [noPhoto, setNoPhoto] = useState([]);

  const getNoPhoto = (content) => {

    const regex = /<img.*?>|<figure.*?>|<\/figure>/gi;
    const result = content.replace(regex, '');

    setNoPhoto(result);
  }

  // 상세 페이지로 넘겨줄 댓글 리스트
  const [commentList, setCommentList] = useState([]);

  const getCommentList = async (seq) => {
    try {
      const response = await axios.get("http://localhost:3000/home/getCommentList", { params: { "feedSeq": seq } });
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
      setFeed(response.data);
      getPhoto(response.data.content);
      getNoPhoto(response.data.content);
      getCommentList(response.data.seq);
      setFeedDetailModal(true);
      console.log('피드 데이터:', data);
    } catch (error) {
      console.log(error);
    }
  };
  
  //펫정보 불러오기
  useEffect(() => {
    const fetchPetList = async () => {
      try {
        const res = await axios.get('http://localhost:3000/petList', { params: { id: cookies.USER_ID } });
        const petListWithUrl = await Promise.all(
          res.data.map(async (pet) => {
            const blobResponse = await fetch(pet.imgUrl);
            const blob = await blobResponse.blob();
            const imgUrl = URL.createObjectURL(blob);
            return {
              ...pet,
              imgUrl: imgUrl,
            };
          })
        );
        setPetList(petListWithUrl);
      } catch (err) {
        console.log(err);
      }
    };
    
    

  fetchPetList();
}, [cookies.USER_ID]);
  
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  
  

  return (
    <div className="container mt-3">
      {userInfo && (
        <>
          <ProfileCard userInfo={userInfo} isCurrentUser={true} />
        </>
      )}

          <div className="card">
        <div className="card-body p-0">
          <div className="user-tabing">
            <ul className="nav nav-pills d-flex align-items-center justify-content-center profile-feed-items p-0 m-0">
              <li className="nav-item col-12 col-sm-3 p-0">
                <a className="nav-link active" href="#pills-timeline-tab" data-bs-toggle="pill" data-bs-target="#timeline" role="button" onClick={handleHomemarkClick}>피드</a>
              </li>
              <li className="nav-item col-12 col-sm-3 p-0">
                <a className="nav-link" href="#pills-about-tab" data-bs-toggle="pill" data-bs-target="#about" role="button" onClick={handleBookmarkClick}>북마크</a>
              </li>
              <li className="nav-item col-12 col-sm-3 p-0">
              <a className="nav-link" href="#pills-friends-tab" data-bs-toggle="pill" data-bs-target="#friends" role="button" onClick={handlePetInfoClick}>펫 정보</a>
              </li>
            </ul>
          </div>
        </div>
      </div>



        {feedDetailModal && (
          <FeedDetailModal
            show={feedDetailModal}
            onHide={() => setFeedDetailModal(false)}
            feedData={feed}
            photo={photo}
            noPhoto={noPhoto}
            getComment={() => getCommentList(feed.seq)}
          />
        )}

        <div className="card">
          <div className="card-body">
            <div className="friend-list-tab">
              <div className="tab-content">
                <div className="tab-pane fade active show" id="photosofyou" role="tabpanel">
                  <div className="card-body p-0">
                    <div className="row justify-content-start">
                      {loadedFeed.map((feedData, i) => {
                        if (loadedFeed.length === i + 1) {
                          return (
                            <div className="myfeeditem col-3 mb-2" key={i}>
                              <div className="user-images position-relative overflow-hidden" ref={lastFeedElementRef}>
                                <a href="javascript:void(0);" onClick={() => { handleClick(feedData.seq) }}>
                                  <PreFeedImage content={feedData.content} />
                                </a>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="myfeeditem col-3 mb-2" key={i}>
                              <div className="user-images position-relative overflow-hidden">
                                <a href="javascript:void(0);" onClick={() => { handleClick(feedData.seq) }}>
                                  <PreFeedImage content={feedData.content} />
                                </a>
                              </div>
                            </div>
                          );
                        }
                      })}
                                {/* 반려동물 카드 */}
                                {showPetInfo && (
  <Slider {...settings}>
    {petList.map((pet, index) => (
      <div key={index}>
        <div className="pet-card">
          <img src={pet.imgUrl} alt={pet.name} className="avatar-130 img-fluid" />
          <h4>{pet.name}</h4>
          <p>{pet.intro}</p>
        </div>
      </div>
    ))}
  </Slider>
)}

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading && (
              <div className="loading-container">
                <div className="loader"></div>
              </div>
            )}
          </div>
        </div>
      </div>

  );
};

export default Myfeed;