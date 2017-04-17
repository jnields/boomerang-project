import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bs from '../../styles/bootstrap';

export default class TabList extends Component {
  constructor(props) {
    super(props);
    this.state = { active: 0 };
  }

  render() {
    const { tabs } = this.props;
    const { active } = this.state;

    return (<div>
      <ul className={[bs.nav, bs.navTabs].join(' ')}>
        {tabs.map(({ href, title }, ix) => (
          <li
            className={ix === active ? bs.active : ''}
            key={title}
          >
            <a
              href=""
              onClick={() => {
                this.setState({ active: ix });
              }}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
      {tabs[active].content}
    </div>);
  }
}

const { arrayOf, string, shape, node } = PropTypes;
TabList.propTypes = {
  tabs: arrayOf(
        shape({
          title: string.isRequired,
          href: string.isRequired,
          content: node.isRequired,
        }),
    ).isRequired,
};
