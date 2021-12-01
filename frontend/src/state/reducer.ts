import { Action } from "./actions";
import { AuthAction } from "./actions/auth";
import { DiagnosesAction } from "./actions/diagnoses";
import { MessageAction } from "./actions/message";
import { PatientsAction } from "./actions/patients";
import { SchedulerAction } from "./actions/scheduler";
import { State } from "./state";

import { reducer as patientsReducer } from "./reducers/patients";
import { reducer as diagnosesReducer } from "./reducers/diagnoses";
import { reducer as authReducer } from './reducers/auth';
import { reducer as schedulerReducer } from "./reducers/scheduler";
import { reducer as messageReducer } from "./reducers/message";

export const reducer = (
  { patients, diagnoses, auth, scheduler, message }: State,
  action: Action
): State => ({
  patients: patientsReducer(patients, action as PatientsAction),
  diagnoses: diagnosesReducer(diagnoses, action as DiagnosesAction),
  auth: authReducer(auth, action as AuthAction),
  scheduler: schedulerReducer(scheduler, action as SchedulerAction),
  message: messageReducer(message, action as MessageAction)
});