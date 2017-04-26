function constructError(args) {
  const e = Error.apply(this, args);
  Object.getOwnPropertyNames(e).forEach(
    (key) => {
      this[key] = e[key];
    },
  );
}

function extendsError() {
  Object.setPrototypeOf(this, Error);
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

export function InsecurePasswordError(...args) {
  constructError.bind(this)(args);
}
export function BadQueryError(...args) {
  constructError.bind(this)(args);
}

[
  InsecurePasswordError,
  BadQueryError,
].forEach(type => extendsError.call(type));
