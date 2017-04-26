import User from './user';
import School from './school';
import Address from './address';
import AuthMechanism from './auth-mechanism';
import Group from './group';

User.belongsTo(School, { onDelete: 'CASCADE' });
User.belongsTo(Address, { onDelete: 'SET NULL' });
User.belongsTo(Group, { onDelete: 'SET NULL' });

Group.belongsTo(School, { onDelete: 'CASCADE' });
Group.hasMany(User, { onDelete: 'SET NULL' });

AuthMechanism.belongsTo(User, { onDelete: 'CASCADE' });
Address.hasMany(User, { onDelete: 'SET NULL' });
Address.hasMany(School, { onDelete: 'SET NULL' });

School.hasMany(User, { onDelete: 'CASCADE' });
School.hasMany(Group, { onDelete: 'CASCADE' });
School.belongsTo(Address, { onDelete: 'SET NULL' });

export { default as Address } from './address';
export { default as School } from './school';
export { default as User } from './user';
export { default as AuthMechanism } from './auth-mechanism';
export { default as Group } from './group';
