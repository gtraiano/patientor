import { AuthAction } from "./auth";
import { DiagnosesAction } from "./diagnoses";
import { MessageAction } from "./message";
import { PatientsAction } from "./patients";
import { SchedulerAction } from "./scheduler";

export * from './auth';
export * from './diagnoses';
export * from './message';
export * from './patients';
export * from './scheduler';

export type Action = PatientsAction|DiagnosesAction|AuthAction|SchedulerAction|MessageAction;