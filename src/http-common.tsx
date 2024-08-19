import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_API_PROFILE_SERVICE_URL + '/api/',
  headers: {
    'Content-type': 'application/json',
  },
});
