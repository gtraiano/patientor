import axios from './';

interface IUserInfo {
    id: string,
    username: string,
    name?: string,
    roles: [{ name: string, id: string }]
}

export const fetchUsers = async (): Promise<IUserInfo[]> => {
    const response = await axios.get<IUserInfo[]>(
        '/users',
    );
    return response.data;
};

export const fetchUser = async (id: string): Promise<IUserInfo | undefined> => {
    const { data } = await axios.get<IUserInfo>(`/users/${id}`);
    return data;
};

export default {
    fetchUsers,
    fetchUser
};