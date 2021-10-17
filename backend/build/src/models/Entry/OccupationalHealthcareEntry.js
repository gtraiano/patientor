"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationalHealthcareEntrySchema = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("../../types");
const BaseEntry_1 = __importDefault(require("./BaseEntry"));
;
exports.OccupationalHealthcareEntrySchema = new mongoose_1.Schema({
    employerName: {
        type: String,
        required: true
    },
    sickLeave: {
        startDate: {
            type: String,
            required: false
        },
        endDate: {
            type: String,
            required: false
        }
    }
});
exports.default = BaseEntry_1.default.discriminator(types_1.EntryType.OccupationalHealthcare, exports.OccupationalHealthcareEntrySchema);
