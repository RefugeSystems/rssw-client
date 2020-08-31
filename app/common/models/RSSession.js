/**
 * 
 * Used to track Game Sessions.
 * @class RSSession
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSSession extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		this._alterationLookup = {};
	}
	
	get name() {
		return "Session " + this._coreData.name;
	}
}
