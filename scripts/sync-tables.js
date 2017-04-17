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
/******/ 			function getDefault() { return module["default"]; } :
/******/ 			function getModuleExports() { return module; };
        /******/ 		__webpack_require__.d(getter, "a", getter);
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
    /******/ 	return __webpack_require__(__webpack_require__.s = 16);
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

    var database = process.env.BOOMERANG_DATABASE,
        username = process.env.BOOMERANG_USER,
        password = process.env.BOOMERANG_PASSWORD;

    /* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a(database, username, password));

/***/ }),
/* 2 */
/***/ (function(module, exports) {

    module.exports = require("babel-polyfill");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(0);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_orm__ = __webpack_require__(1);


    /* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__helpers_orm__["a" /* default */].define("address", {
        line1: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        line2: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        line3: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        city: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        state: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        zip: { type: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"], is: /^[0-9]{5}(-[0-9]{4})?$/ },
        country: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"]
    }));

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(0);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_orm__ = __webpack_require__(1);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_crypto__ = __webpack_require__(9);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_crypto___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_crypto__);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_errors__ = __webpack_require__(7);





    /* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__helpers_orm__["a" /* default */].define("authMechanism", {
        type: {
            type: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["ENUM"])("BASIC"),
            allowNull: false
        },
        username: {
            type: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
            unique: true,
            allowNull: true
        },
        salt: {
            type: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["CHAR"])(24),
            allowNull: false
        },
        hash: {
            type: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["CHAR"])(88),
            allowNull: false
        },
        sessionId: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["CHAR"])(88)
    }, {
        instanceMethods: {
            correctPassword: function correctPassword(password) {
                return match(this.salt, this.hash, password);
            },
            setPassword: function setPassword(password) {
                if (password.length < 8) throw new __WEBPACK_IMPORTED_MODULE_3__helpers_errors__["a" /* InsecurePasswordError */]();
                var sh = saltHashPassword(password);
                this.salt = sh.salt.toString("base64");
                this.hash = sh.hash.toString("base64");
            }
        }
    }));

    function sha512(salt, password) {
        var hash = __WEBPACK_IMPORTED_MODULE_2_crypto___default.a.createHmac("sha512", salt).update(password).digest("base64");
        return { salt: salt, hash: hash };
    }

    function saltHashPassword(password) {
        if (password == null) throw "null password";
        return sha512(__WEBPACK_IMPORTED_MODULE_2_crypto___default.a.randomBytes(16).toString("base64"), password);
    }

    function match(salt, hash, password) {
        if (salt == null || hash == null || password == null) return false;
        var hash2 = sha512(salt, password).hash;
        var same = 1;
        for (var i = 0; i < hash2.length; i++) {
            same = same & hash[i] === hash2[i];
        }
        return same === 1;
    }

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_orm__ = __webpack_require__(1);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_sequelize__ = __webpack_require__(0);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_sequelize__);



    /* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__helpers_orm__["a" /* default */].define("school", {
        name: __WEBPACK_IMPORTED_MODULE_1_sequelize__["STRING"]
    }));

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(0);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_orm__ = __webpack_require__(1);



    /* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__helpers_orm__["a" /* default */].define("user", {
        firstName: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        lastName: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        middleName: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        phone: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        email: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        firstLanguage: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        languageNeeds: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"])(2550),
        notes: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"])(2550),
        gender: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["ENUM"])("M", "F"),
        dob: __WEBPACK_IMPORTED_MODULE_0_sequelize__["DATEONLY"],

        homeRoom: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        teacher: __WEBPACK_IMPORTED_MODULE_0_sequelize__["STRING"],
        oriented: __WEBPACK_IMPORTED_MODULE_0_sequelize__["BOOLEAN"],

        type: {
            type: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_sequelize__["ENUM"])("STUDENT", "LEADER", "TEACHER", "ADMIN"),
            allowNull: false
        }
    }));

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InsecurePasswordError; });
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var InsecurePasswordError = function (_Error) {
        _inherits(InsecurePasswordError, _Error);

        function InsecurePasswordError() {
            _classCallCheck(this, InsecurePasswordError);

            return _possibleConstructorReturn(this, (InsecurePasswordError.__proto__ || Object.getPrototypeOf(InsecurePasswordError)).apply(this, arguments));
        }

        return InsecurePasswordError;
    }(Error);
    InsecurePasswordError.prototype.constructor = InsecurePasswordError;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__user__ = __webpack_require__(6);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__school__ = __webpack_require__(5);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__address__ = __webpack_require__(3);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__auth_mechanism__ = __webpack_require__(4);
/* unused harmony reexport Address */
/* unused harmony reexport School */
/* unused harmony reexport User */
    /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_3__auth_mechanism__["a"]; });





    __WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */], { onDelete: "CASCADE" });
    __WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_2__address__["a" /* default */], { onDelete: "SET NULL" });
    __WEBPACK_IMPORTED_MODULE_3__auth_mechanism__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */], { onDelete: "CASCADE" });
    __WEBPACK_IMPORTED_MODULE_2__address__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */], { onDelete: "SET NULL" });
    __WEBPACK_IMPORTED_MODULE_2__address__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */], { onDelete: "SET NULL" });
    __WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */], { onDelete: "CASCADE" });
    __WEBPACK_IMPORTED_MODULE_1__school__["a" /* default */].belongsTo(__WEBPACK_IMPORTED_MODULE_2__address__["a" /* default */], { onDelete: "SET NULL" });






/***/ }),
/* 9 */
/***/ (function(module, exports) {

    module.exports = require("crypto");

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* WEBPACK VAR INJECTION */(function(global) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_helpers_orm__ = __webpack_require__(1);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server_models__ = __webpack_require__(8);


//eslint-disable-next-line no-unused-vars


        __WEBPACK_IMPORTED_MODULE_0__server_helpers_orm__["a" /* default */].sync({ force: true }).then(function () {
            console.log("SUCCESS");
            global.process.exit(0);
        }, function (e) {
            console.log("ERROR");
            console.log(e);
            global.process.exit(1);
        });
    /* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(13)));

/***/ }),
/* 13 */
/***/ (function(module, exports) {

    module.exports = require("webpack/buildin/global.js");

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

    __webpack_require__(2);
    module.exports = __webpack_require__(12);


/***/ })
/******/ ]);