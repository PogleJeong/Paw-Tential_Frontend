import { useState, useEffect } from "react";
import { Input, Card, Avatar } from 'antd';
import "../../styles/search.css";
import SearchUser from "../../component/SearchUser";
import SearchFeed from "../../component/SearchFeed";


function Search(){
    
    const [search, setSearch] = useState("");
    const [searchFeed, setSearchFeed] = useState("");

    // 검색
    function searchBtn() {
        //getSearchlist(search, 0);
        setSearchFeed(search);
    }

    useEffect(function(){
    }, []);

    return (
        <div>
            <h1>검색</h1>

            <div className="search">
                <Input.Search
                    placeholder="검색어를 입력해주세요!"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={searchBtn}
                />

                {/* 유저 검색 목록 */}
                <SearchUser keyword={search} />
                {/* 피드 검색 목록 */}
                <SearchFeed keyword={searchFeed} />
            </div>
            
        </div>
    );
}

export default Search;