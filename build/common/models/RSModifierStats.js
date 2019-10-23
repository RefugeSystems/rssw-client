/**
 * Modifiers represent changes to the properties of an object.
 * 
 * Stats Modifiers are for values that need some form of computation. In this case, a String value is considered
 * a mathematical additive and then passed to the Calculator to determine the result, which is used as a number.
 * 
 * Numbers are simply summed and boolean values are treated as or conditions.
 * 
 * @class RSModifierStats
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSModifierStats extends RSModifier {
	constructor(details, universe) {
		super(details, universe);
	}
	
	performModifications(base) {
		var keys = Object.keys(this._coreData),
			x;

		for(x=0; x<keys.length; x++) {
//			console.warn("Check[" + this.id + ":" + keys[x] + "]: " + base[keys[x]] + " | " + this[keys[x]]);
			if(!RSModifierStats._skip[keys[x]]) {
				if(base[keys[x]]) {
					switch(typeof(this[keys[x]])) {
						case "string":
							base[keys[x]] = this._coreData[keys[x]] + " + " + base[keys[x]];
							break;
						case "boolean":
							base[keys[x]] = this._coreData[keys[x]] || base[keys[x]];
							break;
						case "number":
							if(typeof(base[keys[x]]) === "number") {
								base[keys[x]] = base[keys[x]] + this._coreData[keys[x]];
							} else {
								base[keys[x]] = base[keys[x]].toString() + " + " + this._coreData[keys[x]];
							}
							break;
					}
				} else {
//					console.warn("Check[" + this.id + "]: Straight Add");
					base[keys[x]] = this._coreData[keys[x]];
				}
			}
		}
	}
}

RSModifierStats._skip = {
	"name": true,
	"id": true
};
