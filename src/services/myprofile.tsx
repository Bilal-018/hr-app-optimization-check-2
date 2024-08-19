import axios from 'axios';
//import authHeader from './AuthHeader';

const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;
const devURL = process.env.REACT_APP_API_LEAVE_SERVICE_URL;

class UserService {
  async getProfileRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: API_URL + url,
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

  async postRequest(url: any, postData: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'post',
        url: url,
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

  async getProfilePictureURLRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: API_URL + url,
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

  async getProfilePrivateRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: API_URL + url,
        headers: {
          'Content-Type': 'text/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: ' Bearer ' + barrerToken,
        },
      })
      return response;
    } catch (error) {
      return this.handleError(error);
    };
  }

  async updateProfileDataRequest(url: any, postData: any, barrerToken: any) {
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
      return response;
    } catch (error) {
      return this.handleError(error);
    };
  }

  /* Get Bank Details */
  async getGetBankDetailsRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: API_URL + url,
        headers: {
          'Content-Type': 'text/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: ' Bearer ' + barrerToken,
        },
      })
      return response;
    } catch (error) {
      return this.handleError(error);
    };
  }

  async updateBankDetailsRequest(url: any, postData: any, barrerToken: any) {
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

  /* Get Documents Details */
  async GetDocumentListRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: API_URL + url,
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

  async uploadDocumentsDataRequest(url: any, postData: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'post',
        url: API_URL + url,
        data: postData,
        headers: {
          'content-type': 'multipart/form-data',
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

  async uploadBankDocumentRequest(url: any, postData: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'post',
        url: API_URL + url,
        data: postData,
        headers: {
          //"content-type": "multipart/form-data",
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

  async deleteDocumentRequest(url: any, barrerToken: any, filename: any) {
    try {
      const response: any = await axios({
        method: 'delete',
        url: API_URL + url,
        headers: {
          'Content-Type': 'text/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: ' Bearer ' + barrerToken,
        },
      })
      const blob = await response.blob();
      // create "a" HTML element with href to file & click
      const href = URL.createObjectURL(blob);
      console.log(href);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', filename); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (error) {
      return this.handleError(error);
    }
  }
  async downloadDocumentRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: API_URL + url,
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
    }
  }
  /**********************Get Assets data********************** */
  async GetAssetsListDataRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: API_URL + url,
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
    }
  }
  /**********************Get Leaves data********************** */

  async GetLeavesListDataRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: devURL + url,
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
    }
  }

  async GetLeavesConfigurationDataRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: devURL + url,
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
    }
  }

  async GetCaluclateLeavesDataRequest(
    url: any,
    postData: any,
    barrerToken: any
  ) {
    try {
      const response = await axios({
        method: 'post',
        url: devURL + url,
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
    }
  }

  async createNewLeaveRequest(url: any, postData: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'post',
        url: devURL + url,
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
    }
  }

  async GetLeavesHistoryListDataRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: devURL + url,
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
    }
  }

  async GetManagerLeavesListDataRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: devURL + url,
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
    }
  }

  async ApproveLeavesRequest(url: any, postData: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'post',
        url: devURL + url,
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
    }
  }
  async DeleteLeavesRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'delete',
        url: devURL + url,
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
    }
  }

  //Get all the managers list
  async GetmanagersListDataRequest(url: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'get',
        url: API_URL + url,
        headers: {
          'Content-Type': 'text/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: ' Bearer ' + barrerToken,
        },
      })
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /* getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }*/
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();
