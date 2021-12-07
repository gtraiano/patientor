export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Discharge {
  date: string,
  criteria: string
}

export enum EntryType {
  HealthCheckEntry = "HealthCheck",
  HospitalEntry = "Hospital",
  OccupationalHealthcareEntry = "OccupationalHealthcare"
}

export interface SickLeave {
  startDate: string,
  endDate: string
}

interface BaseEntry {
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
  "CriticalRisk" = 3,
  "Undetermined" = -1
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheckEntry,
  healthCheckRating: HealthCheckRating,
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.HospitalEntry,
  discharge: Discharge
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcareEntry
  employerName: string,
  sickLeave?: SickLeave
}

export type Entry =
| HospitalEntry
| OccupationalHealthcareEntry
| HealthCheckEntry;

export type EditEntry  = Entry & { id: string };

export type Patient = {
  id: string,
  name: string,
  ssn: string,
  dateOfBirth: string,
  gender: Gender,
  occupation: string,
  entries: Entry[],
  healthRating: HealthCheckRating
};

export interface AcessToken {
  token: string,
  exp: number,
  iat: number,
  id: string,
  username: string,
  name?: string,
  roles: [string]
}

export interface User {
  id: string,
  name?: string,
  username: string,
  password: string,
  createdAt: number,
  roles: [string]
}

export type Auth = AcessToken | null;

export enum MessageVariation {
  error = 'error',
  info = 'info',
  warning = 'warning',
  success = 'success'
}

export interface Message {
  text: {
    header?: string,
    content?: string
  },
    type: MessageVariation,
    show: boolean
}