/**
 * 
 * @class RSEffect
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSEffect extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		this._alterationLookup = {};
	}
	
	recalculatePrefetch() {
		var x;
		
		if(this.alters && this.alters.length) {
			for(x=0; x<this.alters.length; x++) {
				delete(this._alterationLookup[this.alters[x]]);
			}
		}
	}

	recalculateHook() {
		var x;
		
		if(this.alters && this.alters.length) {
			for(x=0; x<this.alters.length; x++) {
				this._alterationLookup[this.alters[x]] = true;
			}
		}
		
		if(this.indicators) {
			this.indicators = this.indicators.split(/[\s,]+/);
		}
	}
}
