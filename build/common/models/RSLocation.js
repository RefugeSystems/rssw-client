/**
 * Representation for locations
 * @class RSEntity
 * @extends RSLocation
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSLocation extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		if(!this.coordinates) {
			this.coordinates = [];
		}
	}
}
