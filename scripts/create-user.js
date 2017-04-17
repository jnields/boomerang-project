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
    /******/ 	return __webpack_require__(__webpack_require__.s = 15);
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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_models__ = __webpack_require__(8);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server_helpers_orm__ = __webpack_require__(1);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_sequelize__ = __webpack_require__(0);
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_sequelize__);
    var saveUser = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var authMechanism;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return __WEBPACK_IMPORTED_MODULE_1__server_helpers_orm__["a" /* default */].transaction({
                            autocommit: false,
                            isolationLevel: "READ COMMITTED"
                        });

                    case 2:
                        transaction = _context.sent;
                        authMechanism = __WEBPACK_IMPORTED_MODULE_0__server_models__["a" /* AuthMechanism */].build({ type: "BASIC", username: username });

                        authMechanism.setPassword(password);
                        _context.next = 7;
                        return authMechanism.save({ transaction: transaction });

                    case 7:
                        authMechanism = _context.sent;

                        user.email = username;
                        _context.next = 11;
                        return authMechanism.createUser(user, { transaction: transaction });

                    case 11:
                        _context.next = 13;
                        return transaction.commit();

                    case 13:
                        console.log("USER CREATED");
                        process.exit(0);

                    case 15:
                    case "end":
                        return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function saveUser() {
            return _ref.apply(this, arguments);
        };
    }();

    function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }



    var flag = void 0,
        password = void 0,
        username = void 0;

    var user = {};

    var fields = {
        "-u": "username",
        "-p": "password",
        "-e": "email",
        "-g": "gender",
        "-a": "age",
        "-dob": "dob",
        "-t": "type",
        "-f": "firstName",
        "-l": "lastName"
    };

    process.argv.forEach(function (arg, ix) {
        if (ix < 2) return;
        if (flag == null) {
            if (!(flag = fields[arg])) throw "Usage: create-user " + "-u [[username]] " + "-p [[password]] " + "-f [[firstName]] " + "-l [[lastName]] " + "-e [[email]] " + "-g [[gender]] " + "-a [[age]] " + "-dob [[dateOfBirth]] " + "-t  [[type]]";
        } else {
            if (flag === "password") {
                password = arg;
            } else if (flag === "username") {
                username = arg;
            } else {
                user[flag] = arg;
            }
            flag = null;
        }
    });

    var transaction = void 0;


    saveUser().catch(function (error) {
        transaction.rollback().then(function () {
            if (error instanceof __WEBPACK_IMPORTED_MODULE_2_sequelize__["UniqueConstraintError"]) {
                console.log("USERNAME TAKEN");
            } else {
                console.log(error);
                process.exit(1);
            }
            process.exit(1);
        });
    });

/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

    __webpack_require__(2);
    module.exports = __webpack_require__(11);


/***/ })
/******/ ]);