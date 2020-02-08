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
		this._sourceData = _p(details);
		this._coreData = {};
		this._registered = {};
		var keys = Object.keys(details),
			x;
		
//		console.log("Key set for " + details.id + ": ", keys);
		for(x=0; x<keys.length; x++) {
			if(keys[x] !== "name" && keys[x] !== "description" && keys[x] !== "echo") {
				this._coreData[keys[x]] = details[keys[x]];
			}
		}
		
//		this.name = details.name;
//		console.log("Final Core Set for " + details.id + ": ", _p(this._coreData), _p(details));
		this._coreData.description = details.description;
		this._coreData.name = details.name;
		this._modifiers = [];
		this.id = details.id;
		
		if(this.universe) {
			this.universe.$on("model:modified", (event) => {
				if(event && event.id === this.id) {
//					console.log("Object Processing Modification: ", this, event);
					this.loadDelta(event.modification);
				}
			});
		}
	}
	
	get name() {
		if(this.hidden) {
			return this.hiddenName || "Unknown";
		} else {
			return this._coreData.name || this.id;
		}
	}
	
	get description() {
		if(this.hidden) {
			return this.hiddenDescription;
		} else {
			return this._coreData.description;
		}
	}
	
	/**
	 * 
	 * @method commit
	 * @param {Object} change
	 */
	commit(change) {
		change._type = this._type;
		change.id = this.id;
		this.universe.send("modify:" + this._type, change);
	}

	/**
	 * 
	 * @method toJSON
	 * @return {Object}
	 */
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
	
	cleanCurrentData() {
		var keys = Object.keys(this);
		for(var x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_" && keys[x] !== "universe" && keys[x] !== "description" && keys[x] !== "name" && typeof(this[keys[x]]) !== "function") {
				delete(this[keys[x]]);
			}
		}
	}
	
	/**
	 * 
	 * @method recalculateProperties
	 */
	recalculateProperties(debug, skip, trigger) {
		if(!this.id) {
			return false;
		}
		
		if(trigger) {
//			console.warn("Trigger Sub-Recomputation from " + trigger.id + " on ", this);
//			return;
		}
		
		// Establish Base
		var selfReference = this,
			references = [],
			base = {},
			keys,
			load,
			x;

		base._calculated = [];
		
		// Stop listening for changes to known modifiers and clear
//		for(x=0; x<this._modifiers.length; x++) {
//			console.warn("Remove Listener: " + this.id + " from " + this._modifiers[x].id + ": " + this._modifiers[x].$off("modified", this.recalculateProperties));
////			this._modifiers[x].$off("modified", this.recalculateProperties);
//		}
//		this._modifiers.splice(0);
		
		keys = Object.keys(this._coreData);
		for(x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_") {
				base[keys[x]] = this._coreData[keys[x]];
				/*
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
				*/

				if(!this.universe.nouns) {
					// console.trace("Noun Failure: ", this);
				}
				// Isolate Reference Fields
				if(this.universe.nouns && this.universe.nouns[keys[x]]) {
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
		keys = Object.keys(this);
		for(x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_" && keys[x] !== "universe" && keys[x] !== "description" && keys[x] !== "name" && typeof(this[keys[x]]) !== "function") {
				delete(this[keys[x]]);
			}
		}
		keys = Object.keys(base);
		for(x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_" && keys[x] !== "name" && keys[x] !== "description" && keys[x] !== "echo" && typeof(this[keys[x]]) !== "function" ) {
				this[keys[x]] = base[keys[x]];
			}
		}
		if(debug) {
			console.log("Assembled: ", _p(this), _p(base));
		}

		// Listen for changes on direct modifiers
		for(x=0; this.modifierattrs && x<this.modifierattrs.length; x++) {
			load = this.universe.indexes.modifierattrs.lookup[this.modifierattrs[x]];
			if(load) {
//				rsSystem.log.warn("Binding Modifier[ " + this.modifierattrs[x] + " | " + load.id + " ] to object[ " + this.id + " ]");
				if(!this._registered[load.id]) {
					this._registered[load.id] = true;
					load.$once("modified", () => {
						selfReference.recalculateProperties();
					});
				}
			} else {
				rsSystem.log.warn("Unknown Attribute Modifier[" + this.modifierattrs[x] + "] for object[" + this.id + "]: " + Object.keys(this.universe.indexes.modifierattrs));
			}
		}
		for(x=0; this.modifierstats && x<this.modifierstats.length; x++) {
			load = this.universe.indexes.modifierstats.lookup[this.modifierstats[x]];
			if(load) {
//				rsSystem.log.warn("Binding Modifier[ " + this.modifierstats[x] + " | " + load.id + " ] to object[ " + this.id + " ]");
				if(!this._registered[load.id]) {
					this._registered[load.id] = true;
					load.$once("modified", () => {
						selfReference.recalculateProperties();
					});
				}
			} else {
				rsSystem.log.warn("Unknown Stats Modifier[" + this.modifierstats[x] + "] for object[" + this.id + "]: " + Object.keys(this.universe.indexes.modifierstats));
			}
		}
		
		// Reform Search String
		this._search = this.id.toLowerCase();
		if(this.name) {
			this._search += this.name.toLowerCase();
		}
		if(this.description) {
			this._search += this.description.toLowerCase();
		}
		if(this.location && typeof(this.location) === "string") {
			this._search += this.location.toLowerCase();
			if(this.universe.index.lookup[this.location] && this.universe.index.lookup[this.location].name) {
				this._search += this.universe.index.lookup[this.location].name.toLowerCase();
			}
		}
		
		if(this.universe.calculator) {
			load = {};
			for(x=0; x<base._calculated.length; x++) {
				if(!load[base._calculated[x]]) {
//					console.warn("Calculator Processing[" + base._calculated[x] + "]: ", base[base._calculated[x]]);
					base[base._calculated[x]] = this.universe.calculator.process(base[base._calculated[x]]);
					load[base._calculated[x]] = true;
//					console.warn(" > Result[" + base._calculated[x] + "]: ", base[base._calculated[x]]);
				}
			}
		}
		
		if(this.recalculateHook) {
			this.recalculateHook();
		}
		
		if(debug || this._debugging) {
			console.log("Recalculated: " + this.id, base);
		}
		
		/**
		 * 
		 * @event modified
		 * @param {RSObject} source The object that was modified.
		 */
		this.$emit("modified", this);
	}

	/**
	 * 
	 * @method loadNounReferenceModifications
	 * @param {String} noun
	 * @param {Object} base
	 */
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

	/**
	 * 
	 * @method performModifications
	 * @param {Object} base
	 * @return {Boolean} Whether the modification was performed or not.
	 */
	performModifications(base) {
		var buffer,
			x;
		
		for(x=0; this.condition && x < this.condition.length; x++) {
			buffer = this.universe.index.lookup[this.condition[x]];
			if(buffer && buffer.evaluate && !buffer.evaluate(base, this.id)) {
				return false;
			}
		}
		
		if(this._coreData.modifierstats) {
			for(x=0; x<this._coreData.modifierstats.length; x++) {
				if(this.universe.nouns.modifierstats[this._coreData.modifierstats[x]]) {
					this.universe.nouns.modifierstats[this._coreData.modifierstats[x]].performModifications(base);
				} else {
					console.warn("Missing Stat Modifier: " + this.universe.nouns.modifierstats[this._coreData.modifierstats[x]]);
				}
			}
		}
		if(this._coreData.modifierattrs) {
			for(x=0; x<this._coreData.modifierattrs.length; x++) {
				if(this.universe.nouns.modifierattrs[this._coreData.modifierattrs[x]]) {
					this.universe.nouns.modifierattrs[this._coreData.modifierattrs[x]].performModifications(base);
				} else {
					console.warn("Missing Attribute Modifier: " + this.universe.nouns.modifierstats[this._coreData.modifierattrs[x]]);
				}
			}
		}
		
		this._calculated = {};
		for(x=0; x<base._calculated.length; x++) {
			if(!this._calculated[base._calculated[x]]) {
				this._calculated[base._calculated[x]] = true;
			}
		}
		if(this._debugging) {
			console.log("RSObject Root Finished[" + this.id + "]: ", _p(base));
		}
		
		return true;
	}

	/**
	 * 
	 * @method loadDelta
	 * @param {Object} delta
	 */
	loadDelta(delta) {
		this._lastDelta = _p(delta);
		
		var keys = Object.keys(delta),
			x;
		
		for(x=0; x<keys.length; x++) {
			if(typeof(this[keys[x]]) !== "function" && keys[x] !== "echo") {
				this._coreData[keys[x]] = delta[keys[x]];
			}
		}
		
		if(this.loadDeltaHook) {
			this.loadDeltaHook(delta);
		}
		
		this.recalculateProperties();
		// Array properties not recalculating with one pass?
		this.recalculateProperties();
	}
}
