function constructError(args) {
  const e = Error.apply(this, args);
  Object.getOwnPropertyNames(e).forEach(
    (key) => {
      this[key] = e[key];
    },
  );
}

function extendsError() {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(this, Error);
  } else {
    // eslint-disable-next-line no-proto
    this.__proto__ = Error;
  }

  this.prototype = Object.create(
        Error.prototype,
    {
      name: { value: this.name },
      constructor: { value: this },
    },
  );
  this.prototype.toString = (...args) =>
    Error.prototype.toString.apply(this, args);
}

// eslint-disable-next-line import/prefer-default-export
export function InsecurePasswordError(...args) {
  constructError.bind(this)(args);
}

[
  InsecurePasswordError,
].forEach(type => extendsError.call(type));
