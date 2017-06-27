import Game from "./Game";
import Enemy from "./Enemy";

function NewGame() {
	window.gamesession = new Game({});
	window.gamesession.startAnimation();
	window.gamesession.togglePlay();
}

document.addEventListener("DOMContentLoaded", function () {
	document.getElementsByClassName("spawn-enemies")[0].addEventListener("click", function (e) {
		if (e.target.classList.contains("spawn-enemy")) {
			window.gamesession.enemies.push(new Enemy({ type: e.target.value }))
		}
	})
});

document.addEventListener("DOMContentLoaded", NewGame);