import http from '../http-common';
import axios from 'axios';

// let tokensData = JSON.parse(sessionStorage.getItem('token'));

const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;

let tokensDataString = sessionStorage.getItem('token');
let tokensData: any;

if (tokensDataString) {
  tokensData = JSON.parse(tokensDataString);
} else {
  // Handle the case where tokensDataString is null
}

class UploadFilesService {
  upload(path: any, file: any, onUploadProgress: any) {
    let formData = new FormData();
    var url = process.env.REACT_APP_API_PROFILE_SERVICE_URL + '/api/' + path;
    formData.append('file', file);
    console.log(url);
    try {
      return http.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: ' Bearer ' + tokensData.token,
        },
        onUploadProgress,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  // getFiles() {
  //   return http.get("/files");
  // }

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
export default new UploadFilesService();
