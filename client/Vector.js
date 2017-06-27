class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	moveAngle(angle, speed) {
		const [velx, vely] = Vector.getComponents(angle, speed);
		this.x += velx;
		this.y += vely;
		return this;
	}
	moveVector(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}
	moveTowards(vector, distance) {
		return this.moveAngle(this.getAngleTo(vector), distance);
	}
	distanceTo(vector) {
		return Math.hypot(vector.x - this.x, vector.y - this.y);
	}
	getAngleTo(vector) {
		return Math.atan2(vector.y - this.y, vector.x - this.x);
	}
	multiply(scala) {
		return new Vector(this.x * scala, this.y * scala);
	}
	clone() {
		return new Vector(this.x, this.y);
	}
	center(width, height) {
		return new Vector(this.x - width / 2, this.y - height / 2);
	}
	getHyp() {
		return Math.hypot(this.x, this.y);
	}
	static getComponents(angle, speed = 1) {
		return [speed * Math.cos(angle), speed * Math.sin(angle)];
	}
	static createFromAngle(angle, speed = 1) {
		return new Vector(speed * Math.cos(angle), speed * Math.sin(angle))
	}
}

export default Vector;