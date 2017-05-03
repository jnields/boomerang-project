import React from 'react';
import { arrayOf, func, bool } from 'prop-types';

import Spinner from './spinner';
import GroupForm from '../containers/group-form';

import { group as groupShape } from '../helpers/models';
import { group as groupProps } from '../helpers/properties';
import bs from '../styles/bootstrap';
import styles from '../styles/helpers';

export default class GroupTab extends React.Component {
  static get propTypes() {
    return {
      groups: arrayOf(groupShape).isRequired,
      assigningGroups: bool.isRequired,

      showModal: func.isRequired,
      assignGroups: func.isRequired,
      getAllGroups: func.isRequired,
      selectGroup: func.isRequired,
    };
  }
  componentDidMount() {
    this.props.getAllGroups();
  }

  render() {
    const {
      groups,
      showModal,
      assigningGroups,
      assignGroups,
      selectGroup,
    } = this.props;
    const groupList = groups.length === 0
    ? <h2>No groups listed</h2>
    : (
      <div>
        <table className={[bs.table, bs.tableHover].join(' ')}>
          <thead>
            <tr>
              {groupProps.map(prop => <th key={prop.name}>{prop.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <tr
                key={group.id}
                className={styles.pointer}
                onClick={() => selectGroup(group)}
              >
                {groupProps.map(prop => (
                  <td key={prop.name}>
                    {group[prop.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    const buttons = (
      <div className={bs.btnToolbar}>
        <button
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          disabled={assigningGroups}
          onClick={() => showModal({
            title: 'Add Group',
            content: <GroupForm />,
          })}
        >
          <span
            className={[
              bs.glyphicon,
              bs.glyphiconPlus,
            ].join(' ')}
          /> Add
        </button>
        <button
          className={[
            bs.btn,
            bs.btnDefault,
          ].join(' ')}
          disabled={assigningGroups}
          onClick={assignGroups}
        >
          {
            assigningGroups
              ? <Spinner />
              : null
          }
          {assigningGroups ? ' please wait…' : ' Assign Students to Groups'}
        </button>
      </div>
    );

    return (
      <div className={bs.row}>
        <div className={bs.colSm12}>{groupList}</div>
        <div className={bs.colSm12}>{buttons}</div>
      </div>
    );
  }
}
