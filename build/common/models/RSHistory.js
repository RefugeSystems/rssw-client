/**
 * 
 * @class RSHistory
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSHistory extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
}

RSHistory.ignore = true;
