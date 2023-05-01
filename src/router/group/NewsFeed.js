/**
 * 그룹 카테고리 클릭 시, 처음 출력되는 화면
 * @Auth 해운
 */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactHtmlParser from "react-html-parser";

export default function NewsFeed() {
    
    // 테스트 아이디 임시 저장
    const userId = 'example';

    // 가입 그룹 존재 여부
    const [groupJoined, setGroupJoined] = useState(false);

    // 가입한 그룹들의 피드를 저장할 state 변수
    const [groupFeeds, setGroupFeeds] = useState([]);
    
    // 마운트 될 때, setUserId의 값을 테스트 아이디로 저장
    useEffect(()=>{
        hasJoinedGroup();
        getMemberGroupsFeeds();
    },[userId])

    // // 가입한 그룹 존재 여부 확인 함수
    const hasJoinedGroup = async () => {
        axios.get("http://localhost:3000/group/hasJoinedGroup", {params:{"memberId":userId}})
        .then(function(resp) {
            console.log(resp.data);
            setGroupJoined(resp.data);
        })
        .catch(function(err) {
            alert(err);
        })
    }

    const getMemberGroupsFeeds = () => {
        axios.get("http://localhost:3000/group/newsFeed", {params:{"memberId":userId}})
        .then(function(resp) {
            console.log(resp.data.newsFeed);
            setGroupFeeds(resp.data.newsFeed);
        })
        .catch(function(err) {
            alert(err);
        })
    }


   return (
    <>
        <h1>새로운 피드</h1>
        {groupJoined === true
        ?
        <>
            {groupFeeds !== null && groupFeeds.length !== 0
            ?
            <table>
                <thead>
                </thead>
                <tbody>
                {
                    groupFeeds.map(function(feed, i){
                        return(
                            <tr key={i}>
                                <td>{feed.grpName}</td>
                                <td>{feed.grpFeedId}</td>
                                <td>{ReactHtmlParser(feed.grpFeedContent)}</td>
                                <td>{feed.grpFeedSetting}</td>
                                <td>{ feed.grpFeedWd.substring(0,10)}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            :
            <p>가입한 그룹에 작성된 피드가 없습니다.</p>
            }
        </>
         :
        <p>가입한 그룹이 없습니다.</p>
        }


        <Link to="/group/CreateGroup">그룹 생성</Link>
        <br />
        <Link to="/group/GroupList">그룹 찾기</Link>
        <br />
        <Link to="/group/MyGroup">내 그룹</Link>
    </>
   )
}