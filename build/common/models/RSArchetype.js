/**
 * Archetypes are for concepts that are usually tied to some form of leveling where a linked list is
 * implemented and a pointed to the "next" set of modifiers to incur based on entity properties is
 * used.
 * 
 * @class RSArchetype
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSArchetype extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	
	/**
	 * 
	 * Archetypes have different conditionals that can be applied to them to limit their application.
	 * + condition
	 * + singleton
	 * + limited
	 * @method performModifications
	 * @param {Object} base
	 * @return {Boolean} True if this object applied modifications, false otherwise.
	 */
	/*
	performModifications(base) {
		var index,
			x;
		
		if(this.singleton && this.singleton.length) {
			index = base.archetype.indexOf(this);
			for(x=0; x<this.singleton.length; x++) {
				if(x < index) {
					return false;
				}
			}
		}
		
//		console.log("RSObject Root Modify[" + this.id + "]: ", this, _p(base));
		
		if(this._coreData.modifierstats) {
			for(x=0; x<this._coreData.modifierstats.length; x++) {
				this.universe.nouns.modifierstats[this._coreData.modifierstats[x]].performModifications(base);
			}
		}
		if(this._coreData.modifierattrs) {
			for(x=0; x<this._coreData.modifierattrs.length; x++) {
				this.universe.nouns.modifierattrs[this._coreData.modifierattrs[x]].performModifications(base);
			}
		}
//		console.log("RSObject Root Finished[" + this.id + "]: ", _p(base));

		return true;
	}
	*/
}