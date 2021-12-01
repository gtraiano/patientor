import { Auth } from "../../types/types";

export type AuthAction =
    {
        type: 'LOGIN',
        payload: Auth
    }
    |
    {
        type: 'LOGOUT'
    };

export const loginUser = (auth: Auth): AuthAction => {
    return {
        type: 'LOGIN',
        payload: auth
    };
};
    
export const logoutUser = (): AuthAction => {
    return {
        type: 'LOGOUT'
    };
};