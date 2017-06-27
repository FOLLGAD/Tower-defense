import Vector from "./Vector";

const Maps = {
	0: {
		width: 1000,
		height: 600,
		backgroundColor: "#fcbf49",
		// backgroundColor: "#f4d35e",
		// pathColor: "#003049",
		pathColor: "#ebebd3",
		pathWidth: 48,
		path: [
			new Vector(-50, 100),
			new Vector(120, 100),
			new Vector(100, 300),
			new Vector(400, 300),
			new Vector(400, 100),
			new Vector(275, 100),
			new Vector(275, 450),
			new Vector(600, 450),
			new Vector(600, 200),
			new Vector(1050, 200),
		],
		props: [
			{ pos: new Vector(600, 150), type: "Cactus" }, // Display these on the map allso!
			{ pos: new Vector(120, 150), type: "Cactus" },
			{ pos: new Vector(300, 450), type: "Cactus" },
			{ pos: new Vector(750, 320), type: "Cactus" },
		]
	}
}

export default Maps;