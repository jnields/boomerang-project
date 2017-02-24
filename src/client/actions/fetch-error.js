import { FETCH_ERROR } from "./types";
export default function fetchError(fetchType, dispatcher) {
    return {
        type: FETCH_ERROR,
        fetchType,
        dispatcher
    };
}
