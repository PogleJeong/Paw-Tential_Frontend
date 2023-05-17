import { useEffect, useState } from "react";
import CreateContestModal from "../newContest/modal/CreateContestModal";
import Contest from "./Contest";
import axios from 'axios';

export default function PawtenContest (props) {

     // 진행중인 컨테스트 및 당첨자 피드 불러오기
     const [contest, setContest] = useState([]);
     const getContest = async () => {
         axios.get("http://localhost:3000/contest/getContestAndWinners")
         .then(function(res){
             setContest(res.data.contest);
         })
         .catch(function(err){
             alert(err);
         })
     }

    const [createContestModal, setCreateContestModal] = useState(false);

    useEffect(()=>{
        getContest();
    },[])

    return (
        <>
        <CreateContestModal show={createContestModal} onHide={()=>{setCreateContestModal(false)}} reset={getContest} />
        <div className="col-lg-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">포텐 콘테스트🎉</h4>
                    </div>
                    {props.userId === 'contestAdmin' && (
                    <div className="card-header-toolbar d-flex align-items-center">
                        <div className="dropdown">
                            <div className="dropdown-toggle" id="dropdownMenu Button01" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                <i className="ri-more-fill h4" />
                            </div>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton01">
                                <a className="dropdown-item" href="javascript:void(0)" onClick={()=>{setCreateContestModal(true)}}>
                                    <i className="ri-pencil-fill me-2" />
                                    콘테스트 작성
                                </a>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            <div className="card-body">
            <Contest data={contest} fn={getContest} />
            </div>
        </div>
    </div>
    </>
    )
}