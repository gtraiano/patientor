import { Router } from 'express';

const api: Router = Router();

api.get('/ping', (_req, res) => {
    res.send('pong');
});

export default api;