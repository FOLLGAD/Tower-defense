class Projectile {
	constructor({ pos, vel, stats }) {
		this.pos = pos;
		this.vel = vel;
		this.checkCollision = true;
		this.hitlist = [];

		Object.assign(this, stats);
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

export default Projectile;