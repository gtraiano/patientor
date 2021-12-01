import { Patient } from "../../types/types";
import { PatientsAction } from "../actions/patients";

export interface PatientsState {
    [id: string]: Patient
}

const initialState = {};

export const reducer = (state: PatientsState = initialState, action: PatientsAction): PatientsState => {
    switch (action.type) {
        case "SET_PATIENT_LIST":
            return action.payload.reduce(
                (memo, patient) => ({ ...memo, [patient.id]: patient }),
                {}
            );
        case "ADD_PATIENT":
            return Object.assign({}, state, { [action.payload.id]: action.payload });
        case "REMOVE_PATIENT":
            return Object.fromEntries(Object.entries(state).filter(([key,]) => key !== action.payload));
        default:
            return state;
    }
};