/**
 * 
 * @class RSManeuver
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSManeuver extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	
	recalculateSheet() {}
}