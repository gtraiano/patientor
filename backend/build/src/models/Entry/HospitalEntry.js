"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalEntrySchema = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("../../types");
const BaseEntry_1 = __importDefault(require("./BaseEntry"));
;
exports.HospitalEntrySchema = new mongoose_1.Schema({
    discharge: {
        date: {
            type: String,
            required: true
        },
        criteria: {
            type: String,
            required: true
        }
    }
});
exports.default = BaseEntry_1.default.discriminator(types_1.EntryType.Hospital, exports.HospitalEntrySchema);
