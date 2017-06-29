import NewImage from "./NewImage";
import Projectile from "./Projectile";

class Explosive extends Projectile {
	constructor(args) {
		super(args);
		let { target } = args;
		this.checkCollision = false;
		this.target = target;

		this.image = NewImage("./resources/other/Bomb.png");
		this.blastRadius = 100;
		this.damage = 50;
		this.speed = 8;
		this.penetration = null;
		this.radius = 16;
		this.color = "#70b53f";
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