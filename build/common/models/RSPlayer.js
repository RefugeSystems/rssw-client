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
		
	}
	
	recalculateSheet() {}
}
