import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const refreshTokenOptions = {
    httpOnly: true,
    secure: true
};

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
        PORT: Number.parseInt(process.env.PORT as string) || 3001,
        HOST: process.env.HOST || 'localhost',
        SERVE_STATIC: process.env.SERVE_STATIC && path.resolve(__dirname, process.env.SERVE_STATIC as string),
        PROTOCOLS:  process.env.PROTOCOLS
            ? process.env.PROTOCOLS.split(/\s*,\s*/)
                .filter(p => p.length)
                .map(p => p.toUpperCase())
            : ['HTTPS']
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
        MONGODB_URI: process.env.MONGODB_URI
    },
    security: {
        https: { // ssl
            // file paths
            SSL_CRT_FILE: process.env.SSL_CRT_FILE,
            SSL_KEY_FILE: process.env.SSL_KEY_FILE,
            // keys as strings
            SSL_CRT: process.env.SSL_CRT,
            SSL_KEY: process.env.SSL_KEY,
        },
        keys: { // token sign keys
            ACCESS_TOKEN_SIGN_KEY: process.env.ACCESS_TOKEN_KEY,
            REFRESH_TOKEN_SIGN_KEY: process.env.REFRESH_TOKEN_KEY
        },
        bcrypt: {
            saltRounds: 10
        },
        tokens: {
            refreshTokenLength: 256
        }
    }
}
