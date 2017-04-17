import { schema } from 'normalizr';

export const school = new schema.Entity('schools');
export const user = new schema.Entity('users', { school });
