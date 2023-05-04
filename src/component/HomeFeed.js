import React, { useState, useEffect } from "react";
import "../styles/FeedPost.css";
import axios from "axios";

const HomeFeed = (feedData, comment, image) => {
    const [favoriteSeq, setFavoriteSeq] = useState(feedData.feedData.favoriteSeq);
    const [isBookmark, setIsBookmark] = useState(false);

    // 댓글 리스트 커스텀 훅=33
    const useCommentList = (feedSeq) => {
        const [commentList, setCommentList] = useState([]);

        useEffect(() => {
            axios.get('http://localhost:3000/getComment', {params: {'feed_seq': feedSeq}})
              .then((response) => {
                  console.log(response.data);
                  setCommentList(response.data.cmtList);
              })
              .catch((error) => {
                  console.log(error);
              })
        }, [feedSeq]);

        return commentList;
    }







    //좋아요
    const onClickLike = () => {
        saveLike(feedData.feedData.seq);
    };

    //북마크
    const onClickBookmark = () => {
        saveBookmark(feedData.feedData.seq);
        setIsBookmark(!isBookmark);
    };
    //좋아요
    const saveLike = async (seq) => {
        try {
            const data = {
                feed_seq: seq,
                id: "test", // login Id
            };
            if (favoriteSeq && favoriteSeq > 0) {
                const response = await axios.delete(
                    `http://localhost:3000/${favoriteSeq}/Favorites`
                );
                setFavoriteSeq(0);
            } else {
                const response = await axios.post(
                    `http://localhost:3000/Favorites`,
                    data
                );
                setFavoriteSeq(response.data);
                console.log(response);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save like");
        }
    };
    //북마크
    const saveBookmark = async (seq) => {
        try {
            const body = {
                feed_seq: seq,
                id: "euna_1", // login Id
            };
            const response = await axios.post("http://localhost:3000/Bookmark", body);
        } catch (error) {
            console.error(error);
            alert("Failed to save bookmark");
        }
    };

    // 댓글 불러오기
    const FeedWithComments = ((props) => {

        const [newComment, setNewComment] = useState("");
        // TO-DO
        const commentList = useCommentList(props.feed.seq);

        //댓글 저장
        const saveComment = async () => {
            await axios.post("http://localhost:3000/Comments", null,{params: {'feed_seq': props.feed.seq, 'id': "euna_1", 'comment': newComment}})
            .then(function(res){
                alert(res.data);
                window.location.reload();
            })
            .catch(function(error){
                alert(error);
            })
        }
            {/*
            try {
                const data = {
                    feed_seq: feedData.feedData.seq,
                    id: "euna_1", // login Id
                    comment: newComment,
                };
                const response = await axios.post("http://localhost:3000/Comments", data);
                window.location.reload();
            } catch (error) {
                console.error(error);
                alert("Failed to save comment");
            }
            */
        };


        const onCommentChange = (event) => {
            setNewComment(event.target.value);
        };

        const onSubmitComment = (event) => {
            event.preventDefault();
            alert('#1');
            saveComment();
        };


        return (
          <>
              <div className="feed-post">

                  <img
                    src="feedimages/icon.png"
                    alt="더보기"
                    style={{ width: 30, height: 30 }}
                  />

                  <div className="post-image">
                      <img src="feedimages/bc.jpg" alt="post" />
                  </div>
                  <div className="post-header">
                      <button onClick={onClickLike}>
                          <img
                            src={
                              "feedimages/" +
                              (favoriteSeq > 0 ? "likeon.png" : "likeoff.png")
                            }
                            alt="좋아요"
                          />
                      </button>
                      <button type="submit">
                          <img
                            src="feedimages/comment.png"
                            alt="댓글"
                            style={{ width: 50, height: 50 }}
                          />

                      </button>

                      <button onClick={onClickBookmark}>
                          <img
                            src={
                              "feedimages/" +
                              (isBookmark ? "bookmarkon.png" : "bookmarkoff.png")
                            }
                            alt="북마크"
                          />
                      </button>
                  </div>
                  {/*post-comment*/}
                  <div className="post-content">
                      <h2 style={{ textAlign: "center" }}>{props.feed.content}</h2>
                  </div>

                  <div className="post-details">
                      <div className="post-details-left">
                          <p>좋아요 {feedData.feedData.favoriteCount}개</p>
                      </div>
                  </div>

              {commentList.map((comment, index) => (
                  <div key={index}>
                      <div>{comment.id}</div>
                      <div>{comment.comment}</div>
                  </div>
              ))}
              <form onSubmit={onSubmitComment}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={onCommentChange}
                    placeholder="댓글달기..."
                  />
                  <button type="submit">게시</button>
              </form>
              </div>
          </>
        )


    })
    return (
        <>
            <FeedWithComments feed={feedData.feedData} />
        </>

      /*
        <div>

            <div className="feed-post">

                <img
                    src="feedimages/icon.png"
                    alt="더보기"
                    style={{ width: 30, height: 30 }}
                />

                <div className="post-image">
                    <img src="feedimages/bc.jpg" alt="post" />
                </div>
                <div className="post-header">
                    <button onClick={onClickLike}>
                        <img
                            src={
                                "feedimages/" +
                                (favoriteSeq > 0 ? "likeon.png" : "likeoff.png")
                            }
                            alt="좋아요"
                        />
                    </button>
                    <button type="submit">
                        <img
                            src="feedimages/comment.png"
                            alt="댓글"
                            style={{ width: 50, height: 50 }}
                        />

                    </button>

                    <button onClick={onClickBookmark}>
                        <img
                            src={
                                "feedimages/" +
                                (isBookmark ? "bookmarkon.png" : "bookmarkoff.png")
                            }
                            alt="북마크"
                        />
                    </button>
                </div>
                post-comment
                <div className="post-content">
                    <h2 style={{ textAlign: "center" }}>{feedData.feedData.content}</h2>
                </div>

                <div className="post-details">
                    <div className="post-details-left">
                        <p>좋아요 {feedData.feedData.favoriteCount}개</p>
                    </div>
                </div>

                <div className="post-comments">
                    {commentList.map((comment) => (
                        <div key={comment.seq}>
                            <span>{comment.id}</span>
                            <span>{comment.content}</span>
                        </div>
                    ))}

                    <div>
                        <p>{feedData.feedData.comment}</p>
                    </div>

                    <form onSubmit={onSubmitComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={onCommentChange}
                            placeholder="댓글달기..."
                        />
                        <button type="submit">게시</button>
                    </form>
                </div>
            </div>
        </div>


    */
    );


};

export default HomeFeed;
