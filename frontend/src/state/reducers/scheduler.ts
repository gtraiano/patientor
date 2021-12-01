import { SchedulerAction } from "../actions/scheduler";

export type SchedulerState = NodeJS.Timeout[];

const initialState = [] as NodeJS.Timeout[];

export const reducer = (state: SchedulerState = initialState, action: SchedulerAction): SchedulerState => {
    switch(action.type) {
        case "ADD_SCHEDULED":
            return [...state, action.payload];
        case "REMOVE_SCHEDULED":
            return state.slice(1);
        case "REMOVE_ALL_SCHEDULED":
            return [];
        default:
            return state;
    }
};
