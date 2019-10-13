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
		this._sheet = {};
		var keys = Object.keys(details),
			x;
			
		for(x=0; x<keys.length; x++) {
			if(!this[keys[x]]) {
				this[keys[x]] = details[keys[x]];
			}
		}
		
		if(this.universe) {
			this.universe.$on("model:modified", (event) => {
				if(event && event.id === this.id) {
					console.log("Object Processing Modification: ", this, event);
					this.loadDelta(event.modification);
				}
			});
		}
	}
	
	get sheet() {
		return this._sheet;
	}
	
	toJSON() {
		var keys = Object.keys(this),
			json = {},
			value,
			x;
		
		for(x=0; x<keys.length; x++) {
			// Fields matching ^[_\$\#] are for data handling and should not be considered in stringification and other conversions
			// Universe field is reserved property and shouldn't come out either
			if(keys[x] && keys[x] !== "universe" && keys[x][0] !== "_" && keys[x][0] !== "$" && keys[x][0] !== "#") {
				value = this[keys[x]];
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
	
	recalculateSheet() {
		// Establish Base
		var references = [],
			base = {},
			keys,
			load,
			x;
		
		keys = Object.keys(this);
		for(x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_") {
				switch(typeof(this[keys[x]])) {
					case "boolean":
					case "string":
					case "number":
						base[keys[x]] = this[keys[x]];
						break;
				}

				// Isolate Reference Fields
				if(this.universe.nouns[keys[x]]) {
					references.push(keys[x]);
				}
			}
		}
		
		console.log("References: ", references);
		if(references && references.length) {
			for(x=0; x<references.length; x++) {
				this.loadNounReferenceModifications(references[x], base);
			}
		}
		
	}
	
	loadNounReferenceModifications(noun, base) {
		var reference = this[noun],
			x;
		
		console.log("Load Noun[" + noun + "]: ", reference);
		if(reference instanceof Array) {
			for(x=0; x<reference.length; x++) {
				this.universe.nouns[noun][reference[x]].performModifications(base);
			}
		} else {
			this.universe.nouns[noun][reference].performModifications(base);
		}
	}
	
	performModifications(base) {
		console.log("RSObject Root Modify[" + this.id + "]: ", this, _p(base));
		var x;
		
		try {
			if(this.modifierstats) {
				for(x=0; x<this.modifierstats.length; x++) {
					this.universe.nouns.modifierstats[this.modifierstats[x]].performModifications(base);
				}
			}
			if(this.modifierattrs) {
				for(x=0; x<this.modifierattrs.length; x++) {
					this.universe.nouns.modifierattrs[this.modifierattrs[x]].performModifications(base);
				}
			}
			console.log("RSObject Root Finished[" + this.id + "]: ", _p(base));
		} catch(exception) {
			console.error("RSObject Root Failed[" + this.id + "]: " + exception.message);
		}

	}
	
	loadDelta(delta) {
		var keys = Object.keys(delta),
			x;
		
		for(x=0; x<keys.length; x++) {
			if(typeof(this[keys[x]]) !== "function") {
				this[keys[x]] = delta[keys[x]];
			}
		}
		
		if(this.loadDeltaHook) {
			this.loadDeltaHook(delta);
		}
		
		this.recalculateSheet();
		
		this.$emit("modified", this);
	}
}
