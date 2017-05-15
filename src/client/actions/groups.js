import api from '../helpers/api';
import { group as groupSchema } from '../helpers/schema';
import { group as fieldsets } from '../helpers/properties';

import * as listActions from './list';

const config = {
  name: 'groups',
  schema: groupSchema,
  schemaName: 'groups',
  post: api.groups.post,
  query: api.groups.query,
  patch: api.groups.patch,
  del: api.groups.del,
  fieldsets,
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
