import axios from 'axios';

const API = process.env.NEXT_BACKEND_API_URL;

const BackendService = {
  getHelloWorld: (accessToken) => {
    console.log(accessToken,'http://localhost:8000/' + 'api/hello_world/')
    return axios.get('http://localhost:8000/' + 'api/hello_world/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
};

export default BackendService;
