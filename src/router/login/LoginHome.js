import React from 'react';
import { styled, keyframes } from "styled-components";

import SimpleSNSLogin from './components/LoginSNS';
import LinkToPage from './components/LinkToPage';
import LoginForm from './components/LoginForm';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1000px;
    
    animation: ${fadeIn} 3s;
`;

const LoginBox = styled.div`
    width: 500px;
    padding: 40px;
    border-radius: 10px;
    background-color: white;
    text-align: center;

    box-shadow: 2px 3px 5px 0px;
`; 

const Title = styled.h1`
  font-size: 40px;
  text-align: center;
  margin: 20px;
`
function Login(){

  return (
    <Container>
      <LoginBox>
        <Title>Paw-Tential</Title>
        <LoginForm />
        <SimpleSNSLogin />
        <LinkToPage />
      </LoginBox>
    </Container>
  )

}

export default Login;