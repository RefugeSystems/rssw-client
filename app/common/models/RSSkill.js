/**
 * 
 * @class RSSkill
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSSkill extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		
		if(this.id) {
			this.property = this.id.replace("skill:", "");
		}
		this.propertyKey = "skill_" + this.property;
		this.enhancementKey = "skill_enhanced_" + this.property;
		this.bonusKey = "skill_bonuses_" + this.property;
	}
	
	recalculateHook() {
		if(this.base) {
			this._search += this.base.toLowerCase();
		}
		
		if(this.id) {
			this.property = this.id.replace("skill:", "");
		}
		this.propertyKey = "skill_" + this.property;
		this.enhancementKey = "skill_enhanced_" + this.property;
		this.bonusKey = "skill_bonuses_" + this.property;
	}
}