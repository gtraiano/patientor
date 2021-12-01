export interface Diagnosis {
    code: string,
    name: string,
    latin?: string
}

export interface Discharge {
    date: string,
    criteria: string
}

interface SickLeave {
    startDate: string,
    endDate: string
}

export interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnosis['code']>,
    type: string
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}

export enum EntryType {
    HealthCheck = "HealthCheck",
    Hospital = "Hospital",
    OccupationalHealthcare = "OccupationalHealthcare"
}
  
export interface HealthCheckEntry extends BaseEntry {
    type: EntryType.HealthCheck,
    //type: "HealthCheck",
    healthCheckRating: HealthCheckRating,
}

export interface HospitalEntry extends BaseEntry {
    type: EntryType.Hospital,
    //type: "Hospital"
    discharge: Discharge
}

export interface OccupationalHealthcareEntry extends BaseEntry {
    type: EntryType.OccupationalHealthcare
    //type: "OccupationalHealthcare",
    employerName: string,
    sickLeave?: SickLeave
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export type EditEntry  = Entry & { id: string };

export type NewEntry = Omit<Entry,'id'>;

export type Patient = {
    id: string,
    name: string,
    ssn: string,
    dateOfBirth: string,
    gender: Gender,
    occupation: string,
    entries: Entry[]
};

export type PatientFormValues = {
    name: string,
    dateOfBirth: string,
    gender: Gender,
    occupation: string,
};

export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = Omit<Patient, 'id' | 'entries'>;

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
}

export enum Roles {
    User = 'user',
    Admin = 'admin',
    Moderator = 'moderator'
}

export interface Role {
    name: Roles
}

export interface User {
    id: string,
    name?: string,
    username: string,
    password: string,
    createdAt: number,
    roles: [Role]
}

export type NewUser = Omit<User, 'id' | 'createdAt'>

export interface AccessToken {
    token: string,
    /*username: string,
    name?: string,
    roles?: string[]*/
}

export interface RefreshToken {
    token: string,
    userId: string,
    expires: Date
}