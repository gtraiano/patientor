import { Patient } from '../types/types';
import axios from './';

export const fetchPatients = async (): Promise<Patient[]> => {
    const response = await axios.get<Patient[]>(
        '/patients',
    );
    return response.data;
};

export const fetchPatient = async (id: string): Promise<Patient | undefined> => {
    const { data } = await axios.get<Patient>(`/patients/${id}`);
    return data;
};

export default {
    fetchPatients,
    fetchPatient
};