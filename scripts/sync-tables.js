/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);


/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a('boomerang', process.env.DB_USER, process.env.DB_PASSWORD));

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_orm__ = __webpack_require__(1);




/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__helpers_orm__["a" /* default */].define('address', {
  line1: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  line2: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  line3: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  city: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  state: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  zip: { type: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"], is: /^[0-9]{5}(-[0-9]{4})?$/ },
  country: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"]
}));

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_sequelize__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_orm__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_errors__ = __webpack_require__(8);





function sha512(salt, password) {
  var hash = __WEBPACK_IMPORTED_MODULE_0_crypto___default.a.createHmac('sha512', salt).update(password).digest('base64');
  return { salt: salt, hash: hash };
}

function saltHashPassword(password) {
  if (password == null) {
    throw new Error('null password');
  }
  return sha512(__WEBPACK_IMPORTED_MODULE_0_crypto___default.a.randomBytes(16).toString('base64'), password);
}

function match(salt, hash, password) {
  if (salt == null || hash == null || password == null) {
    return false;
  }
  var hash2 = sha512(salt, password).hash;
  var same = 1;
  for (var i = 0; i < hash2.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    same &= hash[i] === hash2[i];
  }
  return same === 1;
}

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_2__helpers_orm__["a" /* default */].define('authMechanism', {
  type: {
    type: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_sequelize__["ENUM"])('BASIC'),
    allowNull: false
  },
  username: {
    type: __WEBPACK_IMPORTED_MODULE_1_sequelize__["STRING"],
    unique: true,
    allowNull: false
  },
  salt: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_sequelize__["CHAR"])(24),
  hash: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_sequelize__["CHAR"])(88),
  sessionId: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_sequelize__["CHAR"])(88),
  resetId: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_sequelize__["CHAR"])(88),
  resetAt: __WEBPACK_IMPORTED_MODULE_1_sequelize__["DATE"]
}, {
  instanceMethods: {
    correctPassword: function correctPassword(password) {
      return match(this.salt, this.hash, password);
    },
    setPassword: function setPassword(password) {
      if (password.length < 8) {
        throw new __WEBPACK_IMPORTED_MODULE_3__helpers_errors__["a" /* InsecurePasswordError */]();
      }
      var sh = saltHashPassword(password);
      this.salt = sh.salt.toString('base64');
      this.hash = sh.hash.toString('base64');
    }
  }
}));

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_orm__ = __webpack_require__(1);




/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__helpers_orm__["a" /* default */].define('group', {
  name: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  roomNumber: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  notes: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"])(2550)
}));

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_orm__ = __webpack_require__(1);




/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__helpers_orm__["a" /* default */].define('school', {
  name: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"]
}));

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_orm__ = __webpack_require__(1);




/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__helpers_orm__["a" /* default */].define('user', {
  firstName: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  lastName: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  middleName: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  phone: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  email: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  firstLanguage: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  languageNeeds: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"])(2550),
  notes: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"])(2550),
  gender: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["ENUM"])('M', 'F'),
  dob: __WEBPACK_IMPORTED_MODULE_0_sequelize__["DATEONLY"],

  homeRoom: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  teacher: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
  oriented: __WEBPACK_IMPORTED_MODULE_0_sequelize__["BOOLEAN"],

  activationSent: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize__["BOOLEAN"],
    allowNull: false,
    defaultValue: false
  },

  type: {
    type: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["ENUM"])('STUDENT', 'LEADER', 'TEACHER', 'ADMIN'),
    allowNull: false
  }
}));

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = InsecurePasswordError;
/* unused harmony export BadQueryError */
/* unused harmony export NotFoundError */
/* unused harmony export BadRequestError */
function constructError(args) {
  var _this = this;

  var e = Error.apply(this, args);
  Object.getOwnPropertyNames(e).forEach(function (key) {
    _this[key] = e[key];
  });
}

function extendsError() {
  var _this2 = this;

  Object.setPrototypeOf(this, Error);
  this.prototype = Object.create(Error.prototype, {
    name: { value: this.name },
    constructor: { value: this }
  });
  this.prototype.toString = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return Error.prototype.toString.apply(_this2, args);
  };
}

function InsecurePasswordError() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  constructError.bind(this)(args);
}
function BadQueryError() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  constructError.bind(this)(args);
}
function NotFoundError() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  constructError.call.apply(constructError, [this].concat(args));
}
function BadRequestError() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  constructError.bind(this)(args);
}

[InsecurePasswordError, BadQueryError].forEach(function (type) {
  return extendsError.call(type);
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__user__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__school__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__address__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__auth_mechanism__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__group__ = __webpack_require__(4);
/* unused harmony reexport Address */
/* unused harmony reexport School */
/* unused harmony reexport User */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_3__auth_mechanism__["a"]; });
/* unused harmony reexport Group */






__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */], { onDelete: 'CASCADE' });
__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_2__address__["a" /* default */], { onDelete: 'SET NULL' });
__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_4__group__["a" /* default */], { onDelete: 'SET NULL' });

__WEBPACK_IMPORTED_MODULE_4__group__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */], { onDelete: 'CASCADE' });
__WEBPACK_IMPORTED_MODULE_4__group__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */], { onDelete: 'SET NULL' });

__WEBPACK_IMPORTED_MODULE_3__auth_mechanism__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */], { onDelete: 'CASCADE' });
__WEBPACK_IMPORTED_MODULE_2__address__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */], { onDelete: 'SET NULL' });
__WEBPACK_IMPORTED_MODULE_2__address__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */], { onDelete: 'SET NULL' });

__WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */], { onDelete: 'CASCADE' });
__WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_4__group__["a" /* default */], { onDelete: 'CASCADE' });
__WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_2__address__["a" /* default */], { onDelete: 'SET NULL' });







/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_helpers_orm__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server_models__ = __webpack_require__(9);


// eslint-disable-next-line no-unused-vars


__WEBPACK_IMPORTED_MODULE_0__server_helpers_orm__["a" /* default */].sync({ force: true }).then(function () {
  console.log('SUCCESS');
  process.exit(0);
}, function (e) {
  console.log('ERROR');
  console.log(e);
  process.exit(1);
});

/***/ }),
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
module.exports = __webpack_require__(12);


/***/ })
/******/ ]);