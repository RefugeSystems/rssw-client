/**
 * Representation for datasets for things like sourcing language data into name generation.
 * @class RSDataset
 * @extends RSLocation
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSDataset extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	
	recalculateHook() {
		// console.warn("Dataset Updated: ", this.id);
		
		if(this.default_set) {
			this.universe.defaultDataset = this;
		}
	}
}
