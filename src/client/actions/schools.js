import api from '../helpers/api';
import { school as schoolSchema } from '../helpers/schema';
import { school as properties } from '../helpers/properties';

import * as listActions from './list';

const config = {
  name: 'schools',
  schema: schoolSchema,
  schemaName: 'schools',
  post: api.schools.post,
  query: api.schools.query,
  patch: api.schools.patch,
  del: api.schools.del,
  properties,
};

export const selectItem = listActions.selectItem.bind(null, config);
export const clearParsed = listActions.clearParsed.bind(null, config);
export const query = listActions.query.bind(null, config);
export const save = listActions.save.bind(null, config);
export const upload = listActions.upload.bind(null, config);
export const update = listActions.update.bind(null, config);
export const del = listActions.del.bind(null, config);
export const parse = listActions.parse.bind(null, config);
export { showModal, closeModal } from './modal';
