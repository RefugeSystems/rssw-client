/**
 * 
 * 
 * @class RSCondition
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSCondition extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	
	/**
	 * 
	 * @method evaluate
	 * @param {Object} base The object on which the condition should be considered
	 * @param {String} [target] Optional ID 
	 * @return {Boolean} If the condition passes or not. 
	 */
	evaluate(base, target) {
		var count = 0,
			index,
			limit,
			load,
			x;
	
//		console.log("Checking Condition[" + target + "]: " + this.id, base[this.type], this);
		if(this.singleton && this.singleton.length) {
			index = base[this.type].indexOf(target);
			limit = this.limited || 1;

			for(x=0; x<this.singleton.length; x++) {
				load = base[this.type].indexOf(this.singleton[x]);
//				console.log(" > Singleton Check[" + index + " | " + load + "]: " + this.singleton[x]);
				if(load !== -1 && load < index) {
//					console.log(" > Count");
					count++;
					if(count >= limit) {
//						console.log(" < Failed");
						return false;
					}
				}
			}
		}

//		console.log(" < Passed");
		return true;
	}
}
