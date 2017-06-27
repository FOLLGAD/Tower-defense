import Projectile from "./Projectile";

class Explosive extends Projectile {
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

export default Explosive;