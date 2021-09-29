import { State } from "./state";
import { Patient, Diagnosis } from "../types/types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: 'REMOVE_PATIENT'
      payload: string
    }
  | {
      type: 'ADD_DIAGNOSIS';
      payload: Diagnosis;
    }
  | {
      type: 'SET_DIAGNOSIS_LIST';
      payload: Diagnosis[];
    }
  | {
      type: 'REMOVE_DIAGNOSIS',
      payload: string
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "REMOVE_PATIENT":
      return {
        ...state,
        patients: Object.fromEntries(
          Object.entries(state.patients).filter(([key,]) => key !== action.payload)
        )
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "ADD_DIAGNOSIS":
      return {
        ...state,
        diagnoses: {
          ...state.diagnoses,
          [action.payload.code]: action.payload
        }
      };
    case "REMOVE_DIAGNOSIS":
      return {
        ...state,
        diagnoses: Object.assign(
          {},
          Object.fromEntries(
            Object.entries(state.diagnoses).filter( ([key, ]) => key !== action.payload)
          )
        )
      };
    default:
      return state;
  }
};

export const setPatientList = (list: Patient[]): Action => {
  return {
    type: 'SET_PATIENT_LIST',
    payload: list
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: 'ADD_PATIENT',
    payload: patient
  };
};

export const removePatient = (id: string): Action => {
  return {
    type: 'REMOVE_PATIENT',
    payload: id
  };
};

export const setDiagnosisList = (list: Diagnosis[]): Action => {
  return {
    type: 'SET_DIAGNOSIS_LIST',
    payload: list
  };
};

export const addDiagnosis = (diagnosis: Diagnosis): Action => {
  return {
    type: 'ADD_DIAGNOSIS',
    payload: diagnosis
  };
};

export const removeDiagnosis = (code: string): Action => {
  return {
    type: 'REMOVE_DIAGNOSIS',
    payload: code
  };
};