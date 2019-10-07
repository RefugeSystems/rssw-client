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
		this.universe = universe;
		var keys = Object.keys(details),
			x;
			
		for(x=0; x<keys.length; x++) {
			if(!this[keys[x]]) {
				this[keys[x]] = details[keys[x]];
			}
		}
		
		if(this.universe) {
			this.universe.$on("model:modified", (event) => {
				if(event.id === this.id) {
					console.log("Object Processing Modification: ", this, event);
					this.loadDelta(event);
				}
			});
		}
	}
	
	toJSON() {
		var keys = Object.keys(this),
			json = {},
			value,
			x;
		
		for(x=0; x<keys.length; x++) {
			// Fields matching ^[_\$\#] are for data handling and should not be considered in stringification and other conversions
			// Universe field is reserved property and shouldn't come out either
			if(keys[x] && keys[x] !== "universe" && keys[x][0] !== "_" && keys[x][0] !== "$" && keys[x][0] !== "#") {
				value = this[keys[x]];
				switch(typeof(value)) {
					case "number":
					case "string":
					case "boolean":
					case "boolean":
						json[keys[x]] = value;
						break;
					case "object":
						// RSObjects should be flat but arrays are valid
						if(value instanceof Array) {
							json[keys[x]] = value;
						}
						break;
					case "function":
						// Ignored
				}
			}
		}
		
		return json;
	}
	
	loadDelta(delta) {
		var keys = Object.keys(delta),
			x;
		
		for(x=0; x<keys.length; x++) {
			if(this[keys[x]] && typeof(this[keys[x]]) !== "function") {
				this[keys[x]] = delta[keys[x]];
			}
		}
	}
}
