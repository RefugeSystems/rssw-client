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
		if(details.showing) {
			this.showing = details.showing;
		}
	}
	
	loadDeltaHook(details) {
		if(details.showing) {
			this.showing = details.showing;
		}
	}
	
	recalculateHook() {
		var scanning = [this.id],
			searchString = "",
			target,
			next,
			x,
			y;
		
		if(this.location) { // Exclude Top Level Location
			for(y=0; y<scanning.length; y++) {
				target = scanning[y];
				for(x=0; x<this.universe.indexes.location.listing.length; x++) {
					next = this.universe.indexes.location.listing[x];
					if(next && next.location === target) {
						scanning.push(next.id);
						searchString += next._search;
					}
				}
			}
			this._search += " ||| " + searchString;
		}
	}
}
