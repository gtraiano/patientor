/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
//import { Agent } from 'https';
//import { CTSSAPIResponse } from '../../../frontend/src/components/SearchICDCode'

//const apiUrl = 'https://s.icdcodelookup.com/lookUp/search';
const apiUrl = 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search';
// ignore ssl errors
/*const httpsAgent = new Agent({
    rejectUnauthorized: false
});*/

const searchTerms = async (terms: string): Promise<unknown> => {
    const { data } = await axios.get(apiUrl, { params: { terms, sf: "code,name", maxList: "" } });
    return [terms, ...data];
};

export default {
    searchTerms
};