import React, { Component } from 'react';
import { string } from 'prop-types';

import { shape as propertyShape } from '../helpers/properties';
import bs from '../styles/bootstrap';
import styles from '../styles/filter-thead';

class FilterItem extends Component {
  static get propTypes() {
    return {
      property: propertyShape.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const baseClasses = [bs.btnGroup];
    if (this.state.open) baseClasses.push(bs.open);
    return (
      <div className={baseClasses.join(' ')}>
        <button
          onClick={() => this.setState({ open: !this.state.open })}
          className={[
            bs.dropDown,
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
        >
          <ul className={bs.dropDownMenu}>
            <li> 
            </li>
          </ul>
        </button>
      </div>
    );
  }

}

export default function FilterThead({ properties }) {
  return (
    <thead>
      <tr>
        {properties.map(prop => <td><FilterItem property={prop} /></td>)}
      </tr>
    </thead>
  );
}

FilterThead.propTypes = {
  form: string.isRequired,
  properties: propertyShape.isRequired,
};
