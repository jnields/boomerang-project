import React, { Component } from 'react';
import { arrayOf, string } from 'prop-types';
import NameTag from './name-tag';
import bs from '../../styles/bootstrap.scss';
import nameTagClasses from '../../styles/name-tag.scss';
import { user as userShape } from '../../helpers/models';

const types = ['5163', '88395'];

export default class NameTagList extends Component {

  static get propTypes() {
    return {
      title: string.isRequired,
      users: arrayOf(userShape).isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: types[0],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ selected: e.target.value });
  }

  render() {
    const { title, users } = this.props;
    return (
      <div>
        <h1 className={bs.hiddenPrint}>{title}</h1>
        <form
          className={[
            bs.formHorizontal,
            bs.hiddenPrint,
          ].join(' ')}
        >
          <fieldset>
            <legend>Select type:</legend>
            {types.map(key => (
              <div className={bs.radioInline} key={key}>
                <label className={bs.radioInline} htmlFor={key}>
                  <input
                    type="radio"
                    value={key}
                    id={key}
                    onChange={this.handleChange}
                    checked={this.state.selected === key}
                  /> AVERY® {key}™
                </label>
              </div>
            ))}
          </fieldset>
        </form>
        <div
          className={[
            nameTagClasses.nameTags,
            bs.clearfix,
          ].join(' ')}
        >
          {users.map(user => (
            <NameTag
              className={nameTagClasses[`a${this.state.selected}`]}
              user={user}
              key={user.id}
            />
          ))}
        </div>
      </div>
    );
  }
}
