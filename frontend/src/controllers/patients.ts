import { PatientFormValues } from '../components/AddPatientModal/AddPatientForm';
import { Patient } from '../types/types';
import axios from './';

export const getPatients = async (): Promise<Patient[]> => {
    const response = await axios.get<Patient[]>('/patients');
    return response.data;
};

export const getPatient = async (id: string): Promise<Patient | undefined> => {
    const { data } = await axios.get<Patient>(`/patients/${id}`);
    return data;
};

export const postPatient = async (values: PatientFormValues) => {
    const response = await axios.post<Patient>(
        `/patients`,
        values
    );
    return response.data;
};

export const putPatient = async (patientId: string, patient: PatientFormValues) => {
    const response = await axios.put<Patient>(
        `/patients/${patientId}`,
        Object.fromEntries(Object.entries(patient).filter(([key,]) => !['id', 'entries'].includes(key)))
    );
    return response.data;
};

export const deletePatient = async (id: string) => {
    await axios.delete(`/patients/${id}`);
};

export const putPatientEntry = async (patientId: string, entryId: string, entry: any) => {
    const response = await axios.put<Patient>(`/patients/${patientId}/entries/${entryId}`, { id: entryId, ...entry });
    return response.data;
};

export const postPatientEntry = async (patientId: string, entry: any) => {
    const response = await axios.post<Patient>(`/patients/${patientId}/entries`, entry);
    return response.data;
};

export const deletePatientEntry = async (patientId: string, entryId: string) => {
    const response = await axios.delete<Patient>(`/patients/${patientId}/entries/${entryId}`);
    return response.data;
};

export default {
    getPatients,
    getPatient
};