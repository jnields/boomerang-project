import { combineReducers } from "redux";
import items from "./items";
import authorization from "./authorization";
import entities from "./entities";
import itemProperties from "./item-properties";
export default combineReducers({
    entities,
    items,
    authorization,
    itemProperties
});
