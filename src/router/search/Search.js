import { useState, useEffect } from "react";
import { Input } from 'antd';
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
        <div className="container mt-4">
            <div className="row search">

                <div class="col-lg-3">
                    <div class="card">
                    <div class="card-body">
                        <div class="iq-todo-page">
                            <div class="position-relative">
                                <div class="form-group mb-0">
                                <Input.Search
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onSearch={searchBtn}
                                />
                                </div>
                            </div>
                            {/* 유저 검색 목록 */}
                            <SearchUser keyword={search} />
                        </div>
                    </div>
                    </div>
                </div>

                <div className="col-lg-9">
                    <div class="card">
                    <div class="card-body">
                        {/* 피드 검색 목록 */}
                        <SearchFeed keyword={searchFeed}/>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Search;