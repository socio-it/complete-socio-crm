import axios from 'axios';

//const API = process.env.NEXT_BACKEND_API_URL;
const API = 'http://localhost:8000/';
const AGENTS_API = 'http://localhost:8080/';

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
  },
  postHandleCleanChatBot: (accessToken,data) => {
    return axios.post(AGENTS_API + 'v2/v2/clean_consultant_agent_memory', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },

  // -------------------------------
  // Outlook Tasks Section
  // -------------------------------
  getOutlookTasks: (accessToken) => {
    return axios.get(API + 'api/lite_store/get_tenant_tasks/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
  patchOutlookTasks: (accessToken,id, data) => {
    return axios.put(API + `api/lite_store/get_tenant_tasks/${id}`, data ,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
  deleteOutlookTasks: (accessToken,id) => {
    return axios.delete(API + `api/lite_store/get_tenant_tasks/${id}` ,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
  getExecuteTask: (accessToken,id) => {
    return axios.get(API + `api/lite_store/execute_task/${id}` ,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
};

export default BackendService;
