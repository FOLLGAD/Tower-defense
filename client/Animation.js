import NewImage from "./NewImage";

let Images = {
	Explosion: NewImage("")
}

class Animation {
	constructor({ duration }) {
		this.startTime = Date.now();
		this.duration = duration;

	}
}

export default Animation;