/**
 * 
 * @class RSInventory
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSInventory extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}

	/**
	 * Inventories perform modifications differently, requiring specific conditions for anything contained to actually modify
	 * the base.
	 * @method performModifications
	 * @return {Boolean} Whether the modification was performed or not.
	 */
	performModifications(base) {
		var buffer,
			x;
		
		// TODO: Implement inventory conditional
		
		return true;
	}
}
