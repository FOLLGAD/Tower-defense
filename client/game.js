function newImg(src) {
	let img = new Image();
	img.src = src;
	return img;
}

let UI = {
	fastForward: newImg("./resources/ui/fast-forward.png"),
	play: newImg("./resources/ui/play.png"),
	pause: newImg("./resources/ui/pause.png")
}

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
		return new Vector(this.x - width / 2, this.y - width / 2);
	}
	static getComponents(angle, speed = 1) {
		return [speed * Math.cos(angle), speed * Math.sin(angle)];
	}
	static createFromAngle(angle, speed = 1) {
		return new Vector(speed * Math.cos(angle), speed * Math.sin(angle))
	}
}

let Maps = {
	0: {
		width: 1000,
		height: 600,
		backgroundColor: "#fcbf49",
		pathColor: "#003049",
		path: [
			new Vector(-50, 100),
			new Vector(100, 100),
			new Vector(100, 300),
			new Vector(400, 300),
			new Vector(400, 100),
			new Vector(300, 100),
			new Vector(300, 400),
			new Vector(600, 400),
			new Vector(600, 200),
			new Vector(1050, 200),
		],
	}
}

class World {
	constructor({ mapnr = 0 }) {
		Object.assign(this, Maps[mapnr]);
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
		ctx.lineWidth = 48;
		this.path.forEach((vector, index) => {
			if (index === 0) return ctx.moveTo(vector.x, vector.y);
			ctx.lineTo(vector.x, vector.y);
		})
		ctx.stroke();
	}
}

let Enemies = {
	Ogre: {
		image: newImg("./resources/enemies/base.png"),
		drop: 10,
		walkingSpeed: 2,
		width: 48,
		height: 48,
		health: 100,
		damage: 1,
		armor: 2,
	},
	Goblin: {
		image: newImg("./resources/enemies/base.png"),
		drop: 5,
		walkingSpeed: 4,
		width: 32,
		height: 32,
		health: 50,
		damage: 1,
		armor: 1,
	}
}

class Enemy {
	constructor({ type = "Ogre" }) {
		this.type = type;

		let enemy = Enemies[type];

		// Copy all properties from enemy to this context.
		Object.assign(this, enemy);

		this.pathIndex = 1;
		this.alive = true;
		this.pos = gamesession.world.path[0].center(this.width, this.height);
		this.goal = gamesession.world.path[this.pathIndex].center(this.width, this.height);
		this.distanceWalked = 0;
		this.won = false;
	}
	draw(ctx) {
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
		ctx.fillStyle = "#888888";
		ctx.fillRect(this.pos.x, this.pos.y + this.height + 5, this.width, 5);
		ctx.fillStyle = "#bb2233";
		ctx.fillRect(this.pos.x, this.pos.y + this.height + 5, this.width * (this.health / Enemies[this.type].health), 5);
	}
	die() {
		this.alive = false;
	}
	win() {
		gamesession.lives -= this.damage;
		this.alive = false;
		this.won = true;
	}
	getPosFromPath() {
		let path = gamesession.world.path;
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
		this.getPosFromPath();
	}
}

const Towers = {
	Cannon: {
		image: newImg("./resources/towers/cannon2.png"),
		width: 48,
		height: 48,
		range: 100,
		speed: 8,
		price: 200,
		projectile: {
			damage: 100,
			speed: 16,
			penetration: 3,
			radius: 5,
			color: "#333",
		},
	},
	Peashooter: {
		image: newImg("./resources/towers/peashooter.png"),
		width: 48,
		height: 48,
		range: 150,
		speed: 24,
		price: 100,
		projectile: {
			damage: 25,
			speed: 24,
			penetration: 1,
			radius: 2,
			color: "#70b53f",
		},
	},
	Bomber: {
		image: newImg("./resources/towers/cannon.png"),
		width: 48,
		height: 48,
		range: 80,
		speed: 4,
		price: 300,
		projectile: {
			damage: 200,
			speed: 8,
			penetration: 5,
			radius: 8,
			color: "#292d25",
		},
	}
}

class Projectile {
	constructor({ pos, vel, type }) {
		this.pos = pos;
		this.vel = vel;
		Object.assign(this, type);
		this.hitlist = [];
	}
	update(deltatime) {
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

class Tower {
	constructor({ vector, type = "Cannon" }) {
		this.pos = vector;
		this.rotation = 0;
		this.cooldown = 0;

		Object.assign(this, Towers[type]);

		this.method = "first";

		this.targetMethods = {
			first: () => {
				return gamesession.enemies.filter(e => this.isInRange(e))
					.sort((a, b) => {
						return a.distanceWalked < b.distanceWalked;
					})[0];
			},
			closest: () => {
				return gamesession.enemies.filter(e => this.isInRange(e)).sort((a, b) => {
					return this.pos.distanceTo(a.pos) > this.pos.distanceTo(b.pos);
				})[0];
			},
			last: () => {
				return gamesession.enemies.filter(e => this.isInRange(e))
					.sort((a, b) => {
						return a.distanceWalked > b.distanceWalked;
					})[0];
			},
			weakest: () => {
				return gamesession.enemies.filter(e => this.isInRange(e))
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
	fire() {
		let velocity = Vector.createFromAngle(this.rotation, this.projectile.speed);
		gamesession.projectiles.push(new Projectile({
			pos: this.pos.center(-this.width, -this.height),
			vel: velocity,
			type: this.projectile,
		}));
		this.cooldown += 5000 / this.speed;
	}
	turnTo(target) {
		this.rotation = this.pos.center(-this.width, -this.height).getAngleTo(target.pos.center(-target.width, -target.height));
		return this;
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
	update() {
		this.cooldown -= 1000 / 60;

		let target = this.targetMethods[this.method]();
		if (target) {
			this.turnTo(target);
			if (this.cooldown <= 0) {
				this.fire();
			}
		} else if (this.cooldown < 0) {
			this.cooldown = 0;
		}
	}
}

class Player {
	constructor({ name = "Player" }) {
		this.name = name;
		this.towers = [];
		this.money = 300;
	}
	buyTower({ vector, type = "Cannon" }) {
		let towercost = Towers[type].price;
		if (this.money - towercost >= 0) {
			this.money = this.money - towercost;
			this.towers.push(new Tower({ vector, type }));
			return true;
		}
		return false;
	}
	update() {
		this.towers.forEach(tower => {
			tower.update();
		})
	}
	draw(ctx) {
		this.towers.forEach(tower => {
			tower.draw(ctx);
		})
	}
}

class Game {
	constructor() {
		let __game = this;
		this.mousepos = new Vector(0, 0);
		this.canvas = document.createElement("canvas");
		this.canvas.imageSmoothingEnabled = false;
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
		})();

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
		menu.appendChild(playPause);
		playPause.addEventListener("click", () => {
			this.togglePlay();
		});

		let towermenu = document.createElement("div");
		towermenu.className = "tower-menu";
		menu.appendChild(towermenu);
		Object.keys(Towers).forEach(towername => {
			let tower = Towers[towername];

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
			item.addEventListener("click", function (e) {
				if (this.classList.contains("active")) this.classList.remove("active");
				else {
					let elem = document.querySelector(".tower.active");
					if (elem) elem.classList.remove("active");
					this.classList.add("active");
				}
				if (__game.selectedTower == towername) {
					__game.deselectBuyTower();
				} else {
					__game.selectedTower = towername;
				}
			})
		});

		this.enemies = [];
		this.players = [new Player({})];
		this.projectiles = [];
		this.round = 0;
		this.world = new World({});
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
				let { width, height } = Towers[this.selectedTower];
				if (player.buyTower({ vector: new Vector(e.clientX - width / 2, e.clientY - height / 2), type: this.selectedTower })) {
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
		if (this.play) this.update();
	}
	checkEnemyCollisions() {
		let projln = this.projectiles.length;
		let enemln = this.enemies.length;

		for (let i = 0; i < this.projectiles.length; i++) {
			let proj = this.projectiles[i];

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
	displayTower(tower) {
		this.towerDisplay.selectedTower = tower;
		let td = this.towerDisplay.elem;
	}
	drawTowerRange(pos, range) {
		this.ctx.fillStyle = "rgba(100, 100, 150, 0.3)";
		this.ctx.beginPath();
		this.ctx.arc(pos.x, pos.y, range, 0, Math.PI * 2);
		this.ctx.fill();
	}
	nextWave() {
		let nr = ++this.wave.number;
		this.wave.queue = getWave(nr);
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
	}
	resetFastForward() {
		this.fastForwarded = false;
		this.fps = this.standardFps;
	}
	toggleFastForward() {
		if (this.fastForwarded) {
			this.fastForwarded = false;
			this.fps = this.standardFps;
		} else {
			this.fastForwarded = true;
			this.fps = this.standardFps * 2;
		}
	}
	currentlyInWave() {
		return (this.wave.queue.length !== 0);
	}
	spawnEnemies() {
		this.wave.passedTime += 1000 / this.fps;
		if (this.wave.queue[0].enemies.length === 0) {
			if (this.wave.queue.length === 1 && this.enemies.length === 0) return this.endWave();
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
		this.players.forEach(player => player.update());
		this.checkEnemyCollisions();
		if (this.wave.active) {
			this.spawnEnemies();
		}
		setTimeout(this.update.bind(this), 1000 / this.fps);
	}
	draw() {
		let canvas = this.canvas,
			ctx = this.ctx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		this.world.draw(ctx);
		this.enemies.forEach(enemy => enemy.draw(ctx));
		this.projectiles.forEach(proj => proj.draw(ctx));
		if (this.selectedTower != null && !this.hideCursor) {
			let tw = Towers[this.selectedTower];
			this.drawTowerRange(new Vector(this.mousepos.x, this.mousepos.y), tw.range);
			ctx.drawImage(tw.image, this.mousepos.x - tw.width / 2, this.mousepos.y - tw.height / 2, tw.width, tw.height);
		}
		let td = this.towerDisplay;
		if (td.selectedTower) {
			this.drawTowerRange(td.selectedTower.pos.center(-td.selectedTower.width, -td.selectedTower.height), td.selectedTower.range);
		}
		this.players.forEach(player => player.draw(ctx));
		td.ctx.clearRect(0, 0, td.canvas.width, td.canvas.height);
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
		ctx.fillStyle = "#333"
		ctx.font = "24px 'Segoe UI'";
		ctx.fillText(`Lives: ${this.lives}`, 10, 30);
		ctx.fillText(`Coin: ${this.players[0].money}`, canvas.width - 120, 30);
		requestAnimationFrame(this.draw.bind(this));
	}
}

document.addEventListener("DOMContentLoaded", NewGame);

let gamesession;
function NewGame() {
	gamesession = new Game({});
	gamesession.startAnimation();
	gamesession.togglePlay();
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

function getWave(wavenr) {
	let queue = [];

	if (wavenr > 0) {
		let batch = {
			enemies: addN(15, Enemy),
			interval: 1000,
			delay: 10000,
		}
		queue.push(batch);
	}
	if (wavenr > 5) {
		let batch = {
			enemies: addN(15, Enemy, { type: "Goblin" }),
			interval: 1000,
			delay: 10000,
		}
		queue.push(batch);
	}
	if (wavenr > 10) {
	}
	return queue;
}