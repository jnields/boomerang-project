import ItemList from "../components/item-list";
import { connect } from "react-redux";
import denormalize from "normalizr";
import { schema } from "../helpers";

function mapStateToProps({entities, teachers}) {
    return {
        type: "teachers",
        items: denormalize(
            teachers,
            schema.teachers,
            entities.teachers
        )
    };
}

export default connect(mapStateToProps, null)(ItemList);
