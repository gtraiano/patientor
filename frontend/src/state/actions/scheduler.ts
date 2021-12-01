export type SchedulerAction =
    {
    type: 'ADD_SCHEDULED',
    payload: NodeJS.Timeout
    }
    |
    {
        type: 'REMOVE_SCHEDULED'
    }
    |
    {
        type: 'REMOVE_ALL_SCHEDULED'
    };

export const addScheduled = (id: NodeJS.Timeout): SchedulerAction => {
    return {
        type: 'ADD_SCHEDULED',
        payload: id
    };
};
  
export const removeScheduled = (): SchedulerAction => {
    return {
        type: 'REMOVE_SCHEDULED'
    };
};
  
export const removeAllScheduled = (): SchedulerAction => {
    return {
        type: 'REMOVE_ALL_SCHEDULED'
    };
};