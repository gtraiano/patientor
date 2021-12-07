import { apiBaseUrl } from '../constants';
import { Patient } from '../types/types';
import axios from './axios';

export const fetchPatients = async (): Promise<Patient[]> => {
    const response = await axios.get<Patient[]>(
        `${apiBaseUrl}/patients`,
    );
    return response.data;
};

export const fetchPatient = async (id: string): Promise<Patient | undefined> => {
    const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
    return data;
};

export default {
    fetchPatients,
    fetchPatient
};