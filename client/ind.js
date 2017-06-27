import Game from "./Game";

function NewGame() {
	window.gamesession = new Game({});
	window.gamesession.startAnimation();
	window.gamesession.togglePlay();
}

document.addEventListener("DOMContentLoaded", NewGame);