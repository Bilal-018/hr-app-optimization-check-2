import axios from 'axios';
//import authHeader from './AuthHeader';

const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;

class loginService {
  async validateLoginUserRequest(url: any, postData: any) {
    return await axios({
      method: 'post',
      url: API_URL + url,
      data: postData,
      headers: {
        'Content-Type': 'text/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error;
      });
  }

  async authenticatingUserTokenRequest(url: any, token: any) {
    try {
      const response = await axios({
        method: 'post',
        url: API_URL + url,
        headers: {
          'Content-Type': 'text/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: ' Bearer ' + token,
        },
      })
      return response.data;
    } catch (error) {
      return this.handleError(error);
    };
  }

  async updateFirsttimePasswordRequest(
    url: any,
    postData: any,
    barrerToken: any
  ) {
    try {
      const response = await axios({
        method: 'post',
        url: API_URL + url,
        data: postData,
        headers: {
          'Content-Type': 'text/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: ' Bearer ' + barrerToken,
        },
      })
      return response.data;
    } catch (error) {
      return this.handleError(error);
    };
  }

  async updateforgetPasswordRequest(url: any, postData: any) {
    return await axios({
      method: 'post',
      url: API_URL + url,
      data: postData,
      headers: {
        'Content-Type': 'text/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error;
      });
  }

  async getTokenrequest(url: any, postData: any) {
    return await axios({
      method: 'get',
      url: API_URL + url,
      data: postData,
      headers: {
        'Content-Type': 'text/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error;
      });
  }

  private async handleError(error: any) {
    if (error.response && error.response.status === 401) {
      const authDataString = sessionStorage.getItem('token');
      if (!authDataString) {
        // Handle the case where authData is null
        return Promise.reject(new Error('Authentication failed', { cause: error }));
      }

      const authData = JSON.parse(authDataString);

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
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new loginService();
