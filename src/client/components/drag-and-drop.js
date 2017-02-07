import React, { PropTypes } from "react";
import styles from "../sass/drag-and-drop";


function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    return false;
}

export default function DragAndDrop({onDrop, files = [], maxSize, onChange}) {
    const filenames = files.map(file => file.name).join(", ");
    let invalid, invalidMessage;
    files.forEach(file => {
        if (file.size > maxSize) {
            invalid = true;
            invalidMessage = "Size of file exceeds maximum size.";
        }
    });

    return <div
            className={invalid ? styles.invalid : styles.default}
            onDrop={onDrop}
            onDragOver={onDragOver}>
        {invalidMessage || filenames}
        <label><input onChange={onChange} type="file"/>Choose a file</label>
        {" "}or drag one here
    </div>;
}

DragAndDrop.propTypes = {
    onDrop: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    files: PropTypes.array,
    maxSize: PropTypes.number
};
