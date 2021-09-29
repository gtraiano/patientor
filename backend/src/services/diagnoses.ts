import { Diagnosis } from '../types';
import Validation from '../utils/validation';
import DiagnosisModel from '../models/Diagnosis'

const getDiagnoses = async (): Promise<Array<Diagnosis>> => {
    const diag = await DiagnosisModel.find({});
    return diag.map(d => d.toJSON());
}

const addDiagnosis = async (diagnosis: unknown): Promise<Diagnosis> => {
    const newDiagnosis = Validation.parseDiagnosis(diagnosis);
    const diag = await DiagnosisModel.create(newDiagnosis);
    return diag.toJSON();
    //return newDiagnosis;
};

const editDiagnosis = async (diagnosis: Diagnosis): Promise<Diagnosis> => {
    const edited = await DiagnosisModel.findOneAndUpdate({ code: diagnosis.code }, diagnosis);
    if(!edited) {
        throw new Error(`Diagnosis code ${diagnosis.code} does not exist`);
    }
    return edited/*.toJSON()*/;
}

const removeDiagnosis = async (code: string): Promise<Diagnosis> => {
    const deleted = await DiagnosisModel.findOneAndDelete({ code: code });
    if(!deleted) {
        throw new Error(`Diagnosis code ${code} does not exist`);
    }
    return deleted.toJSON();
}

const findByCode = async (code: string): Promise<Diagnosis|undefined|null> => {
    const diagnosis = await DiagnosisModel.findOne({ code: code });
    return diagnosis?.toJSON();
}

export default {
    getDiagnoses,
    addDiagnosis,
    editDiagnosis,
    removeDiagnosis,
    findByCode
};