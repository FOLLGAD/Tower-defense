import Enemy from "./Enemy";

/*	Queue Object:
 *		enemies: []Enemy
 *			which enemies to spawn
 *		interval: Number
 *			ms to wait between each enemy. defaults to 250ms
 *		delay: Number
 *			ms to wait until next batch. defaults to 1000ms
 */

export function GetWave(wavenr) {
	let queue = [];

	if (wavenr >= 0) {
		let batch = {
			enemies: addN(10 * wavenr, Enemy),
			interval: 1000,
			delay: 10000,
		}
		queue.push(batch);
	}
	if (wavenr >= 5) {
		queue.push({
			enemies: addN(15, Enemy, { type: "Goblin" }).concat(addN(15, Enemy, { type: "Ogre" })),
			interval: 500,
			delay: 2500,
		})
		queue.push({
			enemies: addN(15, Enemy, { type: "Goblin" }).concat(addN(15, Enemy, { type: "Ogre" })),
			interval: 500,
			delay: 2500,
		});
	}
	if (wavenr > 10) {
	}
	return queue;
}

function addN(iterations, classFunction) {
	let restArgs = Array.prototype.slice.call(arguments, 3);
	if (restArgs.length == 0) restArgs = [{}];
	let array = [];
	for (let i = 0; i < iterations; i++) {
		array.push(new classFunction(...restArgs));
	}
	return array;
}