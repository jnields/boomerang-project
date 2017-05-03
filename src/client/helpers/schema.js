import { schema } from 'normalizr';

const Entity = schema.Entity;

export const group = new Entity('groups');
export const address = new Entity('addresses');
export const school = new Entity('schools', { address });
export const user = new Entity('users', { address, group });
