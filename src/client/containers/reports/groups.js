import { connect } from 'react-redux';

import l from '../../components/reports/groups/language';
import b from '../../components/reports/groups/birthdays';
import m from '../../components/reports/groups/master';

function conn(component) {
  return connect(
    state => state.reportItems,
    null,
  )(component);
}

export const language = conn(l);
export const birthdays = conn(b);
export const master = conn(m);
