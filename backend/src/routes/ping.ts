import { Router } from 'express';

const ping: Router = Router();

ping.get('/', (_req, res) => {
    res.send('pong');
});

export default ping;