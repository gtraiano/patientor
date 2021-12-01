import { Diagnosis } from "../../types/types";
import { DiagnosesAction } from "../actions/diagnoses";

export interface DiagnosesState {
    [code: string]: Diagnosis
}

const initialState = {};

export const reducer = (state: DiagnosesState = initialState, action: DiagnosesAction): DiagnosesState => {
    switch (action.type) {
        case 'SET_DIAGNOSIS_LIST':
            return action.payload.reduce(
                (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
                {}
            );
        case 'ADD_DIAGNOSIS':
            return Object.assign({}, state, { [action.payload.code]: action.payload });
        case 'REMOVE_DIAGNOSIS':
            return Object.fromEntries(Object.entries(state).filter(([key,]) => key !== action.payload));
        default:
            return state;
    }
};
