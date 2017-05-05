import {
  arrayOf,
  string,
  shape,
} from 'prop-types';
import propShape from './property-shape';

export default shape({
  key: string.isRequired,
  legend: string.isRequired,
  properties: arrayOf(propShape).isRequired,
});
