import React, { PropTypes, Component } from "react";
import bs from "../sass/bootstrap";
import fa from "../sass/font-awesome";
import styles from "../sass/item-list";
import { denormalize } from "normalizr";
import patchRecursive from "../helpers/patch-recursive";

export default class ItemList extends Component {

    static get propTypes() {
        const {
            shape,
            func,
            string,
            number,
            object,
            arrayOf,
            bool

        } = PropTypes;

        return {

            print: func,
            onItemSelect: func,
            revertChanges: func.isRequired,
            addUnsavedItems: func.isRequired,
            properties: arrayOf(object).isRequired,
            parseFiles: func.isRequired,
            saveChanges: func.isRequired,
            submitPatch: func.isRequired,
            submitDelete: func.isRequired,
            schema: object.isRequired,
            entities: object.isRequired,

            items: shape({
                items: arrayOf(number).isRequired,
                anyChanges: bool.isRequired,
                editing: bool.isRequired,
                selectedItem: number,
                unsavedItems: object.isRequired,
                unsavedPatches: object.isRequired,
                unsavedDeletes: object.isRequired,
                pendingPatches: object.isRequired,
                pendingDeletes: object.isRequired,
                errors: shape({
                    patches: object.isRequired,
                    deletes: object.isRequired,
                    posts: object.isRequired
                }).isRequired,
                pendingPosts: object.isRequired,
                isParsing: bool.isRequired,
                parseError: object,
                getError: string,
                saving: bool.isRequired,
                saveError: string
            }).isRequired
        };
    }

    constructor(props) {
        super(props);
        this.helpBubbles = {};
        this.state = {
            error: null,
            mouse: {
                x: 0,
                y: 0
            }
        };
    }

    selectItems() {
        const {
            schema,
            entities,
            items: {
                items,
                unsavedPatches,
                pendingPatches
            }
        } = this.props;
        return denormalize(
            items,
            [schema],
            entities
        ).reduce(
            (result, item) => {
                if (item != null) {
                    result.push(item);
                }
                return result;
            },
            []
        ).map(item => {
            return patchRecursive(
                patchRecursive(item, pendingPatches[item.id] || {}),
                unsavedPatches[item.id] || {}
            );
        });
    }

    isPatching(item) {
        const {items: {pendingPatches}} = this.props;
        return pendingPatches[item.id] != null;
    }

    isDeleting(item) {
        const { items: { pendingDeletes }} = this.props;
        return pendingDeletes[item.id] != null;
    }

    isPosting(item) {
        const { items: { pendingPosts }} = this.props;
        return pendingPosts[item.id] != null;
    }

    getIcon(item, showTrash) {
        const { submitDelete, items: {editing} } = this.props,
            pending = !editing && (
                this.isPatching(item)
                || this.isDeleting(item)
                || this.isPosting(item)
            ),
            trash = [
                bs.glyphicon,
                bs.glyphiconTrash,
                bs.textDanger,
                styles.trash
            ].join(" ");
        if (editing || showTrash) {
            return <span className={trash} onClick={submitDelete.bind(null, item.id)}>
            </span>;
        } else if (pending) {
            const spinner = [
                fa.fa,
                fa.faSpinner,
                fa.faSpin
            ].join(" ");
            return <span className={spinner}></span>;
        } else {
            return "\u00A0";
        }
    }

    getItemRows(items, readonly, showTrash) {
        const {
            onItemSelect,
            items: {
                selectedItem,
                editing,
                unsavedDeletes
            }
        } = this.props;


        return items.map((item, ix) => {
            if (unsavedDeletes[item.id]) {
                return null;
            }
            const classes =[];
            if (selectedItem != null
                    && selectedItem === item.id) {
                classes.push(styles.selectedItem);
            } else if (onItemSelect&& item.id > 0 && !editing) {
                classes.push(styles.selectable);
            }
            const error = this.getError(item);

            if (error) {
                classes.push(
                    bs.bgDanger,
                    bs.textDanger
                );
            }

            item = { ... item, id: item.id || -ix - 1};
            return <tr className={classes.join(" ")}
                key={item.id}
                onMouseEnter={e => {
                    this.setState({
                        error,
                        item,
                        mouse: {
                            x: e.clientX,
                            y: e.clientY
                        }
                    });
                }}
                onMouseMove={e => {
                    this.setState({
                        error,
                        item,
                        mouse: {
                            x: e.clientX,
                            y: e.clientY
                        }
                    });
                }}
                onMouseLeave={() => {
                    return this.setState({
                        error: null,
                        item: null,
                        mouse: {
                            x: 0,
                            y: 0
                        }
                    });
                }}
                onClick={() =>{
                    if (editing || item.id === selectedItem) {
                        return;
                    }
                    if (item.id > 0)
                        onItemSelect && onItemSelect(item.id);
                    else {
                        onItemSelect && onItemSelect(null);
                    }
                }}>
                {this.getCells(item, readonly, showTrash)}
            </tr>;
        });
    }

    getError(item) {
        const { items: {errors }} = this.props;
        return errors.deletes[item.id]
            || errors.patches[item.id]
            || errors.posts[item.id];
    }

    getCells(item, readonly, showTrash) {
        const {
            properties,
            items: { editing }
        } = this.props;
        const pending = !editing && (
                this.isPatching(item)
                || this.isDeleting(item)
                || this.isPosting(item)
            ),
            content = this.getIcon(item, showTrash);
        return [
            <td key={0}>
                {content}
                {this.getHelpBubble(item)}
            </td>,
            ... properties.map(
                (property, ix) => {
                    const sign = item.id > 0 ? 1 : -1,
                        key = item.id + (ix * sign);
                    return <td key={key}>
                        {this.getCellContent(
                            item,
                            property,
                            pending || readonly
                        )}
                    </td>;
                }
            )
        ];
    }

    getCellContent(item, property, readonly) {
        const { submitPatch, items: {unsavedPatches }} = this.props;
        switch(property.type) {
        case "number": {
            let input;
            return <input
                type="number"
                className={bs.formControl}
                placeholder={readonly ? null: property.header.toLowerCase()}
                value={property.getValue(item, unsavedPatches[item.id])|| ""}
                onChange={e => {
                    submitPatch(item.id, property.onChange(item,e.target.value));
                }}
                readOnly={readonly}
                required={property.required}
                min={property.min}
                max={property.max}/>;
        }
        case "select": {
            return <select
                    className={bs.formControl}
                    onChange={e => {
                        submitPatch(item.id, property.onChange(item, e.target.value));
                    }}
                    disabled={readonly}
                    value={property.getValue(item, unsavedPatches[item.id])||""}
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
        }
        case "text": {
            return <input type="text"
                className={bs.formControl}
                value={property.getValue(item, unsavedPatches[item.id]) || ""}
                readOnly={readonly}
                placeholder={readonly ? null: property.header.toLowerCase()}
                onChange={e => {
                    submitPatch(item.id, property.onChange(item, e.target.value));
                }}
                required={property.required}
                maxLength={property.maxLength}/>;
        }
        case "password": {
            return <input type="text"
                className={bs.formControl}
                value={property.getValue(item, unsavedPatches[item.id]) || ""}
                readOnly={readonly}
                placeholder={readonly ? "••••••••••••" : property.header.toLowerCase()}
                onChange={e => {
                    submitPatch(item.id, property.onChange(item, e.target.value));
                }}
                required={property.required}
                maxLength={property.maxLength}/>;
        }
        case "date":{
            return <input type="date"
                className={bs.formControl}
                readOnly={readonly}
                onChange={e => {
                    submitPatch(item.id, property.onChange(item, e.target.value));
                }}
                value={property.getValue(item, unsavedPatches[item.id]) || ""}
                min={property.min}
                max={property.max}/>;
        }
        }

    }

    getHelpBubble(item) {
        if (this.state.error == null
                || this.state.item == null
                || this.state.item.id !== item.id) {
            return null;
        }
        return <div className={[styles.helpBubble, bs.alert, bs.alertDanger].join(" ")}
            ref={helpBubble => this.helpBubbles[item.id] = helpBubble}
            style={{
                left: this.state.mouse.x + 10,
                top: this.state.mouse.y
            }}
            onMouseMove={e=> {
                this.setState({
                    mouse: {
                        x: e.clientX,
                        y: e.clientY
                    }
                });
            }}>
            {this.state.error}
        </div>;
    }

    selectUnsavedItems() {
        const {
            items: {
                unsavedItems
            }
        } = this.props;
        return Object
        .keys(unsavedItems)
        .map(key => unsavedItems[key])
        .filter(o=>o?true:false)
        .sort((a,b)=>a<b);
    }

    getButtons() {
        const {
            items: {
                unsavedItems,
                unsavedPatches,
                unsavedDeletes,
                editing,
                anyChanges,
                saving
            },
            saveChanges,
            revertChanges
        } = this.props;
        if (!editing && !anyChanges) return null;
        return <div className={styles.cancelOk}>
            <button className={[
                bs.btn,
                bs.btnSm,
                bs.btnPrimary,
                styles.mr5
            ].join(" ")}
                onClick={revertChanges}>Cancel</button>
            <button className={[
                bs.btn,
                bs.btnSm,
                bs.btnDefault,
                styles.mr5
            ].join(" ")}
            onClick={() =>{
                anyChanges ?
                    saveChanges({
                        unsavedItems,
                        unsavedDeletes,
                        unsavedPatches
                    })
                    : revertChanges();
            }} disabled={saving}>
                {!saving ? null : <span className={
                    [fa.fa, fa.faSpinner, fa.faSpin, styles.mr5].join(" ")
                }></span>}
                Save
            </button>
        </div>;
    }

    getSaveFeedback() {
        const { items: { saveError } } = this.props;
        const classes = [
            bs.alert,
            bs.alertDanger
        ];
        if (saveError) {
            return <div className={classes.join(" ")}>
                {saveError}
            </div>;
        }
        return null;
    }

    getParseFeedback(){
        const { items: {parseError} } = this.props;
        if(parseError == null) return null;
        const classes = [
            bs.alert,
            bs.alertDanger
        ];
        return <div className={classes.join(" ")}>
            {parseError.message}
        </div>;
    }

    render() {
        const {
            items: {
                unsavedItems,
                editing,
                isParsing,
            },
            properties,
            addUnsavedItems,
            onItemSelect,
            parseFiles,
        } = this.props;
        let files;
        const tableClass = (onItemSelect
            ? [bs.table, styles.tableHover]
            : [bs.table]).join(" ");

        return <div className={styles.default}>
            <div className={styles.scrollBox}>
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            {properties.map((property,ix) => {
                                return <th key={ix}>{property.header}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.getItemRows(this.selectItems(), !editing)}
                        {
                            unsavedItems.length === 0
                            ? null
                            : <tr className={styles.divider}>
                                <td colSpan={properties.length + 1}>
                                </td>
                              </tr>
                        }
                        {this.getItemRows(this.selectUnsavedItems(), false, true)}
                        <tr>
                            <td>
                                <button className={[bs.btn, bs.btnSm, bs.btnDefault, styles.addBtn].join(" ")}
                                        onClick={addUnsavedItems.bind(null, [{}])}>
                                    <span className={[bs.glyphicon, bs.glyphiconPlus].join(" ")}></span>
                                </button>
                            </td>
                            <td colSpan={properties.length}>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={styles.cancelOk}>
                <label className={[
                    styles.fileButton,
                    bs.btn,
                    bs.btnSm,
                    bs.btnPrimary
                ].join(" ")}>
                    <span className={(isParsing
                        ? [fa.fa, fa.faSpinner, fa.faSpin, styles.mr5]
                        : [fa.fa, fa.faUpload, styles.mr5]
                    ).join(" ")}></span>
                    Upload via Excel
                    <input type="file"
                        ref={ref => files=ref}
                        onChange={
                            e => {
                                parseFiles(e.target.files);
                                files.value = "";
                            }
                        }/>
                </label>
                {this.getParseFeedback()}
                {this.getButtons()}
                {this.getSaveFeedback()}
            </div>
        </div>;
    }
}
