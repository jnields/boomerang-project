import { connect } from "react-redux";
import ItemList from "../components/item-list";
import denormalize from "normalizr";
import { schema } from "../helpers";
function mapStateToProps({ entities, students }) {
    return {
        type: "students",
        items: denormalize(
            students,
            schema.students,
            entities.students
        ),
    };
}
export default connect(mapStateToProps, null)(ItemList);
