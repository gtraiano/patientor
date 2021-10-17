"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const types_1 = require("../types");
const BaseEntry_1 = require("./Entry/BaseEntry");
;
const PatientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    ssn: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: Object.values(types_1.Gender),
            message: '{VALUE} is not supported'
        }
    },
    occupation: {
        type: String,
        required: true
    },
    entries: {
        type: [BaseEntry_1.BaseEntrySchema],
        required: true,
        default: []
    }
});
PatientSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
PatientSchema.method('toPublicPatient', function () {
    return {
        id: this._id.toString(),
        name: this.name,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        occupation: this.occupation
    };
});
PatientSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('Patient', PatientSchema, 'Patients');
