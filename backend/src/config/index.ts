import dotenv from 'dotenv';
dotenv.config();

const refreshTokenOptions = {
    httpOnly: true,
    secure: true
};

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const ACCESS_TOKEN_SIGN_KEY = process.env.ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_SIGN_KEY = process.env.REFRESH_TOKEN_KEY;

const expires = () => new Date(Date.now() + 24*60*60*1000);

export default {
    refreshToken: {
        cookie: {
            name: 'refreshToken',
            options: refreshTokenOptions,
            methods: {
                expires
            }
        },
    },
    accessToken: {
        expiresIn: '15m',
        name: 'accessToken'
    },
    app: {
        PORT
    },
    routes: {
        api: {
            root: '/api',
            auth: '/auth',
            diagnoses: '/diagnoses',
            patients: '/patients',
            icdc: '/icdclookup',
            users: '/users',
            ping: '/ping'
        }
    },
    db: {
        MONGODB_URI
    },
    security: {
        https: { // ssl
            SSL_CRT_FILE: process.env.SSL_CRT_FILE,
            SSL_KEY_FILE: process.env.SSL_KEY_FILE
        },
        keys: { // token sign keys
            ACCESS_TOKEN_SIGN_KEY,
            REFRESH_TOKEN_SIGN_KEY
        },
        bcrypt: {
            saltRounds: 10
        },
        tokens: {
            refreshTokenLength: 256
        }
    }
}