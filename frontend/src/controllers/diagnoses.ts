import axios from './';
import { Diagnosis } from '../types/types';

export const getDiagnoses = async () => {
    const response = await axios.get<Diagnosis[]>('/diagnoses');
    return response.data;
};

export const getDiagnosis = async (code: string) => {
    const response = await axios.get<Diagnosis>(`/diagnoses/${code}`);
    return response.data;
};

export const postDiagnosis = async (diagnosis: Diagnosis) => {
    const response = await axios.post<Diagnosis>(`diagnoses`, diagnosis);
    return response.data;
};

export const putDiagnosis = async (code: string, diagnosis: Diagnosis) => {
    const response = await axios.put<Diagnosis>(`diagnoses/${code}`, diagnosis);
    return response.data;
};

export const deleteDiagnosis = async (code: string) => {
    await axios.delete<void>(`/diagnoses/${code}`);
};