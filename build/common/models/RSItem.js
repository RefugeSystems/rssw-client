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
	
	recalculateHook() {
		var buffer,
			x;
		
		if(this.adds_encumberance && this.item && this.item.length) {
			for(x=0; x<this.item.length; x++) {
				buffer = this.universe.indexes.item.lookup[this.item[x]];
				if(buffer) {
					this.encumberance += parseInt(buffer.encumberance) || 0;
				}
			}
		}
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
