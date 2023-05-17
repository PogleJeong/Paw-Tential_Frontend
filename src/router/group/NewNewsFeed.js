/**
 * 뉴스피드(ver.리팩토링)
 * @Auth 해운 
 */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import NewsFeedComponent from '../../component/NewsFeedComponent';

export default function NewNewsFeed() {

    // 쿠키에 저장된 ID 값
    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    const userId = cookies.USER_ID;

    // 가입한 그룹이 있는지 확인
    const [groupJoined, setGroupJoined] = useState(false);
    const hasJoinedGroup = async () => {
        axios.get("http://localhost:3000/group/hasJoinedGroup", {params:{"memberId":userId}})
        .then(function(res){
            setGroupJoined(res.data);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 특정 유저가 가입한 그룹의 피드 가져오기
    const [groupFeeds, setGroupFeeds] = useState([]);
    const getMemberGroupsFeeds = async () => {
        axios.get("http://localhost:3000/group/newsFeed", {params:{"memberId":userId}})
        .then(function(res){
            setGroupFeeds(res.data.newsFeed);
        })
        .catch(function(err){
            alert(err);
        })
    }

    useEffect(()=>{
        hasJoinedGroup();
        getMemberGroupsFeeds();
    },[])


    return (
        <>
        <div id="content-page" className="content-page">
            <div className="container">
                <h3 className="my-3">NewsFeed</h3>
                <div className="row">
                    <div className="col-lg-8 row m-0 p-0">

        {groupJoined ? (
            <>
            {groupFeeds && groupFeeds.length !== 0 ? (
                <>
                {groupFeeds.map((feed, i) => {
                    return (
                        <NewsFeedComponent feed={feed}
                                                                    key={i}
                                                                    userId={userId}
                                                                    fn={()=>{getMemberGroupsFeeds();}}
                                                                    />
                                                                    )
                                                                })}
                </>
            ) : (
                <p>가입한 그룹에 작성된 피드가 없습니다.</p>
                )}
            </>
        ) : (
            <p>아직 가입한 그룹이 없습니다.</p>
            )}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}