/**
 * 
 * @class RSEvent
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSEvent extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		this._alterationLookup = {};
	}
}
