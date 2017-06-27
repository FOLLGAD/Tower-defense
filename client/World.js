import Maps from "./Maps";

class World {
	constructor({ mapnr = 0 }) {
		Object.assign(this, Maps[mapnr]);
	}
	isOutOfBounds(vector) {
		return vector.x < 0 || vector.x > this.width || vector.y < 0 || vector.y > this.height;
	}
	draw(ctx) {
		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.lineJoin = "round"
		ctx.beginPath();
		ctx.strokeStyle = this.pathColor;
		ctx.lineWidth = this.pathWidth;
		this.path.forEach((vector, index) => {
			if (index === 0) return ctx.moveTo(vector.x, vector.y);
			ctx.lineTo(vector.x, vector.y);
		})
		ctx.stroke();
	}
}

export default World;