import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

export default class NameTag extends Component {
    render(props) {
        return <dl>
            <dt>Name:</dt>
            <dd>{props.firstName} {props.lastName}</dd>
            <dt>Grade:</dt>
            <dd>{props.grade}</dd>
        </dl>;
    }
}
