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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Projectile__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Explosive__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Vector__ = __webpack_require__(1);





class Tower {
	constructor({ vector, tower = Tower.Types.Cannon }) {
		this.pos = vector;
		this.rotation = 0;
		this.cooldown = 0;

		Object.assign(this, tower);

		this.method = "first";

		this.levels = {};
		Object.keys(tower.upgrades).forEach(e => this.levels[e] = 0);

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
	upgrade(upgradeName) {
		this.levels[upgradeName] += 1;
		let level = this.levels[upgradeName];
		let upgrade = this.upgrades[upgradeName][level - 1];
		mergeDeep(this, upgrade);
	}
	isInRange(target) {
		return this.pos.center(-this.width, -this.height).distanceTo(target.pos.center(-target.width, -target.height)) <= this.range;
	}
	fire(target) {
		let velocity = __WEBPACK_IMPORTED_MODULE_3__Vector__["a" /* default */].createFromAngle(this.rotation, this.projectile.speed);
		window.gamesession.projectiles.push(new this.projectile.class({
			pos: this.pos.center(-this.width, -this.height),
			vel: velocity,
			type: this.projectile,
			target: target.pos.center(-target.width, -target.height),
		}));
		this.cooldown += 5000 / this.speed;
	}
	turnTo(target) {
		this.rotation = this.pos.center(-this.width, -this.height).getAngleTo(target.pos.center(-target.width, -target.height));
		return this;
	}
	draw(ctx) {
		let center = this.pos.center(-this.width, -this.height);

		if (this.rotateImage) {
			ctx.save();
			ctx.translate(center.x, center.y);
			ctx.rotate(this.rotation);
			ctx.translate(-center.x, -center.y);
		}

		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);

		if (this.rotateImage) {
			ctx.restore();
		}
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

Tower.Types = {
	Cannon: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Cannon.png"),
		width: 64,
		height: 64,
		range: 100,
		speed: 8,
		price: 200,
		rotateImage: true,
		projectile: {
			class: __WEBPACK_IMPORTED_MODULE_1__Projectile__["a" /* default */],
			image: false,
			damage: 25,
			speed: 16,
			penetration: 4,
			radius: 10,
			color: "#333",
		},
		upgrades: {
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
		},
	},
	Peashooter: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Peashooter.png"),
		width: 64,
		height: 64,
		range: 150,
		speed: 24,
		price: 100,
		rotateImage: true,
		projectile: {
			class: __WEBPACK_IMPORTED_MODULE_1__Projectile__["a" /* default */],
			image: false,
			damage: 5,
			speed: 24,
			penetration: 1,
			radius: 5,
			color: "#70b53f",
		},
		upgrades: {
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
		},
	},
	Bomber: {
		image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/towers/Bomber.png"),
		width: 64,
		height: 64,
		range: 120,
		speed: 3,
		price: 500,
		rotateImage: false,
		projectile: {
			class: __WEBPACK_IMPORTED_MODULE_2__Explosive__["a" /* default */],
			image: __WEBPACK_IMPORTED_MODULE_0__NewImage__["a" /* default */]("./resources/other/Bomb.png"),
			blastRadius: 100,
			damage: 50,
			speed: 8,
			penetration: 6,
			radius: 16,
			color: "#292d25",
		},
		upgrades: {
			damage: [{
				price: 50
			}],
		},
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Tower);

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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Projectile {
	constructor({ pos, vel, type }) {
		this.pos = pos;
		this.vel = vel;
		Object.assign(this, type);
		this.hitlist = [];
		this.checkCollision = true;
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Enemy__ = __webpack_require__(6);



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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Enemy__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Tower__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Player__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__World__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__NewImage__ = __webpack_require__(0);







let UI = {
	fastForward: __WEBPACK_IMPORTED_MODULE_5__NewImage__["a" /* default */]("./resources/ui/fast-forward.png"),
	play: __WEBPACK_IMPORTED_MODULE_5__NewImage__["a" /* default */]("./resources/ui/play.png"),
	pause: __WEBPACK_IMPORTED_MODULE_5__NewImage__["a" /* default */]("./resources/ui/pause.png")
}

function getWave(wavenr) {
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

/*	Queue Object:
 *		enemies: []Enemy
 *			which enemies to spawn
 *		interval: Number
 *			ms to wait between each enemy. defaults to 250ms
 *		delay: Number
*			ms to wait until next batch. defaults to 1000ms
 */
function addN(iterations, classFunction) {
	let restArgs = Array.prototype.slice.call(arguments, 3);
	if (restArgs.length == 0) restArgs = [{}];
	let array = [];
	for (let i = 0; i < iterations; i++) {
		array.push(new classFunction(...restArgs));
	}
	return array;
}

class Game {
	constructor() {
		let __game = this;
		this.mousepos = new __WEBPACK_IMPORTED_MODULE_1__Vector__["a" /* default */](null, null);
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
			Object.keys(__WEBPACK_IMPORTED_MODULE_2__Tower__["a" /* default */].Types).forEach(towername => {
				let tower = __WEBPACK_IMPORTED_MODULE_2__Tower__["a" /* default */].Types[towername];

				let item = document.createElement("div");
				towermenu.appendChild(item);

				let image = document.createElement("img");
				image.src = tower.image.src;
				item.appendChild(image);
				let pricetext = document.createElement("span");
				pricetext.className = "price";
				pricetext.innerHTML = `$${tower.price}`;
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
					if (__game.selectedTower == __WEBPACK_IMPORTED_MODULE_2__Tower__["a" /* default */].Types[towername]) {
						__game.deselectBuyTower();
					} else {
						__game.selectedTower = __WEBPACK_IMPORTED_MODULE_2__Tower__["a" /* default */].Types[towername];
					}
				})
			});
		})();

		this.enemies = [];
		this.players = [new __WEBPACK_IMPORTED_MODULE_3__Player__["a" /* default */]({})];
		this.projectiles = [];
		this.world = new __WEBPACK_IMPORTED_MODULE_4__World__["a" /* default */]({});
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
				let vector = new __WEBPACK_IMPORTED_MODULE_1__Vector__["a" /* default */](e.clientX - width / 2, e.clientY - height / 2),
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
					enemy.health -= proj.damage;
					proj.penetration -= enemy.armor;
					if (enemy.health <= 0) {
						enemy.die();
						this.players[0].money += enemy.drop;
						this.enemies.splice(this.enemies.indexOf(enemy), 1);
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
		for (let i = 0; i < enemies.length; i++) {
			let enemy = enemies[i];
			if (isCircleRectColliding(blast, enemy)) {
				enemy.health -= explosive.damage;
				if (enemy.health <= 0) {
					enemies.splice(enemies.indexOf(enemy), 1);
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
		this.wave.queue = getWave(nr);
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
			let canPlace = this.canPlaceTower(new __WEBPACK_IMPORTED_MODULE_1__Vector__["a" /* default */](this.mousepos.x, this.mousepos.y).center(tw.width, tw.height), this.selectedTower);

			this.drawTowerRange(new __WEBPACK_IMPORTED_MODULE_1__Vector__["a" /* default */](this.mousepos.x, this.mousepos.y), tw.range, !canPlace);
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
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/* harmony default export */ __webpack_exports__["a"] = (Game);

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

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Projectile__ = __webpack_require__(3);


class Explosive extends __WEBPACK_IMPORTED_MODULE_0__Projectile__["a" /* default */] {
	constructor({ target, pos, vel, type }) {
		super({ pos, vel, type });
		Object.assign(this, type);
		this.target = target;
		this.checkCollision = false;
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Tower__ = __webpack_require__(2);


class Player {
	constructor({ name = "Player" }) {
		this.name = name;
		this.towers = [];
		this.money = 300;
	}
	buyTower({ vector, tower = __WEBPACK_IMPORTED_MODULE_0__Tower__["a" /* default */].Types.Cannon }) {
		let towercost = tower.price;
		if (this.money - towercost >= 0) {
			this.money = this.money - towercost;
			this.towers.push(new __WEBPACK_IMPORTED_MODULE_0__Tower__["a" /* default */]({ vector, tower }));
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

/***/ })
/******/ ]);