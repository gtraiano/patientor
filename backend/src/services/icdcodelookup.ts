/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';

const apiUrl = 'https://s.icdcodelookup.com/lookUp/search';

const searchTerms = async (terms: string): Promise<unknown> => {
    const { data } = await axios.post(apiUrl, { terms });
    return data;
};

export default {
    searchTerms
};