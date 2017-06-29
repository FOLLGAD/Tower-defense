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

export default Projectile;