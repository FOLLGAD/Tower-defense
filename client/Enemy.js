import NewImage from "./NewImage";

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
		image: NewImage("./resources/enemies/base.png"),
		drop: 10,
		walkingSpeed: 2,
		width: 48,
		height: 48,
		health: 100,
		damage: 1,
		armor: 2,
	},
	Goblin: {
		image: NewImage("./resources/enemies/base.png"),
		drop: 5,
		walkingSpeed: 4,
		width: 32,
		height: 32,
		health: 50,
		damage: 1,
		armor: 1,
	}
}


export default Enemy;