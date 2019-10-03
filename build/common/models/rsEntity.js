/**
 * Handles what would commonly be considered Players or other such beings, structures, or vehicles.
 * @class RSEntity
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSEntity extends RSObject {
	constructor(details, universe) {
		super(details, universe);

		/**
		 * List of the keys available for this Entity in the "equiped" map.
		 * @property slots
		 * @type Array
		 */
		if(!this.slots) {
			this.slots = [];
		}

		/**
		 * Maps an ID identifying a slot to an ID of some item that is in that "slot".
		 * @property equipped
		 * @type Object
		 */
		if(!this.equipped) {
			this.equipped = {};
		}
		
	}
}
