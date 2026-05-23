import { RefreshToken } from "../types";

export const loggedInUsers = new Map<RefreshToken["userId"], RefreshToken>();

export const getSession = (userId: string): RefreshToken | undefined => {
    const session = loggedInUsers.get(userId);
    if(!session) return undefined;
    if(new Date() > session.expires) {
        loggedInUsers.delete(userId);
        return undefined;
    }
    return session;
};

export const setSession = (userId: RefreshToken["userId"], token: RefreshToken) => {
    loggedInUsers.set(userId, token);
};

export const deleteSession = (userId: RefreshToken["userId"]) => {
    loggedInUsers.delete(userId);
}