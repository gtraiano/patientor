import { Auth } from "../../types/types";
import { AuthAction } from "../actions/auth";

export type AuthState = Auth | null | 'pending';

const initialState: AuthState = null;

export const reducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
    switch(action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            return null;
        default:
            return state;
    }
};