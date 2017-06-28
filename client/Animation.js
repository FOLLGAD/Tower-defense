import Vector from "./Vector";
import Color from "color";

// let Images = {
// 	Explosion: NewImage("")
// }

/**
 * Animation class for animations
 */
export class Animation {
	constructor({ duration, pos }) {
		this.startTime = Date.now();
		this.duration = duration;
		this.pos = pos;
	}
	update() {
		this.frameCount++;
		if (this.frameCount > this.duration) {
			let anims = window.gamesession.animations;
			anims.splice(anims.indexOf(this), 1);
			return;
		}
		this.particles.forEach(particle => {
			particle.update();
		})
	}
	draw(ctx) {
		this.particles.forEach(particle => {
			particle.draw(ctx, 1 - this.frameCount / this.duration);
		})
	}
}

/**
 * Particle class
 * @param {number} width
 * @param {Vector} vel
 * @param {Vector} pos
 */

class Particle {
	constructor({ width = 8, height = 8, color, vel, pos }) {
		this.width = width;
		this.height = height;
		this.color = color;
		this.vel = vel;
		this.pos = pos;
	}
	draw(ctx, opacity) {
		ctx.fillStyle = Color(this.color).alpha(opacity);
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	}
	update() {
		this.pos.add(this.vel);
	}
}

export class Damage extends Animation {
	constructor({ pos, duration = 20 }) {
		super({ pos, duration });
		this.particles = [];
		this.frameCount = 0;

		let particleNum = ((Math.random() * 5) | 0) + 5;
		for (let i = 0; i < particleNum; i++) {
			this.particles.push(new Particle({ color: "#d62f2f", pos: this.pos.clone(), vel: Vector.createFromAngle(Math.random() * Math.PI * 2, Math.random() + 1) }));
		}
	}
}

export class Explosion extends Animation {
	constructor({ pos, radius }) {
		super({ pos });
		this.vel = 8;
		this.radius = radius;
		this.currentRadius = 0;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.currentRadius, 0, Math.PI * 2);
		ctx.strokeStyle = Color.rgb(120, 120, 120).alpha(1 - this.currentRadius / this.radius);
		ctx.lineWidth = 25;
		ctx.stroke();
		ctx.closePath();
	}
	update() {
		this.currentRadius += this.vel;
		if (this.currentRadius > this.radius) {
			let anims = window.gamesession.animations;
			anims.splice(anims.indexOf(this), 1);
		}
	}
}