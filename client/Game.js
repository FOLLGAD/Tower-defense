import Vector from "./Vector";
import { Towers } from "./Tower";
import Player from "./Player";
import World from "./World";
import { GetWave } from "./Waves";
import { Damage, Explosion } from "./Animation";
import NewImage from "./NewImage";

let UI = {
	fastForward: NewImage("./resources/ui/fast-forward.png"),
	play: NewImage("./resources/ui/play.png"),
	pause: NewImage("./resources/ui/pause.png")
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
		this.mousepos = new Vector(null, null);
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
			Object.keys(Towers).forEach(towername => {
				let tower = Towers[towername];

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
					if (__game.selectedTower == Towers[towername]) {
						__game.deselectBuyTower();
					} else {
						__game.selectedTower = Towers[towername];
					}
				})
			});
		})();

		this.enemies = [];
		this.animations = [];
		this.players = [new Player({})];
		this.projectiles = [];
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
				let { width, height } = this.selectedTower;
				let vector = new Vector(e.clientX - width / 2, e.clientY - height / 2),
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

					this.animations.push(new Damage({ pos: enemy.pos.center(-enemy.width, -enemy.height) }));

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
		this.animations.push(new Explosion({ pos: explosive.pos.clone(), radius: explosive.blastRadius }))
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
		this.wave.queue = GetWave(nr);
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
		let radius = tower.width / 2 * (2 / 3);
		let player = this.players[0];
		if (player.towers.some(tow => {
			return tow.pos.distanceTo(vector) < radius + tow.width / 2 * (2 / 3);
		})) {
			return false;
		} else {
			for (let i = 0; i < this.world.path.length - 1; i++) {
				let p = this.world.path[i];
				let np = this.world.path[i + 1];
				let lw = this.world.pathWidth / 2;
				let radius = tower.width / 2;
				let center = vector.center(-tower.width, -tower.height);
				if (i == 1);
				let bool = checkLineCircleCollision(p, np, center, radius + lw * (2 / 3), i == 1);
				if (bool) return false;
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
			let canPlace = this.canPlaceTower(new Vector(this.mousepos.x, this.mousepos.y).center(tw.width, tw.height), this.selectedTower);

			this.drawTowerRange(new Vector(this.mousepos.x, this.mousepos.y), tw.range, !canPlace);
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

export default Game;

function checkLineCircleCollision(point1, point2, circle, radius) {
	let ABE = Math.atan2(point2.y - point1.y, point2.x - point1.x)
	let DBE = Math.atan2(circle.y - point1.y, circle.x - point1.x)
	let CBD = ABE - DBE
	let BD = Math.sin(CBD) * Math.hypot(circle.y - point1.y, circle.x - point1.x)


	if (radius > Math.abs(BD)) {
		let minX, minY, width, height;

		if (point1.x < point2.x) {
			minX = point1.x;
			width = point2.x - minX;
		} else {
			minX = point2.x;
			width = point1.x - minX;
		}
		if (point1.y < point2.y) {
			minY = point1.y;
			height = point2.y - minY;
		} else {
			minY = point2.y;
			height = point1.y - minY;
		}

		if (isCircleRectColliding({ pos: { x: circle.x, y: circle.y }, radius: radius }, { pos: { x: minX, y: minY }, width: width, height: height })) {
			return true;
		}
	}
	return false;
}