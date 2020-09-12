/**
 * 
 * @class RSSlot
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSSlot extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	
	acceptsRecord(record) {
		if((!this.itemtype || !this.itemtype.length) && (!this.type || !this.type.length)) {
			return true;
		}
		
		if(this.itemtype && this.itemtype.hasCommon(record.itemtype)) {
			return true;
		}
		
		if(this.type && this.itemtype.hasCommon(record.type)) {
			return true;
		}
		
		return false;
	}
}