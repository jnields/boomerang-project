import Home from "../components/home";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import * as schemas from "../helpers/schema";
import * as actions from "../actions/items";
import { generateGroups } from "../actions/group-generation";

export default connect(
    state => {
        return {
            user: denormalize(
                state.authorization.user,
                schemas.user,
                state.entities
            ),
            schoolId: state.authorization.schoolId,

            items: state.items,

            itemProperties: state.itemProperties,

            entities: state.entities,

            schemas,

            isPosting: (type, obj) => {
                return state.items[type][obj.id];
            },
            isPatching: (type, obj) => {
                return state.items[type].pendingPatches[obj.id];
            },
            isDeleting: (type, obj) => {
                return state.items[type].pendingDeletes[obj.id];
            }
        };
    },
    { ... actions, assignGroups: generateGroups}
)(Home);
