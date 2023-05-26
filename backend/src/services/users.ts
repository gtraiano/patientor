import UserModel from "../models/User";
import RoleModel from "../models/Role";
import { NewUser, UserRoles, User } from "../types";
import Validation from "../utils/validation";
import bcrypt from 'bcrypt';
import config from "../config";

const hashPassword = async (plainText: string, saltRounds: number = config.security.bcrypt.saltRounds): Promise<string> => {
    return await bcrypt.hash(plainText, saltRounds);
};

const getUsers = async (): Promise<User[] | []> => await UserModel.find({}).populate('roles');

const getUser = async (id: string): Promise<User | null> => await UserModel.findById(id).populate('roles');

const createUser = async (userObj: NewUser): Promise<User> => {
    const user = new UserModel({
        ...Validation.parseUser(userObj),
        password: await hashPassword(userObj.password),
        roles: userObj.roles && userObj.roles.length
            ? await Promise.all(userObj.roles.map(async r => (await RoleModel.findOne({ name: r.name }))?._id))
            : [(await RoleModel.findOne({ name: UserRoles.User}))?._id], // default role is user if no role(s) defined
        createdAt: Date.now()
    });
    return await (await user.save()).populate('roles');
};

const removeUser = async (id: string) : Promise<void> => {
    await UserModel.findByIdAndDelete(id);
};

export default {
    getUsers,
    getUser,
    createUser,
    removeUser
};