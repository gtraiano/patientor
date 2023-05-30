/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { Agent } from 'https';

const apiUrl = 'https://s.icdcodelookup.com/lookUp/search';
// ignore ssl errors
const httpsAgent = new Agent({
    rejectUnauthorized: false
});

const searchTerms = async (terms: string): Promise<unknown> => {
    const { data } = await axios.post(apiUrl, { terms }, { httpsAgent });
    return data;
};

export default {
    searchTerms
};