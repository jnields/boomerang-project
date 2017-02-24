import { connect } from "react-redux";
import { parseSpreadsheet } from "../actions";
import DragAndDrop from "../components/drag-and-drop";


export default connect(
    ({files}) => {
        return { files };
    },
    dispatch => {
        return {
            onDrop: e => {
                e.preventDefault();
                dispatch(
                    parseSpreadsheet(e.target.files || e.dataTransfer.files)
                );
            },
            onChange: e => {
                e.preventDefault();
                dispatch(
                    parseSpreadsheet(e.target.files || e.dataTransfer.files)
                );
            },
        };
    }
)(DragAndDrop);
