import { CTSSAPIResponse } from '../components/SearchICDCode';
import axios from './';

export const postICDCLookup = async (terms: string) => {
    const response = await axios.post<CTSSAPIResponse>('/icdclookup', { terms });
    return response.data;
};