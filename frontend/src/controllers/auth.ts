import axios, { clearAuthToken, setAuthToken } from './';
import { apiBaseUrl } from "../constants";
import { Auth, User } from "../types/types";

const decodeAccessToken = (token: string): Auth => {
    // token format: header.payload.signature
    // capture payload
    const accessToken = /^.+\.(.+)\..+$/.exec(token);
    return accessToken && accessToken.length === 2
        ? {
            token,
            ...JSON.parse(atob(accessToken[1])) // decode url64 string
          } as Auth
        : null;
};

export const loginUser = async (username: string, password: string): Promise<Auth> => {
    const response = await axios.post<string>(
        `${apiBaseUrl}/auth`,
        { username, password },
        { withCredentials: true }
    );
    const accessToken = decodeAccessToken(response.data);
    setAuthToken(accessToken?.token);
    return accessToken;
};

export const logoutUser = async (userId: string) => {
    const response = await axios.delete(
        `${apiBaseUrl}/auth`,
        {
            data: { id: userId }
        }
    );
    clearAuthToken();
    return response;
};

export const registerUser = async (username: string, password: string, name?: string, roles?: string[]): Promise<User> => {
    const response = await axios.post<User>(
        `${apiBaseUrl}/users`,
        { username, password, name, roles },
    );
    const user = response.data;
    return user;
};

export const refreshAccessToken = async (): Promise<Auth> => {
    const response = await axios.put<string>(`${apiBaseUrl}/auth`);
    return decodeAccessToken(response.data);
};

export const scheduleRefreshToken = (accessToken: Auth, callback: (token: Auth) => void): NodeJS.Timeout | undefined => {
    if(!accessToken || new Date(accessToken.exp*1000) < new Date()) return undefined;
    const when = Math.max(accessToken.exp*1000 - Date.now() - 10*1000, 0); // 10 secs before token expiration
    const handle = setTimeout(
        () => {
            void refreshAccessToken()
                .then(fresh => {
                    callback(fresh);
                    console.log(`refreshed access token on ${new Date().toString()}`);
                    //localStorage.setItem('auth', JSON.stringify(fresh));
                })
                .catch(error => {
                    console.log(error);
                    return undefined;
                });
        },
        when
    );
    console.log(`access token refresh scheduled to run in ${when/1000} seconds [${new Date(Date.now() + when).toString()}]`);
    return handle;
};