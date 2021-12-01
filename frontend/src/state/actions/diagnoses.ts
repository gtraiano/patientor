import { Diagnosis } from "../../types/types";

export type DiagnosesAction = 
    {
        type: 'ADD_DIAGNOSIS';
        payload: Diagnosis;
    }
    |
    {
        type: 'SET_DIAGNOSIS_LIST';
        payload: Diagnosis[];
    }
    |
    {
        type: 'REMOVE_DIAGNOSIS',
        payload: string
    };

export const setDiagnosisList = (list: Diagnosis[]): DiagnosesAction => {
    return {
        type: 'SET_DIAGNOSIS_LIST',
        payload: list
    };
};
    
export const addDiagnosis = (diagnosis: Diagnosis): DiagnosesAction => {
    return {
        type: 'ADD_DIAGNOSIS',
        payload: diagnosis
    };
};
    
export const removeDiagnosis = (code: string): DiagnosesAction => {
    return {
        type: 'REMOVE_DIAGNOSIS',
        payload: code
    };
};