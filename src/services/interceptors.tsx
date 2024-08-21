/* eslint-disable eqeqeq */
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;
const API_URL2 = process.env.REACT_APP_API_LEAVE_SERVICE_URL;
//console.log("API_URL: "+API_URL);

function parseJson<T>(json: string): T {
  return JSON.parse(json) as T;
}

const jwtInterceoptor = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'text/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    Authorization: '',
  },
}) as AxiosInstance;

jwtInterceoptor.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  let tokensData: string | null = sessionStorage.getItem('token');
  if (tokensData !== null) {
    const parsedTokensData = parseJson<{ token: string }>(tokensData);
    config.headers.Authorization = 'Bearer ' + parsedTokensData.token;
  }
  return config;
});

jwtInterceoptor.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const authData: string | null = sessionStorage.getItem('token');
      if (authData !== null) {
        const parsedAuthData = parseJson<{ employeedetail: { email: string }, refreshToken: string }>(authData);
        const payload = {
          email: parsedAuthData.employeedetail.email,
          refreshToken: parsedAuthData.refreshToken,
        };

        let apiResponse = await axios.post(
          API_URL + 'api/Authenticate/RefreshToken',
          payload
        );
        if (apiResponse.data.status && apiResponse.data.status != 'Error')
          sessionStorage.setItem('token', JSON.stringify(apiResponse.data));

        if (error.config) {
          error.config.headers.Authorization = 'Bearer ' + apiResponse.data.token;
          return axios(error.config);
        } else {
          return Promise.reject(new Error('Error', { cause: error }));
        }
      }
    } else {
      return Promise.reject(new Error('Error', { cause: error }));
    }
  }
);

export default jwtInterceoptor;

const jwtLeave = axios.create({
  baseURL: API_URL2,
  headers: {
    'Content-Type': 'text/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    Authorization: '',
  },
});

jwtLeave.interceptors.request.use((config: any) => {
  const tokensData = sessionStorage.getItem('token');
  if (tokensData !== null) {
    const parsedTokensData = JSON.parse(tokensData);
    config.headers.Authorization = 'Bearer ' + parsedTokensData.token;
  }
  return config;
});

jwtLeave.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    if (error.response && error.response.status === 401) {
      const authDataString = sessionStorage.getItem('token');
      if (!authDataString) {
        // Handle the case where authData is null
        return Promise.reject(new Error('Authentication failed', { cause: error }));
      }

      const authData = JSON.parse(authDataString);

      //const barrerToken = sessionStorage.getItem("token_key");
      //const empId = sessionStorage.getItem("empId_key");
      const payload = {
        email: authData.employeedetail.email,
        refreshToken: authData.refreshToken,
      };

      let apiResponse = await axios.post(
        API_URL + 'api/Authenticate/RefreshToken',
        payload
      );
      if (apiResponse.data.status && apiResponse.data.status != 'Error')
        sessionStorage.setItem('token', JSON.stringify(apiResponse.data));

      error.config.headers.Authorization = 'Bearer ' + apiResponse.data.token;
      return axios(error.config);
    } else {
      return Promise.reject(new Error('Error', { cause: error }));
    }
  }
);

export { jwtLeave };
