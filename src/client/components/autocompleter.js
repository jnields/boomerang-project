import React, { Component, PropTypes } from "react";
import styles from "../sass/autocompleter";

export default class Autocompleter extends Component {

    static get propTypes() {
        return {
            onInput: PropTypes.func.isRequired,
            select: PropTypes.func.isRequired,
            matches: PropTypes.array.isRequired,
            loading: PropTypes.bool,
            displayMatch: PropTypes.func
        };
    }

    constructor(props) {
        super(props);
        this.state = { index: -1 };
    }

    handleKeydown(e) {
        switch(e.key) {
        case "ArrowUp":
            this.setState({
                index: Math.max(-1, this.state.index - 1)
            });
            return;
        case "ArrowDown":
            this.setState({
                index: Math.min(
                    this.props.matches.length - 1,
                    this.state.index + 1
                )
            });
            return;
        case "Enter": {
            const { index } = this.state,
                { select, matches } = this.props;
            if(index >= 0) {
                select(matches[index]);
            }
            return;
        }
        }
    }

    render() {
        return <div className={styles.default}>
            <input type="text"
                onChange={this.props.onInput}
                onKeyDown={this.handleKeydown.bind(this)}
            />
            <ul>
                {this.props.matches.map((match, ix) => {
                    const cn = ix === this.state.index
                        ? styles.active
                        : null;
                    return <li key={ix}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => {
                            this.props.select(match);
                        }}
                        className={cn}>
                        {this.props.displayMatch(match)}
                    </li>;
                })}
            </ul>
        </div>;
    }
}
