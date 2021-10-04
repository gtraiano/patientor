"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api = (0, express_1.Router)();
api.get('/ping', (_req, res) => {
    res.send('pong');
});
exports.default = api;
