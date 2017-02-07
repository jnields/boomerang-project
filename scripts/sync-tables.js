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

	var _orm = __webpack_require__(3);

	var _orm2 = _interopRequireDefault(_orm);

	var _models = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if (_models.User == null) global.process.exit(-1);
	_orm2.default.sync({ force: true }).then(function () {
	    console.log("SUCCESS");
	}, function () {
	    console.log("ERROR");
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _sequelize = __webpack_require__(2);

	var _orm = __webpack_require__(3);

	var _orm2 = _interopRequireDefault(_orm);

	var _crypto = __webpack_require__(5);

	var _crypto2 = _interopRequireDefault(_crypto);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

	exports.default = _orm2.default.define("user", {
	    firstName: _sequelize.STRING,
	    lastName: _sequelize.STRING,
	    email: _sequelize.STRING,
	    dob: _sequelize.DATEONLY,
	    gender: (0, _sequelize.ENUM)("M", "F"),
	    age: _sequelize.INTEGER,
	    salt: (0, _sequelize.CHAR)(24),
	    hash: (0, _sequelize.CHAR)(88),
	    sessionId: (0, _sequelize.CHAR)(24),
	    tier: (0, _sequelize.ENUM)("1", "2", "3")
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("sequelize");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _sequelize = __webpack_require__(2);

	var _sequelize2 = _interopRequireDefault(_sequelize);

	var _config = __webpack_require__(4);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = new _sequelize2.default(_config2.default.db.database, _config2.default.db.username, _config2.default.db.password);

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
		"proxyPort": 35412,
		"port": 3000,
		"db": {
			"database": "boomerang",
			"username": "root",
			"password": "Vin2Crtm66"
		},
		"https": false,
		"certFile": null,
		"keyFile": null
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _address = __webpack_require__(7);

	Object.defineProperty(exports, "Address", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_address).default;
	  }
	});

	var _school = __webpack_require__(8);

	Object.defineProperty(exports, "School", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_school).default;
	  }
	});

	var _student = __webpack_require__(10);

	Object.defineProperty(exports, "Student", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_student).default;
	  }
	});

	var _user = __webpack_require__(1);

	Object.defineProperty(exports, "User", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_user).default;
	  }
	});

	var _teacher = __webpack_require__(9);

	Object.defineProperty(exports, "Teacher", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_teacher).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _sequelize = __webpack_require__(2);

	var _orm = __webpack_require__(3);

	var _orm2 = _interopRequireDefault(_orm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _orm2.default.define("address", {
	    line1: _sequelize.STRING,
	    line2: _sequelize.STRING,
	    line3: _sequelize.STRING,
	    city: _sequelize.STRING,
	    state: _sequelize.STRING,
	    country: _sequelize.STRING
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Students = exports.Teachers = exports.Addresses = undefined;

	var _orm = __webpack_require__(3);

	var _orm2 = _interopRequireDefault(_orm);

	var _sequelize = __webpack_require__(2);

	var _address = __webpack_require__(7);

	var _address2 = _interopRequireDefault(_address);

	var _teacher = __webpack_require__(9);

	var _teacher2 = _interopRequireDefault(_teacher);

	var _student = __webpack_require__(10);

	var _student2 = _interopRequireDefault(_student);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var School = _orm2.default.define("school", {
	    name: {
	        type: _sequelize.STRING,
	        notNull: true
	    }
	});
	var Addresses = exports.Addresses = School.hasMany(_address2.default, { as: "addresses" });
	var Teachers = exports.Teachers = School.hasMany(_teacher2.default, { as: "teachers" });
	var Students = exports.Students = School.hasMany(_student2.default, { as: "students" });

	exports.default = School;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.User = undefined;

	var _orm = __webpack_require__(3);

	var _orm2 = _interopRequireDefault(_orm);

	var _user = __webpack_require__(1);

	var _user2 = _interopRequireDefault(_user);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Teacher = _orm2.default.define("teacher", {}, {
	    validate: {
	        tier2: function tier2() {
	            var ur = this.getUser();
	            if (ur.tier !== "2") throw new Error("Teacher's user is the incorrect tier.");
	        }
	    }
	});
	exports.default = Teacher;
	var User = exports.User = Teacher.belongsTo(_user2.default);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.User = undefined;

	var _orm = __webpack_require__(3);

	var _orm2 = _interopRequireDefault(_orm);

	var _sequelize = __webpack_require__(2);

	var _user = __webpack_require__(1);

	var _user2 = _interopRequireDefault(_user);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Student = _orm2.default.define("student", {
	    grade: _sequelize.INTEGER,
	    isLeader: _sequelize.BOOLEAN
	}, {
	    validate: {
	        tier1: function tier1() {
	            var ur = this.getUser();
	            if (ur.tier !== "3") throw new Error("Student's User is the incorrect tier.");
	        }
	    }
	});

	exports.default = Student;
	var User = exports.User = Student.belongsTo(_user2.default);

/***/ }
/******/ ])));