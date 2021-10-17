"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckEntrySchema = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("../../types");
const BaseEntry_1 = __importDefault(require("./BaseEntry"));
;
exports.HealthCheckEntrySchema = new mongoose_1.Schema({
    healthCheckRating: {
        type: Number,
        required: true,
        enum: {
            values: Object.values(types_1.HealthCheckRating),
            message: '{VALUE} is not supported'
        }
    }
});
exports.default = BaseEntry_1.default.discriminator(types_1.EntryType.HealthCheck, exports.HealthCheckEntrySchema);
