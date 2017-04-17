import User from './user';
import School from './school';
import Address from './address';
import AuthMechanism from './auth-mechanism';

User.belongsTo(School, { onDelete: 'CASCADE' });
User.belongsTo(Address, { onDelete: 'SET NULL' });
AuthMechanism.belongsTo(User, { onDelete: 'CASCADE' });
Address.hasMany(User, { onDelete: 'SET NULL' });
Address.hasMany(School, { onDelete: 'SET NULL' });
School.hasMany(User, { onDelete: 'CASCADE' });
School.belongsTo(Address, { onDelete: 'SET NULL' });

export { default as Address } from './address';
export { default as School } from './school';
export { default as User } from './user';
export { default as AuthMechanism } from './auth-mechanism';
