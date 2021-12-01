import React, { createContext, useContext, useReducer } from "react";
import { Action } from "./actions";
import { AuthState } from "./reducers/auth";
import { DiagnosesState } from "./reducers/diagnoses";
import { MessageState } from "./reducers/message";
import { PatientsState } from "./reducers/patients";
import { SchedulerState } from "./reducers/scheduler";

export interface State {
  patients: PatientsState;
  diagnoses: DiagnosesState;
  auth: AuthState,
  scheduler: SchedulerState,
  message: MessageState
}

const initialState: State = {
  patients: {},
  diagnoses: {},
  auth: null,
  scheduler: [] as NodeJS.Timeout[],
  message: null
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
