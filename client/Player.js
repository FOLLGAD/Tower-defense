import Tower from "./Tower";

class Player {
	constructor({ name = "Player" }) {
		this.name = name;
		this.towers = [];
		this.money = 300;
	}
	buyTower({ vector, tower = Tower.Types.Cannon }) {
		let towercost = tower.price;
		if (this.money - towercost >= 0) {
			this.money = this.money - towercost;
			this.towers.push(new Tower({ vector, tower }));
			return true;
		}
		return false;
	}
	update() {
		this.towers.forEach(tower => {
			tower.update(window.gamesession.enemies);
		});
	}
	draw(ctx) {
		this.towers.forEach(tower => {
			tower.draw(ctx);
		});
	}
}

export default Player;