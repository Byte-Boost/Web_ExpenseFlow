import axios from 'axios';
import {  getCookie } from 'cookies-next';

// Axios configuration
const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_IP,
  timeout: 30000,
};

// Create an axios instance
const instance = axios.create(axiosConfig);

// Add a request interceptor
instance.interceptors.request.use((config) => {
                //   const userToken = getCookie("token"); 
  
  // Get the authorization value  
  const authorizationValue = 'bear ' + process.env.NEXT_PUBLIC_API_TOKEN;

  // Add the Authorization header
  config.headers.Authorization = authorizationValue;

  return config;
});

export default instance;


