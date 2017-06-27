/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function NewImg(src) {
	let img = new Image();
	img.src = src;
	return img;
}

/* harmony default export */ __webpack_exports__["a"] = (NewImg);

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Game__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Enemy__ = __webpack_require__(6);



function NewGame() {
	window.gamesession = new __WEBPACK_IMPORTED_MODULE_0__Game__["default"]({});
	window.gamesession.startAnimation();
	window.gamesession.togglePlay();
}

document.addEventListener("DOMContentLoaded", function () {
	document.getElementsByClassName("spawn-enemies")[0].addEventListener("click", function (e) {
		if (e.target.classList.contains("spawn-enemy")) {
			window.gamesession.enemies.push(new __WEBPACK_IMPORTED_MODULE_1__Enemy__["a" /* default */]({ type: e.target.value }))
		}
	})
});

document.addEventListener("DOMContentLoaded", NewGame);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__) {

"use strict";
throw new Error("Module parse failed: C:\\Users\\Emil\\Documents\\GitHub\\Tower-defense\\client\\Game.js Unexpected token (529:0)\nYou may need an appropriate loader to handle this file type.\n| }\r\n| \r\n| <<<<<<< HEAD:client/game.js\r\n| function capFirstLetter(string) {\r\n| \treturn string.charAt(0).toUpperCase() + string.slice(1);\r");

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NewImage__ = __webpack_require__(0);


class Enemy {
	constructor({ type = "Ogre" }) {
		this.type = type;

		let enemy = Enemy.Types[type];

		// Copy all properties from enemy to this context.
		Object.assign(this, enemy);

		this.pathIndex = 1;
		this.alive = true;
		this.pos = window.gamesession.world.path[0].center(this.width, this.height);
		this.goal = window.gamesession.world.path[this.pathIndex].center(this.width, this.height);
		this.distanceWalked = 0;
		this.won = false;
	}
	draw(ctx) {
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
		ctx.fillStyle = "#888888";
		ctx.fillRect(this.pos.x, this.pos.y + this.height + 5, this.width, 5);
		ctx.fillStyle = "#bb2233";
		ctx.fillRect(this.pos.x, this.pos.y + this.height + 5, this.width * (this.health / Enemy.Types[this.type].health), 5);
	}
	die() {
		this.alive = false;
	}
	win() {
		window.gamesession.lives -= this.damage;
		this.alive = false;
		this.won = true;
	}
	getPosFromPath(path) {
		let dw = this.distanceWalked;
		for (let i = 0; i < path.length - 1; i++) {
			let nw = dw - path[i].distanceTo(path[i + 1]);
			if (nw > 0) {
				dw = nw;
			} else if (i < path.length) {
				this.pos = path[i].clone().moveTowards(path[i + 1], dw).center(this.width, this.height);
				return;
			}
		}
		this.win();
	}
	update() {
		this.distanceWalked += this.walkingSpeed;
		this.getPosFromPath(window.gamesession.world.path);
	}
}

Enemy.Types = {
	Ogre: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/enemies/base.png"),
		drop: 10,
		walkingSpeed: 2,
		width: 48,
		height: 48,
		health: 100,
		damage: 1,
		armor: 2,
	},
	Goblin: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/enemies/base.png"),
		drop: 5,
		walkingSpeed: 4,
		width: 32,
		height: 32,
		health: 50,
		damage: 1,
		armor: 1,
	}
}


/* harmony default export */ __webpack_exports__["a"] = (Enemy);

/***/ })
/******/ ]);