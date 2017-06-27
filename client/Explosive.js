import Projectile from "./Projectile";

class Explosive extends Projectile {
	constructor({ target, pos, vel, type }) {
		super({ pos, vel, type });
		Object.assign(this, type);
		this.target = target;
	}
	update() {
		if (this.pos.distanceTo(this.target) < this.vel.getHyp()) {
			this.pos = this.target.clone();
			// window.gamesession.detonate(this);
		} else {
			this.pos.moveVector(this.vel);
		}
	}
}

export default Explosive;