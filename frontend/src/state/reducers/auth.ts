import { Auth } from "../../types/types";
import { AuthAction } from "../actions/auth";

export type AuthState = Auth | null;

const initialState = null;

export const reducer = (state: Auth = initialState, action: AuthAction): AuthState => {
    switch(action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            return null;
        default:
            return state;
    }
};