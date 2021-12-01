import { Patient } from "../../types/types";

export type PatientsAction = 
    {
        type: "SET_PATIENT_LIST";
        payload: Patient[];
    }
    |
    {
        type: "ADD_PATIENT";
        payload: Patient;
    }
    |
    {
        type: 'REMOVE_PATIENT'
        payload: string
    };

export const setPatientList = (list: Patient[]): PatientsAction => {
    return {
        type: 'SET_PATIENT_LIST',
        payload: list
    };
};
  
export const addPatient = (patient: Patient): PatientsAction => {
    return {
        type: 'ADD_PATIENT',
        payload: patient
    };
};
  
export const removePatient = (id: string): PatientsAction => {
    return {
        type: 'REMOVE_PATIENT',
        payload: id
    };
};