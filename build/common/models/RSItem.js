/**
 * 
 * @class RSItem
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSItem extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	

	/**
	 * 
	 * @method performModifications
	 */
	performModifications(base) {
		if(this.no_modifiers) {
			return false;
		} else {
			return super.performModifications(base);
		}
	}
}
