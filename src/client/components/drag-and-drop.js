import React, { Component, PropTypes } from "react";
import styles from "../sass/drag-and-drop";


function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    return false;
}

function onDragging(dragging, e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({dragging});
}


export default class DragAndDrop extends Component {

    constructor(props) {
        super(props);
    }
    static get propTypes() {
        return {
            onDrop: PropTypes.func.isRequired,
            onChange: PropTypes.func.isRequired,
            files: PropTypes.array,
            maxSize: PropTypes.number
        };
    }

    render() {
        const {onDrop, files = [], maxSize, onChange} = this.props;
        const filenames = files.map(file => file.name).join(", ");
        let invalid, invalidMessage;
        files.forEach(file => {
            if (file.size > maxSize) {
                invalid = true;
                invalidMessage = "Size of file exceeds maximum size.";
            }
        });
        const className = invalid ? styles.invalid : styles.default
            + this.state.dragging ? " " + styles.dragging : "";
        return <div
                    className={className}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragStart={onDragging.bind(this,true)}
                    onDragEnd={onDragging.bind(this,false)}>
            {invalidMessage || filenames}
            <label><input onChange={onChange} type="file"/>Choose a file</label>
            {" "}or drag one here
        </div>;
    }
}
