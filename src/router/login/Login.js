import React from 'react';
import { LinkToPage, LoginForm, SimpleSNSLogin } from '../../component/Login';

function Login(){

  return (
    <div>
      <h1>Paw-Tential LOGIN</h1>
      <LoginForm />
      <SimpleSNSLogin />
      <LinkToPage />
    </div>
  )

}

export default Login;