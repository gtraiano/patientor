import { Message } from "../../types/types";

export type MessageAction =
    {
        type: 'DISPLAY_MESSAGE',
        payload: Omit<Message, 'show'>
    }
    |
    {
        type: 'CLEAR_MESSAGE'
    };

export const displayMessage = (msg: Omit<Message, 'show'>): MessageAction => {
    return {
        type: "DISPLAY_MESSAGE",
        payload: msg
    };
};
  
export const clearMessage = (): MessageAction => {
    return {
        type: 'CLEAR_MESSAGE'
    };
};