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
  "CriticalRisk" = 3
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheckEntry,
  //type: "HealthCheck",
  healthCheckRating: HealthCheckRating,
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.HospitalEntry,
  //type: "Hospital"
  discharge: Discharge
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcareEntry
  //type: "OccupationalHealthcare",
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
  entries: Entry[]
};