import React from 'react';
import { func, bool } from 'prop-types';
import Spinner from './spinner';
import PropertyList from './property-list';
import bs from '../styles/bootstrap';

export default function StudentTab(props) {
  return (
    <div>
      <PropertyList {...props} />
      <button
        onClick={() => props.assignGroups()}
        className={[
          bs.btn, bs.btnDefault,
        ].join(' ')}
      >
        <Spinner show={props.assigningGroups} />
        Assign Students to Groups
      </button>
    </div>
  );
}

StudentTab.propTypes = {
  assigningGroups: bool.isRequired,
  assignGroups: func.isRequired,
};
