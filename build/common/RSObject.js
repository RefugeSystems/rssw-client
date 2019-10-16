/**
 * 
 * @class RSObject
 * @extends EventEmitter
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSObject extends EventEmitter {
	constructor(details, universe) {
		super();
		this.universe = universe;
		this._coreData = {};
		var keys = Object.keys(details),
			x;
		
		for(x=0; x<keys.length; x++) {
			this._coreData[keys[x]] = details[keys[x]];
		}
		this.name = details.name;
		this.id = details.id;
		
		if(this.universe) {
			this.universe.$on("model:modified", (event) => {
				if(event && event.id === this.id) {
					console.log("Object Processing Modification: ", this, event);
					this.loadDelta(event.modification);
				}
			});
		}
	}
	
	commit(change) {
		change._type = this._type;
		change.id = this.id;
		this.universe.send("modify:" + this._type, change);
	}
	
	toJSON() {
		var keys = Object.keys(this._coreData),
			json = {},
			value,
			x;
		
		for(x=0; x<keys.length; x++) {
			// Fields matching ^[_\$\#] are for data handling and should not be considered in stringification and other conversions
			// Universe field is reserved property and shouldn't come out either
			if(keys[x] && keys[x] !== "universe" && keys[x][0] !== "_" && keys[x][0] !== "$" && keys[x][0] !== "#") {
				value = this._coreData[keys[x]];
				switch(typeof(value)) {
					case "number":
					case "string":
					case "boolean":
					case "boolean":
						json[keys[x]] = value;
						break;
					case "object":
						// RSObjects should be flat but arrays are valid
						if(value instanceof Array) {
							json[keys[x]] = value;
						}
						break;
					case "function":
						// Ignored
				}
			}
		}
		
		return json;
	}
	
	recalculateProperties() {
		// Establish Base
		var references = [],
			base = {},
			keys,
			load,
			x;
		
		keys = Object.keys(this._coreData);
		for(x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_") {
				switch(typeof(this._coreData[keys[x]])) {
					case "boolean":
					case "string":
					case "number":
						base[keys[x]] = this._coreData[keys[x]];
						break;
					case "object":
						// RSObjects should be flat but arrays are valid
						if(this._coreData[keys[x]] instanceof Array) {
							base[keys[x]] = this._coreData[keys[x]];
						}
						break;
				}

				// Isolate Reference Fields
				if(this.universe.nouns[keys[x]]) {
					references.push(keys[x]);
				}
			}
		}
		
//		console.log("References: ", references, _p(base));
		if(references && references.length) {
			for(x=0; x<references.length; x++) {
				this.loadNounReferenceModifications(references[x], base);
			}
		}
		
		//console.log("Final: ", base);
		keys = Object.keys(base);
		for(x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_" && typeof(this[keys[x]]) !== "function" ) {
				this[keys[x]] = base[keys[x]];
			}
		}
		
		this.$emit("modified", this);
	}
	
	loadNounReferenceModifications(noun, base) {
		var reference = this[noun],
			x;
		
//		console.log("Load Noun[" + noun + "]: ", reference);
		if(reference instanceof Array) {
			for(x=0; x<reference.length; x++) {
				if(this.universe.nouns[noun][reference[x]] && this.universe.nouns[noun][reference[x]].performModifications) {
					this.universe.nouns[noun][reference[x]].performModifications(base);
				}
			}
		} else {
			if(this.universe.nouns[noun][reference] && this.universe.nouns[noun][reference].performModifications) {
				this.universe.nouns[noun][reference].performModifications(base);
			}
		}
	}
	
	performModifications(base) {
//		console.log("RSObject Root Modify[" + this.id + "]: ", this, _p(base));
		var x;
		
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
	}
	
	loadDelta(delta) {
		var keys = Object.keys(delta),
			x;
		
		for(x=0; x<keys.length; x++) {
			if(typeof(this[keys[x]]) !== "function") {
				this._coreData[keys[x]] = delta[keys[x]];
			}
		}
		
		if(this.loadDeltaHook) {
			this.loadDeltaHook(delta);
		}
		
		this.recalculateProperties();
	}
}
