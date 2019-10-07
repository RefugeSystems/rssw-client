/**
 * Modifiers represent changes to the properties of an entity and are computed and the summed result
 * is placed in a RSSheet for the corresponding entity.
 * 
 * Stats Modifiers are for values that need some form of computation. In this case, a String value is considered
 * a mathematical additive and then passed to the Calculator to determine the result, which is used as a number.
 * 
 * Numbers are simply summed and boolean values are treated as or conditions.
 * 
 * @class RSModifierStats
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSModifierStats extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
}
