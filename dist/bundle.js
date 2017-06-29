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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	moveAngle(angle, speed) {
		const [velx, vely] = Vector.getComponents(angle, speed);
		this.x += velx;
		this.y += vely;
		return this;
	}
	moveVector(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}
	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}
	moveTowards(vector, distance) {
		return this.moveAngle(this.getAngleTo(vector), distance);
	}
	distanceTo(vector) {
		return Math.hypot(vector.x - this.x, vector.y - this.y);
	}
	getAngleTo(vector) {
		return Math.atan2(vector.y - this.y, vector.x - this.x);
	}
	multiply(scala) {
		return new Vector(this.x * scala, this.y * scala);
	}
	clone() {
		return new Vector(this.x, this.y);
	}
	center(width, height) {
		return new Vector(this.x - width / 2, this.y - height / 2);
	}
	getHyp() {
		return Math.hypot(this.x, this.y);
	}
	static getComponents(angle, speed = 1) {
		return [speed * Math.cos(angle), speed * Math.sin(angle)];
	}
	static createFromAngle(angle, speed = 1) {
		return new Vector(speed * Math.cos(angle), speed * Math.sin(angle))
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Vector);

/***/ }),
/* 2 */
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
		this.distanceWalked = 0;
		this.won = false;
	}
	draw(ctx) {
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
		// ctx.fillStyle = "#888888";
		// ctx.fillRect(this.pos.x, this.pos.y - 3, this.width, 2);
		ctx.fillStyle = "#bb2233";
		ctx.fillRect(this.pos.x, this.pos.y - 4, this.width * (this.health / Enemy.Types[this.type].health), 3);
	}
	hurt(damage) {
		this.health -= damage;
		if (this.health <= 0) {
			console.log("dead")
			let enemies = window.gamesession.enemies;
			window.gamesession.players[0].money += this.drop;
			this.die();
			enemies.splice(enemies.indexOf(this), 1);
			return true;
		}
		return false;
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

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Towers; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NewImage__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Projectile__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Explosive__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LightningBolt__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Vector__ = __webpack_require__(1);






class Tower {
	constructor({ vector }) {
		this.pos = vector;
		this.rotation = 0;
		this.cooldown = 0;
		this.method = "first";

		this.levels = {};

		this.targetMethods = {
			first: (enemies) => {
				return enemies.filter(e => this.isInRange(e))
					.sort((a, b) => {
						return a.distanceWalked < b.distanceWalked;
					})[0];
			},
			closest: (enemies) => {
				return enemies.filter(e => this.isInRange(e)).sort((a, b) => {
					return this.pos.distanceTo(a.pos) > this.pos.distanceTo(b.pos);
				})[0];
			},
			last: (enemies) => {
				return enemies.filter(e => this.isInRange(e))
					.sort((a, b) => {
						return a.distanceWalked > b.distanceWalked;
					})[0];
			},
			weakest: (enemies) => {
				return enemies.filter(e => this.isInRange(e))
					.sort((a, b) => {
						if (a.health == b.health) {
							return a.distanceWalked < b.distanceWalked;
						}
						return a.health > b.health;
					})[0];
			},
		}
	}
	isInRange(target) {
		return this.pos.center(-this.width, -this.height).distanceTo(target.pos.center(-target.width, -target.height)) <= this.range;
	}
	fire(target) {
		let velocity = __WEBPACK_IMPORTED_MODULE_4__Vector__["a" /* default */].createFromAngle(this.rotation, this.projectile.speed);
		window.gamesession.projectiles.push(new this.projectile.class({
			pos: this.pos.center(-this.width, -this.height),
			vel: velocity,
			damage: this.projectile.damage,
			radius: this.projectile.radius,
			penetration: this.projectile.penetration,
			color: this.projectile.color,
			target: target.pos.center(-target.width, -target.height),
		}));
		this.cooldown += 5000 / this.speed;
	}
	turnTo(target) {
		this.rotation = this.pos.center(-this.width, -this.height).getAngleTo(target.pos.center(-target.width, -target.height));
		return this;
	}
	upgrade(upgradeName) {
		this.levels[upgradeName] += 1;
		let level = this.levels[upgradeName];
		let upgrade = this.upgrades[upgradeName][level - 1];
		mergeDeep(this, upgrade);
	}
	draw(ctx) {
		let center = this.pos.center(-this.width, -this.height);

		ctx.save();
		ctx.translate(center.x, center.y);
		ctx.rotate(this.rotation);
		ctx.translate(-center.x, -center.y);
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
		ctx.restore();
	}
	update(enemies) {
		this.cooldown -= 1000 / 60;

		let target = this.targetMethods[this.method](enemies);
		if (target) {
			this.turnTo(target);
			if (this.cooldown <= 0) {
				this.fire(target);
			}
		} else if (this.cooldown < 0) {
			this.cooldown = 0;
		}
	}
}

class Cannon extends Tower {
	constructor({ vector }) {
		super({ vector });

		this.image = __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Cannon.png");
		this.width = 64;
		this.height = 64;
		this.range = 100;
		this.speed = 8;
		this.projectile = {
			class: __WEBPACK_IMPORTED_MODULE_1__Projectile__["a" /* default */],
			image: false,
			damage: 25,
			speed: 16,
			penetration: 4,
			radius: 10,
			color: "#333",
		};
		this.upgrades = {
			speed: [{
				price: 75,
				speed: 10,
			}, {
				price: 125,
				speed: 12,
			}],
			range: [{
				price: 100,
				range: 125,
			}, {
				price: 125,
				range: 150,
			}]
		}
		Object.keys(this.upgrades).forEach(e => this.levels[e] = 0);
	}
}
/* unused harmony export Cannon */


class Peashooter extends Tower {
	constructor({ vector }) {
		super({ vector });

		this.image = __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Peashooter.png");
		this.width = 64;
		this.height = 64;
		this.range = 150;
		this.speed = 24;
		this.projectile = {
			class: __WEBPACK_IMPORTED_MODULE_1__Projectile__["a" /* default */],
			image: false,
			damage: 5,
			speed: 24,
			penetration: 1,
			radius: 5,
			color: "#70b53f",
		};
		this.upgrades = {
			damage: [{
				price: 50,
				projectile: {
					damage: 7.5
				}
			}, {
				price: 100,
				projectile: {
					damage: 10
				}
			}],
		}
		Object.keys(this.upgrades).forEach(e => this.levels[e] = 0);
	}
}
/* unused harmony export Peashooter */


class Bomber extends Tower {
	constructor({ vector }) {
		super({ vector });

		this.image = __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Bomber.png");
		this.width = 64;
		this.height = 64;
		this.range = 120;
		this.speed = 3;
		this.projectile = {
			class: __WEBPACK_IMPORTED_MODULE_2__Explosive__["a" /* default */],
			damage: 50,
			penetration: null,
			color: "#292d25",
			radius: 16,
			speed: 8,
		};
		this.upgrades = {
			damage: [{
				price: 50
			}],
		}
		Object.keys(this.upgrades).forEach(e => this.levels[e] = 0);
	}
	draw(ctx) {
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
	}
	fire(target) {
		let velocity = __WEBPACK_IMPORTED_MODULE_4__Vector__["a" /* default */].createFromAngle(this.rotation, this.projectile.speed);
		window.gamesession.projectiles.push(new this.projectile.class({
			pos: this.pos.center(-this.width, -this.height),
			vel: velocity,
			target: target.pos.center(-target.width, -target.height),
		}));
		this.cooldown += 5000 / this.speed;
	}
}
/* unused harmony export Bomber */


class TeslaCoil extends Tower {
	constructor({ vector }) {
		super({ vector });

		this.image = __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/TeslaCoil.png");
		this.width = 64;
		this.height = 64;
		this.range = 120;
		this.speed = 3;
		this.projectile = {
			class: __WEBPACK_IMPORTED_MODULE_3__LightningBolt__["a" /* default */],
			damage: 25,
			speed: 100,
			penetration: 1,
			radius: 16,
			color: "#7DF9FF",
		};
		this.upgrades = {
			damage: [{
				price: 50
			}],
		}
		Object.keys(this.upgrades).forEach(e => this.levels[e] = 0);
	}
	draw(ctx) {
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
	}
	fire(target) {
		window.gamesession.projectiles.push(new __WEBPACK_IMPORTED_MODULE_3__LightningBolt__["a" /* default */]({
			target,
			pos: this.pos.center(-this.width, -this.height)
		}));
		this.cooldown += 5000 / this.speed;
	}
}
/* unused harmony export TeslaCoil */


let Towers = {
	Cannon: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Cannon.png"),
		price: 200,
		width: 64,
		height: 64,
		range: 100,
		type: Cannon
	},
	Peashooter: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Peashooter.png"),
		price: 100,
		width: 64,
		height: 64,
		range: 150,
		type: Peashooter
	},
	Bomber: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Bomber.png"),
		price: 500,
		width: 64,
		height: 64,
		range: 120,
		type: Bomber
	},
	TeslaCoil: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/TeslaCoil.png"),
		price: 500,
		width: 64,
		height: 64,
		range: 120,
		type: TeslaCoil
	}
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Projectile {
	constructor({ pos, damage, vel, radius, color, penetration }) {
		this.pos = pos;
		this.vel = vel;
		this.radius = radius;
		this.damage = damage;
		this.checkCollision = true;
		this.color = color;
		this.hitlist = [];
		this.penetration = penetration;
	}
	update() {
		this.pos.moveVector(this.vel);
	}
	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Projectile);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Enemy__ = __webpack_require__(2);



function NewGame() {
	window.gamesession = new __WEBPACK_IMPORTED_MODULE_0__Game__["a" /* default */]({});
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Tower__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Player__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__World__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Waves__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Animation__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__NewImage__ = __webpack_require__(0);








let UI = {
	fastForward: __WEBPACK_IMPORTED_MODULE_6__NewImage__["a" /* default */]("./resources/ui/fast-forward.png"),
	play: __WEBPACK_IMPORTED_MODULE_6__NewImage__["a" /* default */]("./resources/ui/play.png"),
	pause: __WEBPACK_IMPORTED_MODULE_6__NewImage__["a" /* default */]("./resources/ui/pause.png")
}

function isCircleRectColliding(circle, rect) {
	var distX = Math.abs(circle.pos.x - rect.pos.x - rect.width / 2);
	var distY = Math.abs(circle.pos.y - rect.pos.y - rect.height / 2);

	if (distX > (rect.width / 2 + circle.radius)) {
		return false;
	}
	if (distY > (rect.height / 2 + circle.radius)) {
		return false;
	}

	if (distX <= (rect.width / 2)) {
		return true;
	}
	if (distY <= (rect.height / 2)) {
		return true;
	}

	var dx = distX - rect.width / 2;
	var dy = distY - rect.height / 2;
	return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

class Game {
	constructor() {
		let __game = this;
		this.mousepos = new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](null, null);
		this.canvas = document.createElement("canvas");
		// this.canvas.imageSmoothingEnabled = false;
		let gamediv = document.getElementById("game")
		gamediv.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		this.selectedTower = null;
		this.fps = this.standardFps = 30;

		this.fastForwarded = false;

		(function () {
			let towerDisplay = document.createElement("div");
			towerDisplay.id = "tower-display";

			let div = document.createElement("div");

			let canv = document.createElement("canvas");
			canv.id = "tower-canvas";
			div.appendChild(canv);

			canv.width = 100;
			canv.height = 100;

			__game.towerDisplay = {
				elem: towerDisplay,
				canvas: canv,
				ctx: canv.getContext("2d"),
			};

			towerDisplay.appendChild(div);
			// towerDisplay.style.display = "none";
			let buttonDiv = document.createElement("div");
			buttonDiv.className = "buttons";
			buttonDiv.appendChild((function () {
				let button = document.createElement("button");
				button.textContent = "First";
				button.value = "first";
				return button;
			})());
			buttonDiv.appendChild((function () {
				let button = document.createElement("button");
				button.textContent = "Closest";
				button.value = "closest";
				return button;
			})());
			buttonDiv.appendChild((function () {
				let button = document.createElement("button");
				button.textContent = "Last";
				button.value = "last";
				return button;
			})());
			buttonDiv.appendChild((function () {
				let button = document.createElement("button");
				button.textContent = "Weakest";
				button.value = "weakest";
				return button;
			})());
			function call(e) {
				__game.towerDisplay.selectedTower.method = e.target.value;
			}
			Array.prototype.forEach.call(buttonDiv.children, button => {
				button.addEventListener("click", call);
			})
			towerDisplay.appendChild(buttonDiv);
			gamediv.appendChild(towerDisplay);

			let upgradediv = document.createElement("div");
			upgradediv.id = "upgrades";
			towerDisplay.appendChild(upgradediv);

			let menu = document.getElementById("menu");
			let fastForwardOrNextWave = document.createElement("div");
			fastForwardOrNextWave.className = "speed";
			fastForwardOrNextWave.addEventListener("click", function () {
				if (__game.wave.active) {
					__game.toggleFastForward();
				} else {
					__game.nextWave();
				}
			})
			fastForwardOrNextWave.appendChild((function () {
				let img = document.createElement("img");
				img.src = UI.fastForward.src;
				img.className = "fast-forward";
				img.style.display = "none";
				return img;
			})());
			fastForwardOrNextWave.appendChild((function () {
				let img = document.createElement("img");
				img.src = UI.play.src;
				img.className = "play";
				img.style.display = null;
				return img;
			})());
			menu.appendChild(fastForwardOrNextWave);

			let playPause = document.createElement("div");
			playPause.className = "speed play-pause";
			let imgpl = document.createElement("img");
			imgpl.src = UI.pause.src;
			playPause.appendChild(imgpl);
			menu.appendChild(playPause);
			playPause.addEventListener("click", () => {
				__game.togglePlay();
			});

			let towermenu = document.createElement("div");
			towermenu.className = "tower-menu";
			menu.appendChild(towermenu);
			Object.keys(__WEBPACK_IMPORTED_MODULE_1__Tower__["a" /* Towers */]).forEach(towername => {
				let tower = __WEBPACK_IMPORTED_MODULE_1__Tower__["a" /* Towers */][towername];

				let item = document.createElement("div");
				towermenu.appendChild(item);

				let image = document.createElement("img");
				image.src = tower.image.src;
				item.appendChild(image);
				let pricetext = document.createElement("span");
				pricetext.className = "price";
				pricetext.innerHTML = `${tower.price}c`;
				item.appendChild(pricetext);
				item.className = "tower";

				towermenu.appendChild(item);
				item.addEventListener("click", function () {
					if (this.classList.contains("active")) this.classList.remove("active");
					else {
						let elem = document.querySelector(".tower.active");
						if (elem) elem.classList.remove("active");
						this.classList.add("active");
					}
					if (__game.selectedTower == __WEBPACK_IMPORTED_MODULE_1__Tower__["a" /* Towers */][towername]) {
						__game.deselectBuyTower();
					} else {
						__game.selectedTower = __WEBPACK_IMPORTED_MODULE_1__Tower__["a" /* Towers */][towername];
					}
				})
			});
		})();

		this.enemies = [];
		this.animations = [];
		this.players = [new __WEBPACK_IMPORTED_MODULE_2__Player__["a" /* default */]({})];
		this.projectiles = [];
		this.world = new __WEBPACK_IMPORTED_MODULE_3__World__["a" /* default */]({});
		this.lives = 20;
		this.canvas.height = this.world.height;
		this.canvas.width = this.world.width;

		this.canvas.addEventListener("click", e => {
			let player = this.players[0];
			if (this.selectedTower == null) {
				// Attempt to open settings for tower clicked on.
				let towerln = player.towers.length;
				for (let i = 0; i < towerln; i++) {
					let tower = player.towers[i];
					if (tower.pos.x < this.mousepos.x && tower.pos.x + tower.width > this.mousepos.x &&
						tower.pos.y < this.mousepos.y && tower.pos.y + tower.height > this.mousepos.y) {
						this.displayTower(tower);
						return;
					}
				}
				this.towerDisplay.selectedTower = null;
			} else {
				// Place new tower
				let { width, height } = this.selectedTower;
				let vector = new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](e.clientX - width / 2, e.clientY - height / 2),
					tower = this.selectedTower;
				if (this.canPlaceTower(vector, tower) && player.buyTower({ vector, tower })) {
					this.deselectBuyTower();
				}
			}
		});
		this.canvas.addEventListener("mousemove", function (e) {
			__game.mousepos.x = e.clientX;
			__game.mousepos.y = e.clientY;
			__game.hideCursor = false;
		});
		this.canvas.addEventListener("mouseleave", function () {
			__game.hideCursor = true;
		});
		this.wave = {
			number: 0,
			queue: [],
			passedTime: 0,
			active: false
		}
	}
	deselectBuyTower() {
		this.selectedTower = null;
		let elem = document.querySelector(".tower.active");
		elem && elem.classList.remove("active");
	}
	startAnimation() {
		this.animid = requestAnimationFrame(this.draw.bind(this));
	}
	stopAnimation() {
		cancelAnimationFrame(this.animid);
	}
	togglePlay() {
		this.play = !this.play;
		if (this.play) {
			document.querySelector("#menu .speed.play-pause img").src = UI.pause.src;
			this.update();
		} else {
			document.querySelector("#menu .speed.play-pause img").src = UI.play.src;
		}
	}
	checkEnemyCollisions() {
		let projectiles = this.projectiles.filter(proj => proj.checkCollision === true);
		for (let i = 0; i < projectiles.length; i++) {
			let proj = projectiles[i];

			for (let o = 0; o < this.enemies.length; o++) {
				let enemy = this.enemies[o];

				let colliding = isCircleRectColliding(proj, enemy);
				if (colliding && proj.hitlist.indexOf(enemy) === -1) {
					proj.penetration -= enemy.armor;

					this.animations.push(new __WEBPACK_IMPORTED_MODULE_5__Animation__["a" /* Damage */]({ pos: enemy.pos.center(-enemy.width, -enemy.height) }));

					if (enemy.hurt(proj.damage)) {
						o -= 1;
					} else {
						proj.hitlist.push(enemy);
					}
					if (proj.penetration <= 0) {
						this.projectiles.splice(this.projectiles.indexOf(proj), 1);
						break;
					}
				}
			}
		}
	}
	detonate(explosive) {
		let enemies = this.enemies;
		let blast = { pos: explosive.pos, radius: explosive.blastRadius };
		this.animations.push(new __WEBPACK_IMPORTED_MODULE_5__Animation__["b" /* Explosion */]({ pos: explosive.pos.clone(), radius: explosive.blastRadius }))
		for (let i = 0; i < enemies.length; i++) {
			let enemy = enemies[i];
			if (isCircleRectColliding(blast, enemy)) {
				if (enemy.hurt(explosive.damage)) {
					i = i - 1;
				}
			}
		}
		this.projectiles.splice(explosive);
	}
	updateUpgrades(tower) {
		let player = this.players[0];
		let upgradediv = document.getElementById("upgrades");
		upgradediv.innerHTML = "";
		let baseBtn = document.createElement("button");
		baseBtn.className = "upgrade-btn";
		Object.keys(tower.upgrades).forEach(upg => {
			let upgradeButton = baseBtn.cloneNode();
			let upgrade = tower.upgrades[upg][tower.levels[upg]];

			if (upgrade) {
				upgradeButton.addEventListener("click", () => {
					let price = upgrade.price;
					if (player.money >= price) {
						player.money -= price;
						tower.upgrade(upg);
						this.displayTower(tower);
					}
				});

				upgradeButton.textContent = `${capFirstLetter(upg)}: ${upgrade.price}c`;
				upgradediv.appendChild(upgradeButton);
			}
		})
	}
	displayTower(tower) {
		this.towerDisplay.selectedTower = tower;
		// let td = this.towerDisplay.elem;
		this.updateUpgrades(tower);
	}
	drawTowerRange(pos, range, highlight) {
		this.ctx.fillStyle = highlight ? "rgba(180, 50, 50, 0.3)" : "rgba(100, 100, 100, 0.3)";
		this.ctx.beginPath();
		this.ctx.arc(pos.x, pos.y, range, 0, Math.PI * 2);
		this.ctx.fill();
	}
	nextWave() {
		let nr = ++this.wave.number;
		this.wave.queue = __WEBPACK_IMPORTED_MODULE_4__Waves__["a" /* GetWave */](nr);
		let menu = document.getElementById("menu");
		menu.querySelector(".play").style.display = "none";
		menu.querySelector(".fast-forward").style.display = null;
		this.wave.active = true;
	}
	endWave() {
		let menu = document.getElementById("menu");
		menu.querySelector(".play").style.display = null;
		menu.querySelector(".fast-forward").style.display = "none";
		this.wave.active = false;
		this.wave.passedTime = 0;
		this.resetFastForward();
	}
	resetFastForward() {
		this.fastForwarded = false;
		this.fps = this.standardFps;
		document.querySelector(".fast-forward").classList.remove("active");
	}
	toggleFastForward() {
		if (this.fastForwarded) {
			this.fastForwarded = false;
			this.fps = this.standardFps;
			document.querySelector(".fast-forward").classList.remove("active");
		} else {
			this.fastForwarded = true;
			this.fps = this.standardFps * 2;
			document.querySelector(".fast-forward").classList.add("active");
		}
	}
	currentlyInWave() {
		return (this.wave.queue.length !== 0);
	}
	spawnEnemies() {
		this.wave.passedTime += 1000 / this.fps;
		if (this.wave.queue[0].enemies.length === 0) {
			if (this.wave.queue.length === 1) return this.endWave();
			if (this.wave.passedTime > this.wave.queue[0].delay) {
				this.wave.passedTime -= this.wave.queue[0].delay;
				this.wave.queue.shift();
			}
		} else if (this.wave.passedTime > this.wave.queue[0].interval) {
			this.wave.passedTime -= this.wave.queue[0].interval;
			let enem = this.wave.queue[0].enemies.shift();
			this.enemies.push(enem);
		}
	}
	canPlaceTower(vector, tower) {
		let { width, height } = tower;
		let player = this.players[0];
		if (player.towers.some(tower => {
			if (vector.x + width > tower.pos.x && vector.x < tower.pos.x + tower.width &&
				vector.y + height > tower.pos.y && vector.y < tower.pos.y + tower.height) {
				return true;
			}
			return false;
		})) {
			return false;
		} else {
			for (let i = 0; i < this.world.path.length - 1; i++) {
				let p = this.world.path[i];
				let np = this.world.path[i + 1];
				let lw = this.world.pathWidth / 2;
				let x, y, wid, hei;
				if (p.x < np.x) {
					x = p.x - lw;
					wid = np.x - p.x + lw * 2;
				} else {
					x = np.x - lw;
					wid = p.x - np.x + lw * 2;
				}
				if (p.y < np.y) {
					y = p.y - lw;
					hei = np.y - p.y + lw * 2;
				} else {
					y = np.y - lw;
					hei = p.y - np.y + lw * 2;
				}
				if (vector.x < x + wid && vector.x + width > x &&
					vector.y < y + hei && vector.y + height > y) {
					return false;
				}
			}
		}
		return true;
	}
	update() {
		if (!this.play) return;
		this.animations.forEach(anim => {
			anim.update();
		})
		this.projectiles.forEach(proj => {
			proj.update();
			if (this.world.isOutOfBounds(proj.pos)) {
				this.projectiles.splice(this.projectiles.indexOf(proj), 1);
			}
		});
		this.enemies.map(enemy => {
			enemy.update();
		});
		this.enemies = this.enemies.filter(enemy => {
			return enemy.alive && !enemy.won;
		});
		this.players.forEach(player => {
			player.update();
		});
		this.checkEnemyCollisions();
		if (this.wave.active) {
			this.spawnEnemies();
		}
		setTimeout(this.update.bind(this), 1000 / this.fps);
	}
	draw() {
		let canvas = this.canvas,
			ctx = this.ctx;
		let td = this.towerDisplay;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		td.ctx.clearRect(0, 0, td.canvas.width, td.canvas.height);

		this.world.draw(ctx);
		this.enemies.forEach(enemy => enemy.draw(ctx));
		if (this.selectedTower != null && !this.hideCursor) {
			let tw = this.selectedTower;
			let canPlace = this.canPlaceTower(new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](this.mousepos.x, this.mousepos.y).center(tw.width, tw.height), this.selectedTower);

			this.drawTowerRange(new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](this.mousepos.x, this.mousepos.y), tw.range, !canPlace);
			ctx.drawImage(tw.image, this.mousepos.x - tw.width / 2, this.mousepos.y - tw.height / 2, tw.width, tw.height);
		}
		if (td.selectedTower) {
			this.drawTowerRange(td.selectedTower.pos.center(-td.selectedTower.width, -td.selectedTower.height), td.selectedTower.range);
		}
		this.players.forEach(player => player.draw(ctx));
		if (td.selectedTower) {
			let dx = 0;
			let dy = 0;
			let swidth = td.selectedTower.width * 1.4;
			let sheight = td.selectedTower.height * 1.4;
			let sx = td.selectedTower.pos.x - (swidth - td.selectedTower.width) / 2;
			let sy = td.selectedTower.pos.y - (sheight - td.selectedTower.height) / 2;
			let dwidth = td.canvas.width;
			let dheight = td.canvas.height;
			td.ctx.drawImage(canvas, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);
		}
		this.animations.forEach(anim => {
			anim.draw(ctx);
		})
		this.projectiles.forEach(proj => proj.draw(ctx));
		ctx.fillStyle = "#333"
		ctx.font = "24px 'Segoe UI'";
		ctx.textAlign = "left";
		ctx.fillText(`Lives: ${this.lives}`, 10, 30);
		ctx.textAlign = "right";
		ctx.fillText(`Coin: ${this.players[0].money}`, canvas.width - 10, 30);
		ctx.textAlign = "center";
		ctx.fillText(`Wave: ${this.wave.number}`, canvas.width / 2, 30);
		requestAnimationFrame(this.draw.bind(this));
	}
}

function capFirstLetter(string) {
	return string.replace("-", " ").charAt(0).toUpperCase() + string.slice(1);
}

/* harmony default export */ __webpack_exports__["a"] = (Game);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NewImage__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Projectile__ = __webpack_require__(4);



class Explosive extends __WEBPACK_IMPORTED_MODULE_1__Projectile__["a" /* default */] {
	constructor(args) {
		super(args);
		let { target } = args;
		this.checkCollision = false;
		this.target = target;

		this.image = __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/other/Bomb.png");
		this.blastRadius = 100;
		this.damage = 50;
		this.speed = 8;
		this.penetration = null;
		this.radius = 16;
		this.color = "#70b53f";
	}
	update() {
		if (this.pos.distanceTo(this.target) < this.vel.getHyp()) {
			this.pos = this.target;
			window.gamesession.detonate(this);
		} else {
			this.pos.moveTowards(this.target, this.vel.getHyp());
		}
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Explosive);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Tower__ = __webpack_require__(3);


class Player {
	constructor({ name = "Player" }) {
		this.name = name;
		this.towers = [];
		this.money = 300;
	}
	buyTower({ vector, tower }) {
		let towercost = tower.price;
		if (this.money - towercost >= 0) {
			this.money = this.money - towercost;
			this.towers.push(new tower.type({ vector }));
			return true;
		}
		return false;
	}
	update() {
		this.towers.forEach(tower => {
			tower.update(window.gamesession.enemies);
		});
	}
	draw(ctx) {
		this.towers.forEach(tower => {
			tower.draw(ctx);
		});
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Player);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Maps__ = __webpack_require__(10);


class World {
	constructor({ mapnr = 0 }) {
		Object.assign(this, __WEBPACK_IMPORTED_MODULE_0__Maps__["a" /* default */][mapnr]);
	}
	isOutOfBounds(vector) {
		return vector.x < 0 || vector.x > this.width || vector.y < 0 || vector.y > this.height;
	}
	draw(ctx) {
		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.lineJoin = "round"
		ctx.beginPath();
		ctx.strokeStyle = this.pathColor;
		ctx.lineWidth = this.pathWidth;
		this.path.forEach((vector, index) => {
			if (index === 0) return ctx.moveTo(vector.x, vector.y);
			ctx.lineTo(vector.x, vector.y);
		})
		ctx.stroke();
	}
}

/* harmony default export */ __webpack_exports__["a"] = (World);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Vector__ = __webpack_require__(1);


const Maps = {
	0: {
		width: 1000,
		height: 600,
		backgroundColor: "#fcbf49",
		// backgroundColor: "#f4d35e",
		// pathColor: "#003049",
		pathColor: "#ebebd3",
		pathWidth: 48,
		path: [
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](-50, 100),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](120, 100),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](100, 300),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](400, 300),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](400, 100),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](275, 100),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](275, 450),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](600, 450),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](600, 200),
			new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](1050, 200),
		],
		props: [
			{ pos: new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](600, 150), type: "Cactus" }, // Display these on the map allso!
			{ pos: new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](120, 150), type: "Cactus" },
			{ pos: new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](300, 450), type: "Cactus" },
			{ pos: new __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */](750, 320), type: "Cactus" },
		]
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Maps);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_color___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_color__);



// let Images = {
// 	Explosion: NewImage("")
// }

/**
 * Animation class for animations
 */
class Animation {
	constructor({ duration, pos }) {
		this.startTime = Date.now();
		this.duration = duration;
		this.pos = pos;
	}
	update() {
		this.frameCount++;
		if (this.frameCount > this.duration) {
			let anims = window.gamesession.animations;
			anims.splice(anims.indexOf(this), 1);
			return;
		}
		this.particles.forEach(particle => {
			particle.update();
		})
	}
	draw(ctx) {
		this.particles.forEach(particle => {
			particle.draw(ctx, 1 - this.frameCount / this.duration);
		})
	}
}
/* unused harmony export Animation */


/**
 * Particle class
 * @param {number} width
 * @param {Vector} vel
 * @param {Vector} pos
 */

class Particle {
	constructor({ width = 8, height = 8, color, vel, pos }) {
		this.width = width;
		this.height = height;
		this.color = color;
		this.vel = vel;
		this.pos = pos;
	}
	draw(ctx, opacity) {
		ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_1_color___default.a(this.color).alpha(opacity);
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	}
	update() {
		this.pos.add(this.vel);
	}
}

class Damage extends Animation {
	constructor({ pos, duration = 20 }) {
		super({ pos, duration });
		this.particles = [];
		this.frameCount = 0;

		let particleNum = ((Math.random() * 5) | 0) + 5;
		for (let i = 0; i < particleNum; i++) {
			this.particles.push(new Particle({ color: "#d62f2f", pos: this.pos.clone(), vel: __WEBPACK_IMPORTED_MODULE_0__Vector__["a" /* default */].createFromAngle(Math.random() * Math.PI * 2, Math.random() + 1) }));
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Damage;


class Explosion extends Animation {
	constructor({ pos, radius }) {
		super({ pos });
		this.vel = 8;
		this.radius = radius;
		this.currentRadius = 0;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.currentRadius, 0, Math.PI * 2);
		ctx.strokeStyle = __WEBPACK_IMPORTED_MODULE_1_color___default.a.rgb(120, 120, 120).alpha(1 - this.currentRadius / this.radius);
		ctx.lineWidth = 25;
		ctx.stroke();
		ctx.closePath();
	}
	update() {
		this.currentRadius += this.vel;
		if (this.currentRadius > this.radius) {
			let anims = window.gamesession.animations;
			anims.splice(anims.indexOf(this), 1);
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Explosion;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(12);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var v;

	if (max === 0) {
		s = 0;
	} else {
		s = (delta / max * 1000) / 10;
	}

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	v = ((max / 255) * 1000) / 10;

	return [h, s, v];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in cssKeywords) {
		if (cssKeywords.hasOwnProperty(keyword)) {
			var value = cssKeywords[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colorString = __webpack_require__(15);
var convert = __webpack_require__(18);

var _slice = [].slice;

var skippedModels = [
	// to be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// gray conflicts with some method names, and has its own method defined.
	'gray',

	// shouldn't really be in color-convert either...
	'hex'
];

var hashedModelKeys = {};
Object.keys(convert).forEach(function (model) {
	hashedModelKeys[_slice.call(convert[model].labels).sort().join('')] = model;
});

var limiters = {};

function Color(obj, model) {
	if (!(this instanceof Color)) {
		return new Color(obj, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	var i;
	var channels;

	if (!obj) {
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (obj instanceof Color) {
		this.model = obj.model;
		this.color = obj.color.slice();
		this.valpha = obj.valpha;
	} else if (typeof obj === 'string') {
		var result = colorString.get(obj);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + obj);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (obj.length) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		var newArr = _slice.call(obj, 0, channels);
		this.color = zeroArray(newArr, channels);
		this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
	} else if (typeof obj === 'number') {
		// this is always RGB - can be converted later on.
		obj &= 0xFFFFFF;
		this.model = 'rgb';
		this.color = [
			(obj >> 16) & 0xFF,
			(obj >> 8) & 0xFF,
			obj & 0xFF
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		var keys = Object.keys(obj);
		if ('alpha' in obj) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
		}

		var hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
		}

		this.model = hashedModelKeys[hashedKeys];

		var labels = convert[this.model].labels;
		var color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(obj[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			var limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString: function () {
		return this.string();
	},

	toJSON: function () {
		return this[this.model]();
	},

	string: function (places) {
		var self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to[self.model](args);
	},

	percentString: function (places) {
		var self = this.rgb().round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to.rgb.percent(args);
	},

	array: function () {
		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
	},

	object: function () {
		var result = {};
		var channels = convert[this.model].channels;
		var labels = convert[this.model].labels;

		for (var i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray: function () {
		var rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject: function () {
		var rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round: function (places) {
		places = Math.max(places || 0, 0);
		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
	},

	alpha: function (val) {
		if (arguments.length) {
			return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
		}

		return this.valpha;
	},

	// rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(100)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(100)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return convert[this.model].keyword(this.color);
	},

	hex: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	rgbNumber: function () {
		var rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity: function () {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		var rgb = this.rgb().color;

		var lum = [];
		for (var i = 0; i < rgb.length; i++) {
			var chan = rgb[i] / 255;
			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast: function (color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		var lum1 = this.luminosity();
		var lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level: function (color2) {
		var contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	dark: function () {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		var rgb = this.rgb().color;
		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	light: function () {
		return !this.dark();
	},

	negate: function () {
		var rgb = this.rgb();
		for (var i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}
		return rgb;
	},

	lighten: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten: function (ratio) {
		var hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken: function (ratio) {
		var hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale: function () {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		var rgb = this.rgb().color;
		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(val, val, val);
	},

	fade: function (ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer: function (ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate: function (degrees) {
		var hsl = this.hsl();
		var hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix: function (mixinColor, weight) {
		// ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		var color1 = this.rgb();
		var color2 = mixinColor.rgb();
		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;
		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
		var w2 = 1 - w1;

		return Color.rgb(
				w1 * color1.red() + w2 * color2.red(),
				w1 * color1.green() + w2 * color2.green(),
				w1 * color1.blue() + w2 * color2.blue(),
				color1.alpha() * p + color2.alpha() * (1 - p));
	}
};

// model conversion methods and static constructors
Object.keys(convert).forEach(function (model) {
	if (skippedModels.indexOf(model) !== -1) {
		return;
	}

	var channels = convert[model].channels;

	// conversion methods
	Color.prototype[model] = function () {
		if (this.model === model) {
			return new Color(this);
		}

		if (arguments.length) {
			return new Color(arguments, model);
		}

		var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
		return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
	};

	// 'static' construction methods
	Color[model] = function (color) {
		if (typeof color === 'number') {
			color = zeroArray(_slice.call(arguments), channels);
		}
		return new Color(color, model);
	};
});

function roundTo(num, places) {
	return Number(num.toFixed(places));
}

function roundToPlace(places) {
	return function (num) {
		return roundTo(num, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	model.forEach(function (m) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	});

	model = model[0];

	return function (val) {
		var result;

		if (arguments.length) {
			if (modifier) {
				val = modifier(val);
			}

			result = this[model]();
			result.color[channel] = val;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(val) {
	return Array.isArray(val) ? val : [val];
}

function zeroArray(arr, length) {
	for (var i = 0; i < length; i++) {
		if (typeof arr[i] !== 'number') {
			arr[i] = 0;
		}
	}

	return arr;
}

module.exports = Color;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var colorNames = __webpack_require__(12);
var swizzle = __webpack_require__(16);

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = module.exports = {
	to: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArrayish = __webpack_require__(17);

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle = module.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(13);
var route = __webpack_require__(19);

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(13);

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

// https://jsperf.com/object-keys-vs-for-in-with-closure/3
var models = Object.keys(conversions);

function buildGraph() {
	var graph = {};

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = GetWave;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Enemy__ = __webpack_require__(2);


/*	Queue Object:
 *		enemies: []Enemy
 *			which enemies to spawn
 *		interval: Number
 *			ms to wait between each enemy. defaults to 250ms
 *		delay: Number
 *			ms to wait until next batch. defaults to 1000ms
 */

function GetWave(wavenr) {
	let queue = [];

	if (wavenr >= 0) {
		let batch = {
			enemies: addN(10 * wavenr, __WEBPACK_IMPORTED_MODULE_0__Enemy__["a" /* default */]),
			interval: 1000,
			delay: 10000,
		}
		queue.push(batch);
	}
	if (wavenr >= 5) {
		queue.push({
			enemies: addN(15, __WEBPACK_IMPORTED_MODULE_0__Enemy__["a" /* default */], { type: "Goblin" }).concat(addN(15, __WEBPACK_IMPORTED_MODULE_0__Enemy__["a" /* default */], { type: "Ogre" })),
			interval: 500,
			delay: 2500,
		})
		queue.push({
			enemies: addN(15, __WEBPACK_IMPORTED_MODULE_0__Enemy__["a" /* default */], { type: "Goblin" }).concat(addN(15, __WEBPACK_IMPORTED_MODULE_0__Enemy__["a" /* default */], { type: "Ogre" })),
			interval: 500,
			delay: 2500,
		});
	}
	if (wavenr > 10) {
	}
	return queue;
}

function addN(iterations, classFunction) {
	let restArgs = Array.prototype.slice.call(arguments, 3);
	if (restArgs.length == 0) restArgs = [{}];
	let array = [];
	for (let i = 0; i < iterations; i++) {
		array.push(new classFunction(...restArgs));
	}
	return array;
}

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Projectile__ = __webpack_require__(4);


class LightningBolt extends __WEBPACK_IMPORTED_MODULE_0__Projectile__["a" /* default */] {
	constructor({ pos, target, upgrades }) {
		super({ pos });
		this.checkCollision = false;
		this.color = "#7DF9FF";
		this.damage = 3;
		this.speed = 100;
		this.penetration = 3;
		Object.assign(this, upgrades);
		this.range = 120;

		this.duration = 30;
		this.frameCount = 0;

		this.targets = [target];
		for (let i = 0; i < this.penetration; i++) {
			let p = this.targets[this.targets.length - 1].pos || this.pos;
			let enemies = window.gamesession.enemies
				.filter(e => {
					return (e.pos.center(-e.width, -e.height).distanceTo(p) <= this.range) && this.targets.indexOf(e) === -1;
				})
				.sort((a, b) => a.pos.center(-a.width, -a.height).distanceTo(p) > b.pos.center(-b.width, -b.height).distanceTo(p));
			let target = enemies[0];
			if (target) this.targets.push(target);
		}
	}
	update() {
		this.frameCount++;
		console.log(this.targets.length)
		if (this.frameCount < this.duration) {
			this.targets.forEach(e => {
				console.log("hurt")
				if (e.hurt(this.damage)) {
					this.targets.splice(this.targets.indexOf(e), 1);
				}
			});
		} else {
			let projectiles = window.gamesession.projectiles;
			projectiles.splice(projectiles.indexOf(this), 1);
		}
	}
	draw(ctx) {
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		this.targets.forEach(target => {
			let pos = target.pos.center(-target.width, -target.height);
			ctx.lineTo(pos.x, pos.y);
		});
		ctx.stroke();
		ctx.closePath();
	}
}

/* harmony default export */ __webpack_exports__["a"] = (LightningBolt);

/***/ })
/******/ ]);