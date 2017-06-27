import NewImage from "./NewImage";
import Projectile from "./Projectile";
import Explosive from "./Explosive";
import Vector from "./Vector";

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
	upgrade(index) {

	}
	isInRange(target) {
		return this.pos.center(-this.width, -this.height).distanceTo(target.pos.center(-target.width, -target.height)) <= this.range;
	}
	fire(target) {
		let velocity = Vector.createFromAngle(this.rotation, this.projectile.speed);
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
		image: NewImage("./resources/towers/Cannon.png"),
		width: 64,
		height: 64,
		range: 100,
		speed: 8,
		price: 200,
		rotateImage: true,
		projectile: {
			class: Projectile,
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
		image: NewImage("./resources/towers/Peashooter.png"),
		width: 64,
		height: 64,
		range: 150,
		speed: 24,
		price: 100,
		rotateImage: true,
		projectile: {
			class: Projectile,
			image: false,
			damage: 5,
			speed: 24,
			penetration: 1,
			radius: 5,
			color: "#70b53f",
		},
		upgrades: [],
	},
	Bomber: {
		image: NewImage("./resources/towers/Bomber.png"),
		width: 64,
		height: 64,
		range: 120,
		speed: 3,
		price: 500,
		rotateImage: false,
		projectile: {
			class: Explosive,
			image: NewImage("./resources/other/Bomb.png"),
			blastRadius: 100,
			damage: 50,
			speed: 8,
			penetration: 6,
			radius: 16,
			color: "#292d25",
		},
		upgrades: [],
	}
}

export default Tower;