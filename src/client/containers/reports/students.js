import { connect } from 'react-redux';

import m from '../../components/reports/students/master';
import ml from '../../components/reports/students/mailing-labels';
import a from '../../components/reports/students/addresses';
import n from '../../components/reports/students/name-tags';

function conn(component) {
  return connect(
    state => state.reportItems,
    null,
  )(component);
}

export const master = conn(m);
export const mailingLabels = conn(ml);
export const addresses = conn(a);
export const nameTags = conn(n);
