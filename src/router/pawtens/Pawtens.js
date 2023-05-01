import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import "../../styles/pawtens.css";
import "../../styles/page.css";

function Pawtens(){

    const [pawtensList, setPawtensList] = useState([]);

    const [search, setSearch] = useState("");

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getPawtenslist(sea, p) {
        axios.get("http://localhost:3000/pawtens", { params:{"search":sea, "pageNumber":p} })
        .then(function(resp){
            setPawtensList(resp.data.list);
            setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        });
    }

    const pawtensListMap = pawtensList.map((pawtens, i) => {
        return(
            <div className="pawtensItem" key={i}>{pawtens.content}</div>
        )
    });

    // 검색
    function searchBtn() {
        getPawtenslist(search, 0);
    }

    // 페이징
    function pageChange(p) {
        setPage(p);
        getPawtenslist(search, p-1);
    }

    useEffect(function(){
        getPawtenslist("", 0);
    }, []);

    return (
        <div>
            <h1>Paw-Tents</h1>

            <div className="pawtens">
                <div className="search">
                    <input value={search} id="keyword" onChange={(e) => setSearch(e.target.value)} placeholder="검색" autocomplete='off' />
                    <button id="submit_search" onClick={searchBtn}>검색하기</button>
                </div >

                <div className="pawtensList">
                    {pawtensListMap}
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
            
        </div>
    );
}

export default Pawtens;