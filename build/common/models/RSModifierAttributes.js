/**
 * Modifiers represent changes to the properties of an entity and are computed and the summed result
 * is placed in a RSSheet for the corresponding entity.
 * 
 * Attribute Modifiers are for flat information that doesn't have a computation involved, such as adding descriptions
 * or setting age.
 * 
 * Properties in this section are considered to simple "set" or, in rare cases, "addend to" their corresponding
 * values on the entity.
 * 
 * @class RSModifierAttributes
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSModifierAttributes extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
	
	performModifications(base) {
		var keys = Object.keys(this._coreData),
			x;

		for(x=0; x<keys.length; x++) {
			if(!RSModifierAttributes._skip[keys[x]]) {
				if(base[keys[x]]) {
					switch(typeof(this._coreData[keys[x]])) {
						case "boolean":
						case "string":
						case "number":
							if(RSModifierAttributes._appendedProperties[keys[x]]) {
								base[keys[x]] = base[keys[x]] + this._coreData[keys[x]];
							} else {
								base[keys[x]] = this._coreData[keys[x]];
							}
							break;
					}
				} else {
					base[keys[x]] = this._coreData[keys[x]];
				}
			}
		}
	}
}

/**
 * Flags if a property key should be appended instead of set.
 * @property _appendedProperties
 * @type {Object}
 * @private (Considered, not literal)
 * @static
 */
RSModifierAttributes._appendedProperties = {
	"description": true,
	"note": true
};

/**
 * 
 * @method _setAppend
 * @static
 * @param {String} key The key value for which to set the appending process
 * @param {Boolean} [state] The state to set for the key. Defaults to true.
 */
RSModifierAttributes._setAppend = function(key, state) {
	if(state === undefined) {
		state = true;
	}
	RSModifierAttributes._appendedProperties[key] = !!state;
};

RSModifierAttributes._skip = {
	"name": true,
	"id": true
};
