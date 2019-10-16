/**
 * 
 * @class RSPlayer
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSPlayer extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	
	loadDeltaHook() {
		var keys = Object.keys(this._coreData),
			x;
		
		for(x=0; x<keys.length; x++) {
			if(typeof(this[keys[x]]) !== "function") {
				this[keys[x]] = this._coreData[keys[x]];
			}
		}
	}
	
	recalculateSheet() {}
}
