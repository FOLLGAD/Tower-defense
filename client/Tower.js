import NewImage from "./NewImage";
import Projectile from "./Projectile";
import Explosive from "./Explosive";
import LightningBolt from "./LightningBolt";
import Vector from "./Vector";

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
		let velocity = Vector.createFromAngle(this.rotation, this.projectile.speed);
		window.gamesession.projectiles.push(new this.projectile.class({
			pos: this.pos.center(-this.width, -this.height),
			vel: velocity,
			stats: this.projectile,
			target: target.pos.center(-target.width, -target.height)
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

export class Cannon extends Tower {
	constructor({ vector }) {
		super({ vector });

		this.image = NewImage("./resources/towers/Cannon.png");
		this.width = 64;
		this.height = 64;
		this.range = 150;
		this.speed = 8;
		this.projectile = {
			class: Projectile,
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
				price: 175,
				range: 125,
			}, {
				price: 125,
				range: 200,
			}],
			penetration: [{
				price: 75,
				projectile: {
					penetration: 6
				}
			}, {
				price: 100,
				projectile: {
					penetration: 8
				}
			}]
		}
		Object.keys(this.upgrades).forEach(e => this.levels[e] = 0);
	}
}

export class Peashooter extends Tower {
	constructor({ vector }) {
		super({ vector });

		this.image = NewImage("./resources/towers/Peashooter.png");
		this.width = 64;
		this.height = 64;
		this.range = 150;
		this.speed = 24;
		this.projectile = {
			class: Projectile,
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

export class Bomber extends Tower {
	constructor({ vector }) {
		super({ vector });

		this.image = NewImage("./resources/towers/Bomber.png");
		this.width = 64;
		this.height = 64;
		this.range = 120;
		this.speed = 3;
		this.projectile = {
			image: NewImage("./resources/other/Bomb.png"),
			blastRadius: 100,
			damage: 25,
			speed: 8,
			penetration: null,
			radius: 16,
			color: "#70b53f"
		};
		this.upgrades = {
			damage: [{
				price: 50,
				projectile: {
					damage: 60,
				}
			}],
		}
		Object.keys(this.upgrades).forEach(e => this.levels[e] = 0);
	}
	draw(ctx) {
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
	}
	fire(target) {
		let velocity = Vector.createFromAngle(this.rotation, this.projectile.speed);
		window.gamesession.projectiles.push(new Explosive({
			pos: this.pos.center(-this.width, -this.height),
			vel: velocity,
			stats: this.projectile,
			target: target.pos.center(-target.width, -target.height),
		}));
		this.cooldown += 5000 / this.speed;
	}
}

export class TeslaCoil extends Tower {
	constructor({ vector }) {
		super({ vector });

		this.image = NewImage("./resources/towers/TeslaCoil.png");
		this.width = 64;
		this.height = 64;
		this.range = 120;
		this.speed = 3;
		this.projectile = {
			class: LightningBolt,
			damage: 3,
			duration: 20,
			speed: 100,
			penetration: 1,
			radius: 16,
			range: 100,
			color: "#7DF9FF",
		};
		this.upgrades = {
			damage: [{
				price: 300,
				projectile: {
					damage: 5
				}
			}, {
				price: 300,
				projectile: {
					damage: 7
				}
			}],
			penetration: [{
				price: 200,
				projectile: {
					penetration: 2
				}
			}, {
				price: 200,
				projectile: {
					penetration: 3
				}
			}]
		}
		Object.keys(this.upgrades).forEach(e => this.levels[e] = 0);
	}
	draw(ctx) {
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
	}
	fire(target) {
		window.gamesession.projectiles.push(new LightningBolt({
			target,
			stats: this.projectile,
			pos: this.pos.center(-this.width, -this.height)
		}));
		this.cooldown += 5000 / this.speed;
	}
}

export let Towers = {
	Cannon: {
		image: NewImage("./resources/towers/Cannon.png"),
		price: 200,
		width: 64,
		height: 64,
		range: 150,
		type: Cannon
	},
	Peashooter: {
		image: NewImage("./resources/towers/Peashooter.png"),
		price: 100,
		width: 64,
		height: 64,
		range: 150,
		type: Peashooter
	},
	Bomber: {
		image: NewImage("./resources/towers/Bomber.png"),
		price: 500,
		width: 64,
		height: 64,
		range: 120,
		type: Bomber
	},
	TeslaCoil: {
		image: NewImage("./resources/towers/TeslaCoil.png"),
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