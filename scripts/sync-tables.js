(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	var _orm = __webpack_require__(5);

	var _orm2 = _interopRequireDefault(_orm);

	var _models = __webpack_require__(1);

	var Models = _interopRequireWildcard(_models);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_orm2.default.sync({ force: true }).then(function () {
	    console.log("SUCCESS");
	    global.process.exit(0);
	}, function (e) {
	    console.log("ERROR");
	    console.log(e);
	    global.process.exit(1);
	});

	//eslint-disable-next-line no-unused-vars
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AuthMechanism = exports.Teacher = exports.User = exports.Student = exports.School = exports.Address = undefined;

	var _defineProperty = __webpack_require__(2);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	var _address = __webpack_require__(3);

	Object.defineProperty(exports, "Address", {
	    enumerable: true,
	    get: function get() {
	        return _interopRequireDefault(_address).default;
	    }
	});

	var _school = __webpack_require__(7);

	Object.defineProperty(exports, "School", {
	    enumerable: true,
	    get: function get() {
	        return _interopRequireDefault(_school).default;
	    }
	});

	var _student = __webpack_require__(8);

	Object.defineProperty(exports, "Student", {
	    enumerable: true,
	    get: function get() {
	        return _interopRequireDefault(_student).default;
	    }
	});

	var _user = __webpack_require__(9);

	Object.defineProperty(exports, "User", {
	    enumerable: true,
	    get: function get() {
	        return _interopRequireDefault(_user).default;
	    }
	});

	var _teacher = __webpack_require__(10);

	Object.defineProperty(exports, "Teacher", {
	    enumerable: true,
	    get: function get() {
	        return _interopRequireDefault(_teacher).default;
	    }
	});

	var _authMechanism = __webpack_require__(11);

	Object.defineProperty(exports, "AuthMechanism", {
	    enumerable: true,
	    get: function get() {
	        return _interopRequireDefault(_authMechanism).default;
	    }
	});

	var _authMechanism2 = _interopRequireDefault(_authMechanism);

	var _school2 = _interopRequireDefault(_school);

	var _student2 = _interopRequireDefault(_student);

	var _user2 = _interopRequireDefault(_user);

	var _teacher2 = _interopRequireDefault(_teacher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// const noNull = {
	//     foreignKey: { allowNull: false }
	// };
	// define associations on Model objects, configure as read-only properties

	//import Address from "./address";
	[
	//[School, "Addresses", School.hasMany(Address)],
	[_school2.default, "Teachers", _school2.default.hasMany(_teacher2.default, { onDelete: "CASCADE" })], [_school2.default, "Students", _school2.default.hasMany(_student2.default, { onDelete: "CASCADE" })], [_student2.default, "User", _student2.default.hasOne(_user2.default, { onDelete: "CASCADE" })], [_student2.default, "School", _student2.default.belongsTo(_school2.default)], [_teacher2.default, "User", _teacher2.default.hasOne(_user2.default, { onDelete: "CASCADE" })], [_teacher2.default, "School", _teacher2.default.belongsTo(_school2.default)], [_user2.default, "AuthMechanism", _user2.default.hasOne(_authMechanism2.default, { onDelete: "CASCADE" })]].forEach(function (arr) {
	    (0, _defineProperty2.default)(arr[0], arr[1], {
	        value: arr[2],
	        writable: false
	    });
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/define-property");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _sequelize = __webpack_require__(4);

	var _orm = __webpack_require__(5);

	var _orm2 = _interopRequireDefault(_orm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _orm2.default.define("address", {
	    line1: _sequelize.STRING,
	    line2: _sequelize.STRING,
	    line3: _sequelize.STRING,
	    city: _sequelize.STRING,
	    state: _sequelize.STRING,
	    zip: { type: _sequelize.STRING, is: /^[0-9]{5}(-[0-9]{4})?$/ },
	    country: _sequelize.STRING
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("sequelize");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _sequelize = __webpack_require__(4);

	var _sequelize2 = _interopRequireDefault(_sequelize);

	var _config = __webpack_require__(6);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = new _sequelize2.default(_config2.default.db.database, _config2.default.db.username, _config2.default.db.password);

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	if (process.env.NODE_ENV === "production") {
	    module.exports = {
	        "proxyPort": null,
	        "port": 3000,
	        "db": {
	            "database": "boomerang",
	            "username": "boomerang",
	            "password": "MXM-YJl-iOh-BDW"
	        },
	        "certFile": "/etc/ssl/cert.pem",
	        "keyFile": "/etc/ssl/key.pem"
	    };
	} else {
	    module.exports = {
	        "proxyPort": 35412,
	        "port": 3000,
	        "db": {
	            "database": "boomerang",
	            "username": "root",
	            "password": "Vin2Crtm66"
	        },
	        "certFile": null,
	        "keyFile": null
	    };
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _orm = __webpack_require__(5);

	var _orm2 = _interopRequireDefault(_orm);

	var _sequelize = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var School = _orm2.default.define("school", {
	    name: {
	        type: _sequelize.STRING,
	        allowNull: false
	    }
	});
	exports.default = School;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _orm = __webpack_require__(5);

	var _orm2 = _interopRequireDefault(_orm);

	var _sequelize = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Student = _orm2.default.define("student", {
	    grade: _sequelize.INTEGER,
	    isLeader: _sequelize.BOOLEAN
	}, {
	    validate: {
	        tier3: function tier3() {
	            var ur = this.user || this.getUser();
	            if (ur.tier !== "3") throw new Error("Student's User is the incorrect tier.");
	        }
	    }
	});

	exports.default = Student;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _sequelize = __webpack_require__(4);

	var _orm = __webpack_require__(5);

	var _orm2 = _interopRequireDefault(_orm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _orm2.default.define("user", {
	    firstName: _sequelize.STRING,
	    lastName: _sequelize.STRING,
	    email: _sequelize.STRING,
	    dob: _sequelize.DATEONLY,
	    gender: (0, _sequelize.ENUM)("M", "F"),
	    age: _sequelize.INTEGER,
	    tier: {
	        type: (0, _sequelize.ENUM)("1", "2", "3"),
	        allowNull: false
	    },
	    username: {
	        type: _sequelize.STRING,
	        unique: true,
	        allowNull: false
	    }
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _orm = __webpack_require__(5);

	var _orm2 = _interopRequireDefault(_orm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Teacher = _orm2.default.define("teacher", {}, {
	    validate: {
	        tier2: function tier2() {
	            var ur = this.user || this.getUser();
	            if (ur.tier != "2") throw new Error("Teacher's user is the incorrect tier.");
	        }
	    }
	});
	exports.default = Teacher;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _sequelize = __webpack_require__(4);

	var _orm = __webpack_require__(5);

	var _orm2 = _interopRequireDefault(_orm);

	var _crypto = __webpack_require__(12);

	var _crypto2 = _interopRequireDefault(_crypto);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _orm2.default.define("authMechanism", {
	    type: {
	        type: (0, _sequelize.ENUM)("BASIC"),
	        allowNull: false,
	        default: "BASIC"
	    },
	    salt: {
	        type: (0, _sequelize.CHAR)(24),
	        allowNull: false
	    },
	    hash: {
	        type: (0, _sequelize.CHAR)(88),
	        allowNull: false
	    },
	    sessionId: (0, _sequelize.CHAR)(88)
	}, {
	    instanceMethods: {
	        correctPassword: function correctPassword(password) {
	            return match(this.salt, this.hash, password);
	        },
	        setPassword: function setPassword(password) {
	            var sh = saltHashPassword(password);
	            this.salt = sh.salt.toString("base64");
	            this.hash = sh.hash.toString("base64");
	        }
	    }
	});


	function sha512(salt, password) {
	    var hash = _crypto2.default.createHmac("sha512", salt).update(password).digest("base64");
	    return { salt: salt, hash: hash };
	}

	function saltHashPassword(password) {
	    if (password == null) throw "null password";
	    return sha512(_crypto2.default.randomBytes(16).toString("base64"), password);
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

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ }
/******/ ])));