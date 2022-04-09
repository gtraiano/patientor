import axios from 'axios';
import { apiBaseUrl } from '../constants';

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = false;

export const setAuthToken = (token: string | null | undefined) => {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token || ''}` };
};

export const clearAuthToken = () => {
    axios.defaults.headers.common = { ...axios.defaults.headers.common, 'Authorization' : 'Bearer ' };
};

export default axios;