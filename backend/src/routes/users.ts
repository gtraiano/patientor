import { Router } from "express";
import mongoose from "mongoose";
import { CustomError } from "../middlewares/error";
import usersService from '../services/users';

const usersRouter: Router = Router();

usersRouter.get('/', async (_req, res) => {
    res.json(await usersService.getUsers());
});

usersRouter.get('/:id', async (req, res, next) => {
    try {
        const found = mongoose.Types.ObjectId.isValid(req.params.id) && await usersService.getUser(req.params.id);
        found ? res.json(found) : res.status(404).end();
    }
    catch(error: any) {
        //res.status(400).end();
        next(new CustomError(`Failed to retrieve user id ${req.params.id}`, 400));
    }
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