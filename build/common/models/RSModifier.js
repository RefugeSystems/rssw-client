/**
 * Modifiers represent changes to the properties of an Object.
 * 
 * @class RSModifier
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSModifier extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	
	/**
	 * 
	 * @method _evaluateConditions
	 * @param {Object} base
	 * @return {Boolean}
	 */
	_evaluateConditions(base) {
		var result = true;
		
		return result;
	}
	
	/**
	 * 
	 * @method _evaluateConditions
	 * @param {Object} base
	 * @param {Object} condition
	 * @param {Boolean} cuurent
	 * @return {Boolean}
	 */
	_evaluateCondition(base, condition, current) {
		
	}
}
