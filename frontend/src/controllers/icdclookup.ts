import { SearchResults } from '../components/SearchICDCode';
import axios from './';

export const postICDCLookup = async (terms: string) => {
    const response = await axios.post<SearchResults>('/icdclookup', { terms });
    return response.data;
};