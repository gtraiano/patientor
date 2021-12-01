import { Message } from "../../types/types";
import { MessageAction } from "../actions/message";

export type MessageState = Message | null;

const initialState = null;

export const reducer = (state: MessageState = initialState, action: MessageAction): MessageState => {
    switch(action.type) {
        case "DISPLAY_MESSAGE":
            return {
                ...action.payload,
                show: true
            };
        case "CLEAR_MESSAGE":
            return null;
        default:
            return state;
    }
};