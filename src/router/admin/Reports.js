import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Select, Input, Button, Pagination } from 'antd';

import AdminSidebar from "../../component/AdminSidebar";
import FeedDetailModal from "../home/modals/FeedDetailModal";

import "../../styles/page.css"

const { Option } = Select;


const AdminReportList = () => {
  const [reports, setReports] = useState([]);
  const [choice, setChoice] = useState("");
  const [search, setSearch] = useState("");

  // paging
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);
  
  const choiceChange = (value) => {
    setChoice(value);
  };

  const searchChange = (e) => {
    setSearch(e.target.value);
  };
    const fetchReports = async (c, s, p) => {
      
        await axios.get('http://localhost:3000/reportList', { params:{ "choice":c, "search":s, "pageNumber":p  } })
        .then(function(res){
        console.log(res.data.list);

        setReports(res.data.list);


        setTotalCnt(res.data.cnt);
        })
      .catch (function(error) {
        console.log(error);
      })
    }

    
    

    
    useEffect(() => {
      fetchReports('','');
    }, []);

    let navigate = useNavigate();
    
    function searchBtn(){
      // choice, search 검사
      
      if(choice.toString().trim() !== "" && search.toString().trim() !== ""){
        navigate('/admin/reports/' + choice + "/" + search);
      }
      else{
        navigate('/admin/reports/');
      }
      // 데이터를 다시 한번 갖고 온다
      fetchReports(choice, search);
    }
    
    function handlePageChange(page){
      setPage(page);
      fetchReports(choice, search, page-1);
    }
    

    
    return (
      <div className='adminstyle'>
      <div class="card">
<div class="card-header d-flex justify-content-between">
                     <div class="header-title">
                     <h1>신고 관리</h1>

                     </div>
                  </div>
      <div className="admin-page-sidebar">
        <AdminSidebar />
      </div>
      <div class="card-body">

      <table class="table" style={{ marginLeft:"auto", marginRight:"auto", marginTop:"3px", marginBottom:"3px" }}>
            <tbody>
            <tr>
                <td style={{ paddingLeft:"3px" }}>
                    <Select className="custom-select" value={choice} onChange={choiceChange} style={{ width: '200px' }}>
                        <Option value=''>검색</Option>
                        <Option value="id">아이디</Option>
                        <Option value="auth">신고 유형</Option>
                    </Select>
                </td>
                <td style={{ paddingLeft:"5px" }} className="align-middle">
                    <Input type="text" className="form-control" placeholder="검색어"
                        value={search} onChange={searchChange}/>
                </td>
                <td style={{ paddingLeft:"5px" }}>
                    <span>
                        <button type="button" className="btn btn-primary" onClick={()=>searchBtn()}>검색</button>
                    </span>
                </td>
            </tr>
            </tbody>
        </table>

        <br/>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">신고자ID</th>
            <th scope="col">피신고자ID</th>
            <th scope="col">신고유형</th>
            <th scope="col">사유</th>
            <th scope="col">신고일</th>
            <th scope="col">신고 위치</th>
            <th scope="col">신고 관리</th>
          </tr>
        </thead>
        <tbody>
          {
          reports.map(function(dto, i){
            return(
              <TableRow report={dto} cnt={i+1} key={i} />
            )
          





          })
        }
        </tbody>
      </table>

      <Pagination
            activePage={page}
            itemsCountPerPage={10}
            totalItemsCount={totalCnt}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={handlePageChange} />

    </div>
    </div>
    </div>

  );
};

function TableRow(props){

  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [market, setMarket] = useState([]);

  const [feedDetailModal, setFeedDetailModal] = useState(false);


  
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

  
  
  useEffect(() => {
    fetchFeed(props);
    fetchMarket(props);
  }, []);
  
  
  
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

  
  
  
  
  // 해당 피드 정보 가져오기
  const fetchFeed = async (props) => {
    try {
      const response = await axios.get('http://localhost:3000/home/loadPost', { params: { 'seq': props.report.feed_seq} });
      const data = response.data;
      setFeed(data);
      getPhoto(data.content);
      getNoPhoto(data.content);
      getCommentList(data.seq);
    } catch (error) {
    console.log(error);
  }
};

// 해당 마켓 정보 가져오기
const fetchMarket = async (props) => {
  try {
    const response = await axios.get('http://localhost:3000/marketDetail', { params: { 'seq': props.report.market_seq } });
    const data = response.data;
    setMarket(data);
    
    console.log('마켓 데이터:' + JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};
console.log(market);


  const handleGoToDetail = () => {
  if (props.report.type === '유저') {
    navigate(`/myfeed/myfeed2/${props.report.reported}`);

  } else if (props.report.type === '피드') {
    setFeedDetailModal(true);
    console.log('포토 : '+ photo);
  } else if (props.report.type === '마켓') {
    console.log(props);
    console.log(market);
    navigate(`/market/detail/${props.report.market_seq}`,{ state: {marketInfo: market.marketInfo, imgInfo: market.imgInfo}});
  }
};



  return (


      <tr>
          <td>{props.cnt}</td>
          <td>{props.report.reporter}</td>
          <td>{props.report.reported}</td>
          <td>{props.report.rtype}</td>
          <td>{props.report.content}</td>
          <td>{props.report.rdate}</td>
          <td>{props.report.type}</td>
          <td>
        <button class="btn btn-secondary" onClick={() => handleGoToDetail(feed , props.report.reported, market)}>이동</button>
      </td>
      {feedDetailModal && (
      <FeedDetailModal
        show={feedDetailModal}
        onHide={() => setFeedDetailModal(false)}
        feedData={feed}
        photo={photo}
        noPhoto={noPhoto}
        getComment={getCommentList}
      />
    )}
      </tr>
  );
}

export default AdminReportList;