import { XHR_ERROR } from "./types";
export default function xhrError(xhrType, dispatcher) {
    return {
        type: XHR_ERROR,
        xhrType ,
        ... (dispatcher || {})
    };
}
