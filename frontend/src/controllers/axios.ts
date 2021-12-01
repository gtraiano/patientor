import axios from 'axios';

//axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = true;

export const setAuthToken = (token: string | null | undefined) => {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token || ''}` };
    //axios.defaults.withCredentials = true;
};

export const clearAuthToken = () => {
    axios.defaults.headers.common = {};
    //axios.defaults.withCredentials = false;
};

export default axios;