import React from 'react';
import Loader from '../components/Global/Loader';
import service from '../services/loginService';
import { useNavigate } from 'react-router-dom';

function Authentication() {
  const navigate = useNavigate();

  const searchParams = window.location.search.slice(1);
  const urlSearchParams: any = new URLSearchParams(searchParams);
  const token = atob(urlSearchParams.get('t'));
  void authenticateToken(token, navigate);

  return (
    <>
      <Loader />
      {/* <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh'
}}>
    <h2 style={{textAlign:'center', color:'black'}}>Authenticating...</h2>
  </div> */}
    </>
  );
}

const authenticateToken = async (token: any, navigate: any) => {
  try {
    let url = 'api/Authenticate/TokenAuthentication';
    let response = await service.authenticatingUserTokenRequest(url, token);
    const base_url = process.env.REACT_APP_BASE_URL;

    if (response.statusCode === 200) {
      sessionStorage.setItem('token', JSON.stringify(response));
      sessionStorage.setItem('token_key', response.token);
      sessionStorage.setItem(
        'fullname',
        response.employeedetail.firstName +
          ' ' +
          response.employeedetail.lastName
      );
      sessionStorage.setItem('roles', response.userRoles);
      sessionStorage.setItem(
        'empId_key',
        response.employeedetail.employeeDetailId
      );
      sessionStorage.setItem('email_key', response.employeedetail.email);
      navigate('/dashboard');
    } else {
      window.location.href = base_url + '/login';
    }
  } catch (error) {
    console.log(error);
  }
};

export default Authentication;
