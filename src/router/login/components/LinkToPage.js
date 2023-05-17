import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from "styled-components";

const Container = styled.div`
    padding: 10px;
`;

const ListWrapper = styled.ul`
    font-size: 15px;
    color: sky;

    li {
        margin: 10px;
    }
`
const LinkToPage = () => {
    return (
        <Container>
            <ListWrapper>
                <li>Paw-ential 가입하기!!</li>
                <li><Link to="/register">Register</Link></li>
                <li>아아디/비밀번호를 잊으셨나요? </li>
                <li><Link to="/login/findAccount">Find ID / Find PASSWORD</Link></li>
            </ListWrapper>
        </Container>
    );
}

export default LinkToPage;