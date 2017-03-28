import React, { PropTypes, Component } from "react";
import ItemList from "../components/item-list";
import bs from "../sass/bootstrap";
import styles from "../sass/home";
import { vh50, vh90 } from "../sass/item-list";
import * as schemas from "../helpers/schema";
import { denormalize } from "normalizr";
import printNameTags from "../helpers/print-name-tags";

const infoIcon = [
    bs.glyphicon,
    bs.glyphiconInfoSign,
    bs.textInfo,
    styles.infoIcon
].join(" ");

export default class Home extends Component {

    static get propTypes() {
        const {
            object, number, func, arrayOf, shape
        } = PropTypes;
        return {
            user: object,
            schoolId: number,
            getSchools: func.isRequired,
            selectSchool: func.isRequired,

            submitPatch: func.isRequired,
            submitDelete: func.isRequired,
            addUnsavedItems: func.isRequired,
            assignGroups: func.isRequired,

            toggleEdit: func.isRequired,

            parseFiles: func.isRequired,
            saveChanges: func.isRequired,
            revertChanges: func.isRequired,

            schemas: object.isRequired,

            entities: object.isRequired,

            itemProperties: shape({
                students: arrayOf(object).isRequired,
                teachers: arrayOf(object).isRequired,
                schools: arrayOf(object).isRequired,
            }),

            items: shape({
                students: object.isRequired,
                teachers: object.isRequired,
                schools: object.isRequired,
            }),

        };
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getSchools();
    }

    getItems(obj) {
        return Object.keys(obj).map(key => {
            return obj[key];
        });
    }

    getTeachersAndStudents() {
        const {
            entities,
            items: {
                schools: {
                    selectedItem
                },
                teachers,
                students,
                students: {
                    groupsAssigned
                }
            },
            itemProperties,
            submitPatch,
            submitDelete,
            addUnsavedItems,

            schemas: {
                teacher,
                student
            },

            parseFiles,
            saveChanges,
            revertChanges,
            toggleEdit,
            assignGroups
        } = this.props;
        const schoolId = selectedItem,
            school = denormalize(
                selectedItem,
                schemas.school,
                entities
            );

        return <div className={bs.colMd9}>
            <h2>
                Teachers at {school.name}
                <span className={[infoIcon].join(" ")}
                    onClick={() => {
                        toggleEdit("teachers");
                    }}>
                </span>
            </h2>
                <ItemList
                    className={vh50}
                    items={teachers}
                    schema={teacher}
                    entities={entities}
                    properties={itemProperties.teachers}
                    submitDelete={submitDelete.bind(null, "teachers")}
                    submitPatch={submitPatch.bind(null, "teachers")}
                    revertChanges={revertChanges.bind(null,"teachers")}
                    addUnsavedItems={addUnsavedItems.bind(null, "teachers")}
                    parseFiles={parseFiles.bind(null, "teachers", itemProperties.teachers)}
                    saveChanges={
                        ({unsavedItems, unsavedPatches, unsavedDeletes}) => {
                            saveChanges(
                                "teachers",
                                unsavedItems,
                                unsavedPatches,
                                unsavedDeletes,
                                schoolId
                            );
                        }
                    }
                />
            <div className={bs.clearfix}></div>
            <h2>
                Students at {school.name}
                <span className={[infoIcon].join(" ")}
                    onClick={() => {
                        toggleEdit("students");
                    }}>
                </span>
            </h2>

                <ItemList
                    className={vh50}
                    itemType="students"
                    items={students}
                    entities={entities}
                    schema={student}
                    properties={itemProperties.students}
                    submitDelete={submitDelete.bind(null, "students")}
                    submitPatch={submitPatch.bind(null, "students")}
                    revertChanges={revertChanges.bind(null,"students")}
                    addUnsavedItems={addUnsavedItems.bind(null, "students")}
                    parseFiles={parseFiles.bind(null, "students", itemProperties.students)}
                    saveChanges={
                        ({unsavedItems, unsavedPatches, unsavedDeletes}) => {
                            saveChanges(
                                "students",
                                unsavedItems,
                                unsavedPatches,
                                unsavedDeletes,
                                schoolId
                            );
                        }
                    }
                />
            { groupsAssigned
                ? <span className={bs.helpBlock}>Groups Assigned</span>
                : students.items.length == 0
                    || students.editing
                    || Object.keys(students.unsavedItems).length ? null
                : <button className={[bs.btn, bs.btnSm, bs.btnDefault, styles.mt10, styles.mr5].join(" ")}
                    onClick={()=> {
                        assignGroups(
                            denormalize(
                                students.items,
                                [schemas.student],
                                entities
                            )
                        );
                    }}>
                    Assign Groups
                </button>
            }
            <button onClick={() => {printNameTags(
                    denormalize(
                        students.items,
                        [schemas.student],
                        entities
                    ),
                    school
                );}}
                className={[bs.btn, bs.btnSm, bs.btnDefault, styles.mt10].join(" ")}>
                <span className={[bs.glyphicon, bs.glyphiconPrint, styles.mr5].join(" ")}>
                </span>
                Print Nametags
            </button>
        </div>;
    }
    render() {
        const {
            entities,
            items: {
                schools
            },
            schemas: {
                school
            },
            itemProperties,
            selectSchool,
            submitPatch,
            submitDelete,
            addUnsavedItems,

            parseFiles,
            saveChanges,
            revertChanges,
            //saveUnsavedItems,


            toggleEdit
        } = this.props;

        return <div className={styles.default}>
            <div className={bs.row}>
                <div className={bs.colMd3}>
                    <h2>
                        Schools
                        <span className={[infoIcon].join(" ")}
                            onClick={() => {
                                toggleEdit("schools");
                            }}>
                        </span>
                    </h2>
                        <ItemList
                            className={vh90}
                            itemType="schools"
                            items={schools}
                            schema={school}
                            entities={entities}
                            submitDelete={submitDelete.bind(null, "schools")}
                            onItemSelect={selectSchool}
                            properties={itemProperties.schools}
                            addUnsavedItems={addUnsavedItems.bind(null, "schools")}
                            submitPatch={submitPatch.bind(null, "schools")}
                            saveChanges={
                                ({unsavedItems, unsavedPatches, unsavedDeletes}) => {
                                    saveChanges(
                                        "schools",
                                        unsavedItems,
                                        unsavedPatches,
                                        unsavedDeletes
                                    );
                                }
                            }
                            parseFiles={parseFiles.bind(null, "schools", itemProperties.schools)}
                            revertChanges={revertChanges.bind(null,"schools")}
                        />
                </div>
                {schools.selectedItem  == null ? null : this.getTeachersAndStudents()}
            </div>
        </div>;
    }
}
