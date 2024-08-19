import axios from 'axios';

const base_url = process.env.REACT_APP_API_PROFILE_SERVICE_URL + 'api/';

const barrerToken = sessionStorage.getItem('token_key');
const empId = sessionStorage.getItem('empId_key');

const skills: any = axios.create({
  baseURL: base_url,
  headers: {
    'Content-Type': 'text/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    Authorization: ' Bearer ' + barrerToken,
  },
});

class SkillsService {
  async getSkillDashboardForManagers() {
    return await this.makeRequest('/GetSkillDashboardForManager');
  }

  async getSkillConfigurations() {
    return await this.makeRequest2('/SkillConfiguration/GetSkillConfigurationList');
  }

  async getSkillExpertiesConfigurations() {
    return await this.makeRequest2('/SkillConfiguration/GetSkillExpertiseList');
  }

  async GetSkillListDataRequest(empployeeDetailId = empId) {
    return await this.makeRequest(
      '/EmployeeSkill/GetSkillDashboardByEmployeeDetailId?EmployeeDetailId=' +
      empployeeDetailId
    );
  }

  async deleteSkillRequest(id: any) {
    return await this.makeRequest('/EmployeeSkill/DeleteEmployeeSkills?EmployeeSkillId=' + id, 'delete');
  }

  async createNewSkillRequest(url: any, postData: any, barrerToken: any) {
    try {
      const response = await axios({
        method: 'post',
        url: base_url + url,
        data: postData,
        headers: {
          //"content-type": "multipart/form-data",
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
  //
  //manager
  async GetManagerSkillListDataRequest() {
    return await this.makeRequest('/SkillManager/GetSkillDashboardForManager');
  }

  async GetSkillDashboardByExpertise() {
    return await this.makeRequest('/GetSkillDashboardByExpertise');
  }

  async GetSkillByEmployeeDetailId(empployeeDetailId = empId) {
    return await this.makeRequest(`/GetSkillByEmployeeDetailId?EmployeeDetailId=${empployeeDetailId}`);
  }

  async GetSkillDetailBySkillConfigurationId(
    skillConfigurationId: any,
    skillExpertise: any
  ) {
    return await this.makeRequest(
      `/GetSkillDetailBySkillConfigurationId?SkillExpertise=${skillExpertise}&SkillConfigurationId=${skillConfigurationId}`
    );
  }

  private async makeRequest(url: string, method= 'get', data: any = {}) {
    try {
      const response = await skills[method](url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async makeRequest2(url: string, method= 'get', data: any = {}) {
    try {
      const response = await skills[method](url, data);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
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
        process.env.REACT_APP_API_PROFILE_SERVICE_URL + 'api/Authenticate/RefreshToken',
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

export default SkillsService;
