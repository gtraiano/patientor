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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrySchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
;
exports.EntrySchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    specialist: {
        type: String,
        required: true
    },
    diagnosisCodes: {
        type: [String],
        ref: 'Diagnosis',
        required: false,
        //default: []
    },
    type: {
        type: String,
        enum: {
            values: Object.keys(types_1.EntryType),
            message: '{VALUE} is not supported'
        },
        required: true
    },
    // hospital entry
    discharge: {
        date: {
            type: String,
            required: function () {
                return this.type === types_1.EntryType.Hospital;
            }
        },
        criteria: {
            type: String,
            required: function () {
                return this.type === types_1.EntryType.Hospital;
            }
        }
    },
    // health check entry
    healthCheckRating: {
        type: Number,
        required: function () {
            return this.type === types_1.EntryType.HealthCheck;
        },
        enum: {
            values: Object.values(types_1.HealthCheckRating),
            message: '{VALUE} is not supported'
        }
    },
    // occupational healthcare
    employerName: {
        type: String,
        required: function () {
            return this.type === types_1.EntryType.OccupationalHealthcare;
        }
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
exports.EntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
exports.default = mongoose_1.default.model('Entry', exports.EntrySchema);
