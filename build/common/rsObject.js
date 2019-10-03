/**
 * 
 * @class RSObject
 * @extends EventEmitter
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSObject extends EventEmitter {
	constructor(details, universe) {
		super();
		var keys = Object.keys(details),
			x;
			
		for(x=0; x<keys.length; x++) {
			if(!this[keys[x]]) {
				this[keys[x]] = details[keys[x]];
			}
		}
		
		if(this.universe) {
			this.universe.$on("model:modified", (event) => {
				console.log("Object Processing Modification: ", this);
				if(event.id === this.id) {
					this.loadDelta(event.data);
				}
			});
		}
	}
	
	loadDelta(delta) {
		console.log("Object Processing Delta: ", this, delta);
		var keys = Object.keys(delta),
			x;
		
		for(x=0; x<keys.length; x++) {
			if(this[keys[x]] && typeof(this[keys[x]]) !== "function") {
				this[keys[x]] = delta[keys[x]];
			}
		}
	}
}
