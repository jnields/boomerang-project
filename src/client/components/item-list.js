import React, { PropTypes } from "react";
//import bs from "../sass/bootstrap";

ItemList.propTypes = {
    
    print: PropTypes.func,
    itemType: PropTypes.string.isRequired,

    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onItemSelect: PropTypes.func,

    unsavedItems: PropTypes.arrayOf(PropTypes.object).isRequired,

    properties: PropTypes.arrayOf(PropTypes.object).isRequired,

    isPosting: PropTypes.func.isRequired,
    isPatching: PropTypes.func.isRequired,
    isDeleting: PropTypes.func.isRequired,
    isGetting: PropTypes.bool.isRequired,
    isParsing: PropTypes.bool.isRequired,

    parseFiles: PropTypes.func.isRequired,
    
    saveChanges: PropTypes.func.isRequired,
    saveUnsavedItems: PropTypes.func.isRequired,

    parseError: PropTypes.string,
    getError: PropTypes.string

};
export default function ItemList(props) {
    const { items, properties } = props;
    return <div>
        <table>
            <thead>
                <tr>
                    <td>&nbsp;</td>
                    {properties.map((property,ix) => {
                        return <th key={ix}>{property.header}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {items.map((item,ix) => {
                    return <tr key={ix}>{getCells(item, properties)}</tr>;
                })}
            </tbody>
        </table>
    </div>;
}

function getCells(item, properties) {
    return [
        <td>
            
        </td>,
        ... properties.map(
            (property,ix) => <td key={ix}>{getCellContent(item,property)}</td>
        )
    ];    
}
function getCellContent(item, property) {
    switch(property.type) {
    case "number":
        return <input 
            type="number" 
            value={property.getValue(item)}
            onChange={e => {
                property.onChange(item, e.target.value);
            }}
            required={property.required}
            min={property.min}
            max={property.max}/>;
    case "select":
        return <select 
                onChange={e => {
                    property.onChange(item, e.target.value);
                }}
                value={property.getValue(item)}
                required={property.required}>
            {property.required ? null : <option value=""></option>}
            {property.options.map(
                (option,ix) => <option
                        key={ix}
                        value={option.value}
                        disabled={option.disabled}>
                    {option.display}
                </option>
            )}
        </select>;
    case "text":
        return <input type="text"            
            value={property.getValue(item)}
            onChange={e => {
                property.onChange(item, e.target.value);
            }}
            required={property.required}
            maxLen={property.maxLen}/>;
    case "date":
        return <input type="date"
            onChange={e => {
                property.onChange(item, e.target.value);
            }}
            value={property.getValue(item)}
            min={property.min}
            max={property.max}/>;
    
    }
}
