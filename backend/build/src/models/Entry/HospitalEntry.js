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
exports.HospitalEntrySchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BaseEntry_1 = require("./BaseEntry");
;
//export interface IHealthCheckEntryModel extends Model<IHealthCheckEntryDoc> {};
exports.HospitalEntrySchema = new mongoose_1.Schema(Object.assign(Object.assign({}, BaseEntry_1.BaseEntrySchema.obj), { discharge: {
        date: {
            type: String,
            required: true
        },
        criteria: {
            type: String,
            required: true
        }
    } }));
exports.default = mongoose_1.default.model('HospitalEntry', exports.HospitalEntrySchema);
/*HospitalEntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});

export default mongoose.model<HospitalEntry>('HospitalEntry', HospitalEntrySchema);*/
/*const HospitalEntrySchema: Schema = new Schema<HospitalEntry, Model<HospitalEntry>, HospitalEntry>({
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
        //type: [IDiagnosisModel['code']],
        type: {
            type: [String],
            ref: 'Diagnosis'
        },
        required: false,
        default: []
    },
    type: {
        type: String,
        default: EntryType.Hospital,
        required: true
    },
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

HospitalEntrySchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      //returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});

//export default mongoose.model<IHealthCheckEntry>('HealthCheckEntry', HealthCheckEntrySchema);
export default mongoose.model<HospitalEntry>('HealthCheckEntry', HospitalEntrySchema);*/ 
