import { combineReducers } from "redux";
import items from "./items";
import authorization from "./authorization";
import entities from "./entities";

export default combineReducers({
    entities,
    items,
    authorization
});
