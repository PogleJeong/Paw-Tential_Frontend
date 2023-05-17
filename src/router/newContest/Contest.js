import axios from "axios"
import { useEffect } from "react";
import { useState } from "react"
import { Carousel } from "react-bootstrap";
import ContestList from "../../component/ContestList";

export default function Contest(props) {

    return (
        <>
        {props.data && props.data.length !== 0 ? (
            <Carousel>
            {props.data.map(list => {
                return (
                    <Carousel.Item key={list.seq}>
                        <ContestList data={list} fn={props.fn}/>
                    </Carousel.Item>
                )
            })
            }
            </Carousel>
        ) : (
            <p>진행중인 콘테스트가 없습니다.</p>
        )}
        </>
    )
}