import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import { uid } from 'rand-token';
import { RefreshToken as IRefreshToken } from '../types';
import config from '../config';

export class InvalidCredentials extends Error {
    constructor(message: string = 'invalid username or password') {
        super(message);
        this.name = "InvalidCredentials";
    }
}

const generateRefreshToken = async (userId: string, expires: Date): Promise<IRefreshToken> => {
    return {
        token: await jwt.sign(uid(config.security.tokens.refreshTokenLength), config.security.keys.REFRESH_TOKEN_SIGN_KEY as string),
        userId,
        expires
    };
}

const saveRefreshToken = async (token: IRefreshToken) => {
    // save refresh token in db
    try {
        await RefreshToken.create(token);
    }
    catch(error: any) {
        if(error.name === 'ValidationError') { // edge case: user attempts log in after not having logged out
            console.log('user already has refresh token stored'); // overlook error, could implement system for multiple active refresh tokens for same user id
        }
        else throw error;
    }
}

const loginUser = async (userObj: { username: string, password: string }) => {
    const user = await User.findOne({ username: userObj.username }).populate('roles');
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(userObj.password, user.password)

    if (!(user && passwordCorrect)) {
        throw new InvalidCredentials('invalid username or password');
    }
    
    // prepare access token payload
    const userForToken = {
        username: user.username,
        id: user._id,
        name: user.name,
        roles: user.roles.map(role => role.name as string)
    }
    // generate access token
    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_KEY as string, { expiresIn: config.accessToken.expiresIn });
    
    // generate & save refresh token
    const refreshToken = await generateRefreshToken(user.id, config.refreshToken.cookie.methods.expires());
    await saveRefreshToken(refreshToken);
    
    return {
        accessToken,
        refreshToken
    };
}

const logoutUser = async (userId: string) => {
    return await RefreshToken.findOneAndDelete({ userId });
}

const refreshAccessToken = async (refreshToken: IRefreshToken) => {
    const retrieved = await RefreshToken.findOne({ token: refreshToken.token });
    // verify against sign key
    jwt.verify(refreshToken.token, process.env.REFRESH_TOKEN_KEY as string);
    const user = await User.findOne({ _id: retrieved?.userId }).populate('roles');

    if(!user) {
        throw new Error('user id does not exist');
    }
    
    const userForToken = {
        username: user.username,
        id: user._id,
        name: user.name,
        roles: user.roles.map(role => role.name as string)
    }
    // generate new access token
    const accessToken = jwt.sign(userForToken, config.security.keys.ACCESS_TOKEN_SIGN_KEY as string, { expiresIn: config.accessToken.expiresIn });
    return accessToken;
}

const revokeRefreshToken = async (token: string): Promise<void> => {
    await RefreshToken.findOneAndDelete({ token });
}

export default {
    loginUser,
    logoutUser,
    revokeRefreshToken,
    refreshAccessToken
}