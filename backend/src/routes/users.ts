import { Router } from "express";
import usersService from '../services/users';

const usersRouter: Router = Router();

usersRouter.get('/', async (_req, res) => {
    res.json(await usersService.getUsers());
});

usersRouter.get('/:id', async (req, res) => {
    const found = await usersService.getUser(req.params.id);
    found ? res.json(found) : res.status(404).end();
});

usersRouter.delete('/:id', async (req, res) => {
    try {
        await usersService.removeUser(req.params.id);
        res.sendStatus(200);
    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

usersRouter.post('/', async (req, res) => {
    try {
        const user = await usersService.createUser(req.body);
        res.status(201).json(user);

    }
    catch(error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default usersRouter;