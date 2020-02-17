/**
 * Modifiers represent changes to the properties of an object.
 * 
 * Stats Modifiers are for values that need some form of computation. In this
 * case, a String value is considered a mathematical additive and then passed
 * to the Calculator to determine the result, which is used as a number.
 * 
 * Numbers are simply summed and boolean values are treated as or conditions.
 * 
 * @class RSModifierStats
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object received
 * 		from the Universe.
 * @param {Object} universe
 */
class RSModifierStats extends RSModifier {
	constructor(details, universe) {
		super(details, universe);
	}
	
	performModifications(base, origin, debug) {
		var keys = Object.keys(this._coreData),
			x,
			y;
		
		if(debug) {
			console.warn("Perform Mod[" + origin + "]: " + this.id);
		}
		
		for(x=0; x<keys.length; x++) {
			if(debug) {
				console.warn("Check Key Mod[" + this.id + "]: " + keys[x] + " oftype " + typeof(this[keys[x]]), _p(base[keys[x]]), _p(this._coreData[keys[x]]));
			}
			if(!RSModifierStats._skip[keys[x]] && keys[x] && keys[x][0] !== "_" && keys[x] !== "history" && keys[x] !== "created" && keys[x] !== "updated") {
				if(origin === "undefined") {
					console.warn("???: ", this, base);
				}
				if(base._contributions) {
					if(!base._contributions[keys[x]]) {
						base._contributions[keys[x]] = {};
					}
					base._contributions[keys[x]][origin] = true;
				}
				if(base[keys[x]]) {
					switch(typeof(this[keys[x]])) {
						case "string":
							base[keys[x]] = this._coreData[keys[x]] + " + " + base[keys[x]];
							if(base._calculated) {
								base._calculated.push(keys[x]);
							}
							break;
						case "boolean":
							base[keys[x]] = this._coreData[keys[x]] || base[keys[x]];
							break;
						case "number":
							if(typeof(base[keys[x]]) === "number") {
								base[keys[x]] = base[keys[x]] + this._coreData[keys[x]];
							} else {
								base[keys[x]] = base[keys[x]].toString() + " + " + this._coreData[keys[x]];
								if(base._calculated) {
									base._calculated.push(keys[x]);
								}
							}
							break;
						case "object":
							if(this._coreData[keys[x]] !== null) {
								if(base[keys[x]] instanceof Array) {
									for(y=0; y<this._coreData[keys[x]].length; y++) {
										base[keys[x]].push(this._coreData[keys[x]][y]);
									}
								} else {
									Object.assign(base[keys[x]], this._coreData[keys[x]]);
								}
							}
					}
				} else {
					if(typeof(this._coreData[keys[x]]) === "object") {
						if(this._coreData[keys[x]] instanceof Array) {
							base[keys[x]] = [];
							base[keys[x]].push.apply(base[keys[x]], this._coreData[keys[x]]);
						} else {
							base[keys[x]] = Object.assign({}, this._coreData[keys[x]]);
						}
					} else {
						base[keys[x]] = this._coreData[keys[x]];
					}
					if(base._calculated) {
						base._calculated.push(keys[x]);
					}
				}
			}
			if(debug) {
				console.log(" > Result of Key Mod[" + this.id + "]: " + keys[x], _p(base[keys[x]]));
			}
		}
	}
}

RSModifierStats._skip = {
	"description": true,
	"master_note": true,
	"name": true,
	"id": true
};
