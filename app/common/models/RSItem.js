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
	
	recalculatePrefetch() {
		if(this._coreData.no_modifiers || this.no_modifiers) {
			this._replacedReferences.item = [];
		} else {
			this._replacedReferences.item = false;
		}
	}
	
	recalculateHook() {
		var sum = 0,
			buffer,
			x;
		
		if(this.adds_encumberance && this.item && this.item.length) {
			for(x=0; x<this.item.length; x++) {
				buffer = this.universe.indexes.item.lookup[this.item[x]];
				if(buffer) {
					sum += parseInt(buffer.encumberance) || 0;
				}
			}
			
			if(this.scaled_encumberance && this.contents_max) {
				sum = parseInt(Math.ceil(this.scaled_encumberance * (sum / this.contents_max)));
			}
		}
		
		if(this.encumberance) {
			this.encumberance += sum;
		} else {
			this.encumberance = sum;
		}
	}

	/**
	 * 
	 * @method performModifications
	 */
	performModifications(base, origin, debug) {
		if(this.no_modifiers) {
			return false;
		}
		return super.performModifications(base, origin, debug);
	}
}
