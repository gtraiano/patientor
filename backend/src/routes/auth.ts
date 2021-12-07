import authService from '../services/auth';
import { Router } from "express";
import config from '../config';

const authRouter: Router = Router();

authRouter.post('/', async (request, response) => {
// on user login
    const body = request.body;
    try {
        // generate tokens
        const { accessToken, refreshToken } = await authService.loginUser(body);
        // respond with access token and refresh token as cookie
        response
            .status(200)
            .cookie(
                config.refreshToken.cookie.name,
                refreshToken,
                {
                    ...config.refreshToken.cookie.options,
                    expires: config.refreshToken.cookie.methods.expires()
                }
            )
            .send(accessToken);
    }
    catch(error: any) {
        response.status(401).json({ error: error.message });
    }
});

authRouter.delete('/', async (request, response) => {
// on user logout
    try {
        // remove refresh token from db
        const deleted = await authService.logoutUser(request.body.id);
        response
            .status(200)
            .clearCookie(
                config.refreshToken.cookie.name,
                { ...config.refreshToken.cookie.options, expires: deleted?.expires }
            )
            .end();
    }
    catch(error: any) {
        response.status(500).json({ error: error.message });
    }
});

authRouter.put('/', async (request, response, next) => {
// user asks for access token refresh
    try {
        const refreshToken = request.cookies[config.refreshToken.cookie.name];
        //if(!refreshToken) return response.status(401).json({ error: 'invalid refresh token' });
        const accessToken = await authService.refreshAccessToken(refreshToken);
        response.status(200).send(accessToken);
    }
    catch(error) {
        console.log('access token refresh error');
        return next(error);
    }
})

export default authRouter;