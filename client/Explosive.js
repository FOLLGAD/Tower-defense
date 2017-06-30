import Projectile from "./Projectile";

class Explosive extends Projectile {
	constructor(args) {
		super(args);
		let { target } = args;
		this.checkCollision = false;
		this.target = target;
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