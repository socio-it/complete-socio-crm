/**
 * axios setup to use mock service
 */

import axios from 'axios';

// prefer NEXT_PUBLIC_BACKEND_URL for frontend requests and fall back to React style
// environment variable or localhost
const axiosServices = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_API_URL || 'http://localhost:8000/'
});

// interceptor for http
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};
