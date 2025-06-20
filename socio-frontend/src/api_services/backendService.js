import axios from 'axios';

//const API = process.env.NEXT_BACKEND_API_URL;
const API = 'http://localhost:8000/';

const BackendService = {
  getHelloWorld: (accessToken) => {
    return axios.get(API + 'api/hello_world/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
  postLandingPageStartChatBot: (accessToken,data) => {
    return axios.post(API + 'api/lite_store/get_consultant/', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
};

export default BackendService;
