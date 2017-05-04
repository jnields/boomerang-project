import { DEFAULT_LIMIT, MAX_LIMIT } from './config';
import { BadQueryError } from '../../helpers/errors';

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function parseValue(attribute, rawValue, operator) {
  function validateAndGet(value) {
    if (isObject(value)) {
      throw new BadQueryError(`Object passed to operand${operator}`);
    }
    console.log(attribute);
    const validate = attribute.validate;
    const nullable = attribute.allowNull !== false
      && !(validate && validate.allowNull !== false);
    if (nullable && value === '') return null;
    switch (attribute.type.constructor.key) {
      case 'STRING':
      case 'CHAR':
      case 'TEXT':
        return value;
      case 'INTEGER':
      case 'BIGINT': {
        const parsed = parseFloat(value, 10);
        if (Number.isInteger(parsed)) return parsed;
        throw new BadQueryError(`invalid value passed to ${attribute.fieldName}`);
      }
      case 'FLOAT':
      case 'REAL':
      case 'DOUBLE':
      case 'DECIMAL': {
        const parsed = parseFloat(value, 10);
        if (!isNaN(parsed)) return parsed;
        throw new BadQueryError(`invalid value passed to ${attribute.fieldName}`);
      }
      case 'BOOLEAN':
        switch (value) {
          case 'true': return true;
          case 'false': return false;
          default: throw new BadQueryError(`invalid value passed to ${attribute.fieldName}`);
        }
      case 'TIME':
      case 'DATE':
      case 'DATEONLY': {
        const parsed = Date.parse(value);
        if (!isNaN(parsed)) return parsed;
        throw new BadQueryError(`invalid value passed to ${attribute.fieldName}`);
      }
      case 'BLOB':
      case 'UUID':
        throw new BadQueryError(`cannot query ${attribute.name}`);
      case 'ENUM':
        if (attribute.values.indexOf(value) === -1) {
          throw new BadQueryError(`invalid value passed to ${attribute.fieldName}`);
        }
        return value;
      default:
        throw new Error('unhandled type in switch');
    }
  }
  if (Array.isArray(rawValue)) {
    return rawValue.map(validateAndGet);
  }
  return validateAndGet(rawValue);
}

function parseObjectParam(
  param,
  value,
  model,
) {
  const attribute = model.attributes[param];
  // example input:
  // param: id
  // const value: { $in: [1,2,3], $notIn: [5,6,7], $lt: 3 }
  // const result: { id: { $in: [1,2,3], $notIn: [5,6,7], $lt: 3 } }
  return Object.keys(value).reduce(
    (accumulator, operator) => {
      const parsed = parseValue(attribute, value[operator], operator);
      switch (operator) {
        case '$in':
        case '$notIn':
          return {
            ...accumulator,
            [param]: {
              [operator]: Array.isArray(parsed) ? parsed : [parsed],
              ...accumulator.param,
            },
          };
        case '$ne':
        case '$gt':
        case '$gte':
        case '$lt':
        case '$lte':
        case '$like':
        case '$notLike':
          if (Array.isArray(parsed)) {
            return {
              ...accumulator,
              $and: [
                ...parsed.map(val => ({ [param]: val })),
                ...(accumulator.$and || []),
              ],
            };
          }
          return {
            ...accumulator,
            [param]: {
              [operator]: parsed,
              ...accumulator[param],
            },
          };
        // case '$not':
        // case '$or':
        // case '$and':
        // case '$overlap':
        // case '$contains':
        default:
          throw new BadQueryError(`no such operator: ${operator}`);
      }
    },
    {},
  );
}

function parseParam(param, value, model) {
  const attribute = model.attributes[param];
  if (attribute === undefined || attribute.references) {
    throw new BadQueryError(`no such property: ${param}`);
  }
  if (isObject(value)) {
    return parseObjectParam(param, value, model);
  }
  const parsed = parseValue(attribute, value);
  if (Array.isArray(parsed)) {
    return { [param]: { $in: parsed } };
  }
  return { [param]: parsed };
}

export default function parseQuery(query, base, model) {
  const included = (base.include || []).reduce(
    (accumulator, association) => ({
      ...accumulator,
      [association.model.name]: association,
    }),
    {},
  );

  const result = Object.keys(query).reduce(
    (accumulator, param) => {
      if (included[param]) {
        if (!isObject(query[param])) {
          throw new BadQueryError(`cannot query ${param}, query properties instead`);
        }
        included[param].where = parseQuery(
          query[param],
          {
            where: included[param].where,
            include: included[param].include,
          },
          included[param].model,
        ).where;
        return accumulator;
      }

      switch (param) {
        case '$limit':
          return {
            ...accumulator,
            limit: Math.min(
              parseInt(query.$limit, 10) || DEFAULT_LIMIT,
              MAX_LIMIT,
            ),
          };
        case '$offset':
          return {
            ...accumulator,
            offset: parseInt(query.$offset, 10) || 0,
          };
        // case '$include':
        default:
          return {
            ...accumulator,
            where: {
              // important: do not overwrite 'where' properties already provided
              ...parseParam(param, query[param], model),
              ...accumulator.where,
            },
          };
      }
    },
    base,
  );
  return result;
}
