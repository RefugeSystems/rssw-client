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
		
		if(details.default_set) {
			universe.defaultDataset = this;
		}
	}
}
