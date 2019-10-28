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
		this.propertyKey = "skill_" + this.id;
		this.enhancementKey = "skill_enhanced_" + this.id;
		this.bonusKey = "skill_bonuses_" + this.id;
	}
}