import axios from 'axios';

const apiUrl: string = 'https://s.icdcodelookup.com/lookUp/search';

const searchTerms = async (terms: string): Promise<any> => {
    const { data } = await axios.post(apiUrl, { terms });
    return data;
}

export default {
    searchTerms
}