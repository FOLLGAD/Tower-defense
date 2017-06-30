import Projectile from "./Projectile";

class LightningBolt extends Projectile {
	constructor(args) {
		super(args);
		let { target } = args;
		this.checkCollision = false;
		this.color = "#7DF9FF";

		this.duration = 10;
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
		if (this.frameCount < this.duration) {
			this.targets.forEach(e => {
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

export default LightningBolt;