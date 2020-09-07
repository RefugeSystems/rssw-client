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
		this._replacedReferences = {};
		this._sourceData = _p(details);
		this._statContributions = {};
		this._relatedErrors = {};
		this._coreData = {};
		this._registered = {};
		this._knownKeys = [];
		this._known = {};
		this._shadow = JSON.parse(JSON.stringify(details));
		this._listeningParentCycle = 0;
		this._listeningParent = () => {
			var now = Date.now();
			if(this.universe.initialized && this._listeningParentCycle < now) {
				this._listeningParentCycle = now + 1000;
				this.recalculateProperties();
			}
			if(rsSystem.debug && this._listeningParentCycle >= now) {
				console.log("Recycling: ", this);
			}
		};
		
		this._registered._marked = Date.now();
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
					if(this.debug || this.universe.debug) {
						console.log("Object Processing Modification: ", this, event);
					}
					this.loadDelta(event.modification);
				}
			});
		}
	}
	
	get name() {
		var parent = this._coreData.parent?this.universe.index.index[this._coreData.parent]:false;
		
		if(this.hidden) {
			if(this.hiddenName) {
				return this.hiddenName;
			} else if(parent && parent.hiddenName) {
				return parent.hiddenName;
			} else {
				return "Unknown";
			}
		} else {
			if(this._coreData.name) {
				return this._coreData.name;
			} else if(parent && parent.name){
				return parent.name;
			} else {
				return this.id;
			}
		}
	}
	
	get description() {
		var parent = this._coreData.parent?this.universe.index.index[this._coreData.parent]:false;
		
		if(this.hidden) {
			if(this.hiddenDescription) {
				return this.hiddenDescription;
			} else if(parent && parent.hiddenDescription) {
				return parent.hiddenDescription;
			} else {
				return "Mystery";
			}
		} else {
			if(this._coreData.description) {
				return this._coreData.description;
			} else if(parent && parent.description){
				return parent.description;
			} else {
				return "";
			}
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
	
	commitAdditions(change, set) {
		set = set || {};
		set._type = this._type;
		set.id = this.id;
		set.delta = change;
		this.universe.send("modify:" + this._type + ":detail:additive", set);
	}
	
	commitSubtractions(change, set) {
		set = set || {};
		set._type = this._type;
		set.id = this.id;
		set.delta = change;
		this.universe.send("modify:" + this._type + ":detail:subtractive", set);
	}
	
	/**
	 * Set the learned property and add the knowledge entities.
	 * @method learnKnowledge
	 * @param {Array} knowledge Of ID Strings.
	 */
	learnKnowledge(knowledge) {
		var updates,
			x;

		if(!this._shadow.learned) {
			this._shadow.learned = {};
		}
		if(!this._shadow.knowledge) {
			this._shadow.knowledge = [];
		}
		
		for(x=0; x<knowledge.length; x++) {
			if(!this._shadow.learned[knowledge[x]]) {
				this._shadow.learned[knowledge[x]] = Date.now();
				this._shadow.knowledge.push(knowledge[x]);
				updates = true;
			}
		}
		
		if(updates) {
			this.commit({
				"knowledge": this._shadow.knowledge,
				"learned": this._shadow.learned
			});
		}
	}
	
	learnOfObjects(objects) {
		var x;

		for(x=0; x<objects.length; x++) {
			if(!this._shadow.learned[objects[x]]) {
				this._shadow.learned[objects[x]] = Date.now();
			}
		}
		
		this.commitAdditions({
			"known_objects": objects
		},{
			"learned": this._shadow.learned
		});
	}
	
	unlearnOfObjects(objects) {
		var x;

		for(x=0; x<objects.length; x++) {
			if(!this._shadow.learned[objects[x]]) {
				this._shadow.learned[objects[x]] = Date.now();
			}
		}
		
		this.commitSubtractions({
			"known_objects": objects
		}, {
			"learned": this._shadow.learned
		});
	}
	
	/**
	 * Clears the learned property and removes the knowledge entities.
	 * @method forgetKnowledge
	 * @param {Array} knowledge Of ID Strings.
	 */
	forgetKnowledge(knowledge) {
		if(!this.learned || !this.knowledge) {
			return false;
		}
		
		var updates,
			x;
		
		for(x=0; x<knowledge.length; x++) {
			if(this._shadow.learned[knowledge[x]]) {
				delete(this._shadow.learned[knowledge[x]]);
				updates = this._shadow.knowledge.indexOf(knowledge[x]);
				this._shadow.knowledge.splice(updates, 1);
			}
		}
		
		if(updates) {
			this.commit({
				"knowledge": this._shadow.knowledge,
				"learned": this._shadow.learned
			});
		}
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
	
	inSlot(equipment) {
		if(this.universe.debug) {
			console.debug("Check Slot[" + this.id + "]: ", equipment);
		}
		
		if(!equipment || !equipment.item) {
			if(this.universe.debug) {
				console.debug("No Equipment Slot[" + this.id + "]");
			}
			return false;
		}
		
		var keys = Object.keys(equipment.item),
			x;
		
		for(x=0; x<keys.length; x++) {
			if(this.universe.debug) {
				console.debug("Check Slot[" + keys[x] + " for " + this.id + "]");
			}
			if(equipment.item[keys[x]] && equipment.item[keys[x]].length && equipment.item[keys[x]].indexOf(this.id) !== -1) {
				return true;
			}
		}
		
		if(this.universe.debug) {
			console.debug("Failed Slot Check[" + this.id + "]");
		}
		
		return false;
	}
	
	unregisterListeners() {
//		rsSystem.log.debug("RSObject[" + this.id + "] Cleaning Reference Listeners");
		var keys,
			x;

		keys = Object.keys(this._registered);
		for(x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_") {
				if(this._registered[keys[x]].$off) {
					this._registered[keys[x]].$off("modified", this.dependencyFired);
				} else {
					console.warn("RSObject[" + this.id + "] unable To Remove Listener? ", this._registered[keys[x]]);
				}
				delete(this._registered[keys[x]]);
			}
		}
	}
	
	dependencyFired(event) {
		this.recalculateProperties();
	}
	
	/**
	 * 
	 * @method consumeSlotsFor
	 * @param {RSObject} record The record to check.
	 * @param {String} id The ID of the slot that is to be used.
	 * @param {Array} slots Strings indicating the remaining slots
	 */
	consumeSlotsFor(record, id, slots) {
		return RSObject.consumeSlotsFor(record, id, slots);
		/*
		if(!record || !id || !slots || !slots.length) {
			return false;
		}
		
		var indexes = [],
			index = -2,
			need;
		
		if(record.slots_used > 1) {
			need = record.slots_used;
		} else {
			need = 1;
		}
		
		while(index !== -1 && indexes.length < need) {
			index = slots.indexOf(id, index);
			if(index !== -1) {
				indexes.push(index);
			}
		}
		
		if(indexes.length === need) {
			for()
		} else {
			return false;
		}
		*/
	}
	
	/**
	 * 
	 * @method recalculateProperties
	 * @param {Object} [replacedProperties] Defaults to this._replacedProperties.
	 */
	recalculateProperties(replacedReferences, debug) {
		if(debug || this.universe.debug) {
			console.error("Recalculating Object: " + this.name + " [ " + this.id + " ]");
		}
		if(!this.id) {
			return false;
		}
		if(this.suppressed) {
			return false;
		}
		
		if(this.recalculatePrefetch) {
			this.recalculatePrefetch();
		}
		
		replacedReferences = replacedReferences || this._replacedReferences;
		if(debug || this.debug || this.universe.debug) {
			console.warn("replacedReferences: ",replacedReferences);
		}
		
		if(60000 < Date.now() - this._registered._marked) {
			this.unregisterListeners();
		}
		
		// Establish Base
		var selfReference = this,
			references = [],
			base = {},
			tracking,
			loading,
			parent,
			buffer,
			index,
			hold,
			keys,
			load,
			x,
			y,
			z;
		
		keys = Object.keys(this._statContributions);
		for(x=0; x<keys.length; x++) {
			delete(this._statContributions[keys[x]]);
		}

		base._equipped = this._coreData.equipped;
		base._replacedReferences = replacedReferences; // Skip & reference modifications
		base._contributions = this._statContributions; // TODO: Track what item/entity/room contributed to the property
		base._calculated = []; // Track calculated fields
		base._overrides = {}; // Tracks slot like modifications where certain types should be overriden in modifier application
		if(debug || this.debug || this.universe.debug) {
			console.log("Initial Base Data:\n > This: ", _p(this.equipped), _p(this._equipped), "\n > Core: ", _p(this._coreData), "\n > Base: ", _p(base));
		}
		
		keys = Object.keys(this._relatedErrors);
		for(x=0; x<keys.length; x++) {
			delete(this._relatedErrors[keys[x]]);
		}
		if(this.slot) {
			tracking = [].concat(this.slot);
			if(this._coreData.equipped) {
//			if(this.equipped) {
				keys = Object.keys(this._coreData.equipped);
//				keys = Object.keys(this.equipped);
				for(x=0; x<keys.length; x++) { // "Accepts" of slot
					buffer = Object.keys(this._coreData.equipped[keys[x]]);
//					buffer = Object.keys(this.equipped[keys[x]]);
					if(buffer.length) {
						base._overrides[keys[x]] = [];
						for(y=0; y<buffer.length; y++) { // ID of Slot
							hold = this._coreData.equipped[keys[x]][buffer[y]]; // Things equipped to this slot. Always array.
//							hold = this.equipped[keys[x]][buffer[y]]; // Things equipped to this slot. Always array.
							for(z=0; z<hold.length; z++) {
								// If you have it (Item/Room) or it is inside you (Entity)
								if((this[keys[x]] && this[keys[x]].indexOf(hold[z]) !== -1) || (this.universe.indexes[keys[x]] && this.universe.indexes[keys[x]][hold[z]] && this.universe.indexes[keys[x]][hold[z]].inside === this.id)) {
									// And you have slots for it
									if(this.consumeSlotsFor(this.universe.index.lookup[hold[z]], buffer[y], tracking)) {
										if(debug || this.debug || this.universe.debug) {
											console.log(" > Record is slot valid: " + hold[z]);
										}
										switch(keys[x]) {
											case "item":
											case "room":
												base._overrides[keys[x]].push(hold[z]);
												break;
										}
									} else {
										if(debug || this.debug || this.universe.debug) {
											console.log(" > Record is not slot valid: " + hold[z]);
										}
										this._relatedErrors[hold[z]] = {
											"type": "error",
											"message": "Not enough slots left",
											"calculated": Date.now(),
											"contents": hold[z],
											"slot": buffer[y]
										};
									}
								} else {
									if(debug || this.debug || this.universe.debug) {
										console.log(" > Record is not held valid: " + hold[z]);
									}
									this._relatedErrors[hold[z]] = {
										"type": "error",
										"message": "Item no longer in possession",
										"calculated": Date.now(),
										"contents": hold[z],
										"slot": buffer[y]
									};
								}
							}
						}
					}
				}
			} else {
				for(x=0; x<this.slot.length; x++) {
					buffer = this.universe.indexes.slot.index[this.slot[x]];
					if(buffer && !base._overrides[buffer.accepts] && (buffer.accepts === "item" || buffer.accepts === "room")) {
						base._overrides[buffer.accepts] = [];
					}
				}
			}
		}
		
		// Stop listening for changes to known modifiers and clear
		for(x=0; x<this._modifiers.length; x++) {
			if(debug) {
				console.warn("Remove Listener: " + this.id + " from " + this._modifiers[x].id + ": " + this._modifiers[x].$off("modified", this.recalculateProperties));
			} else {
				this._modifiers[x].$off("modified", this.recalculateProperties);
			}
		}
		this._modifiers.splice(0);

		// Establish Base from Core Data Parent if any
		if(this._coreData.parent && (parent = ((this._coreData._type && this.universe.indexes[this._coreData._type].index[this._coreData.parent]) || (!this._coreData._type && this.universe.index.index[this._coreData.parent])))) {
			if(this._listeningToParent !== parent) {
				if(this._listeningToParent) {
					this._listeningToParent.$off("modified", this._listeningParent);
				}
				this._listeningToParent = parent;
				parent.$on("modified", this._listeningParent);
			}
			keys = Object.keys(parent);
			for(x=0; x<keys.length; x++) {
				if(keys[x][0] !== "_" && keys[x] !== "template" && keys[x] !== "universe" && !parent._statContributions[keys[x]]) {
					if(debug) {
						console.log("Checking Parent Base Key: " + keys[x], this.universe);
					}
//					base[keys[x]] = this._coreData[keys[x]];
					if(typeof(parent[keys[x]]) === "object") {
						if(parent[keys[x]] === null) {
							base[keys[x]] = null;
						} else if(parent[keys[x]] instanceof Array) {
							base[keys[x]] = [];
							base[keys[x]].push.apply(base[keys[x]], parent[keys[x]]);
						} else {
							base[keys[x]] = Object.assign({}, parent[keys[x]]);
						}
					} else {
						base[keys[x]] = parent[keys[x]];
					}

					if(!this.universe.nouns) {
						// console.trace("Noun Failure: ", this);
					}
					// Isolate Reference Fields
					if(this.universe.nouns && this.universe.nouns[keys[x]]) {
						references.push(keys[x]);
					}
				}
			}
		} else if(this._listeningToParent) {
			this._listeningToParent.$off("modified", this._listeningParent);
		}
		
		// Establish Base from Core Data
		keys = Object.keys(this._coreData);
		for(x=0; x<keys.length; x++) {
			if(keys[x][0] !== "_" && keys[x] !== "universe" && this._coreData[keys[x]] !== undefined && this._coreData[keys[x]] !== null) {
				if(debug) {
					console.log("Checking Base Key: " + keys[x], this.universe);
				}
//				base[keys[x]] = this._coreData[keys[x]];
				if(typeof(this._coreData[keys[x]]) === "object") {
					if(this._coreData[keys[x]] === null) {
						base[keys[x]] = null;
					} else if(this._coreData[keys[x]] instanceof Array) {
						base[keys[x]] = [];
						base[keys[x]].push.apply(base[keys[x]], this._coreData[keys[x]]);
					} else {
						base[keys[x]] = Object.assign({}, this._coreData[keys[x]]);
					}
				} else {
					base[keys[x]] = this._coreData[keys[x]];
				}

				if(!this.universe.nouns) {
					// console.trace("Noun Failure: ", this);
				}
				// Isolate Reference Fields
				if(this.universe.nouns && this.universe.nouns[keys[x]]) { // Prevent double reference from parent
					references.push(keys[x]);
				}
			}
		}
		
		if(base.name && !base.label) {
			base.label = base.name;
		}

		if(debug || this.debug || this.universe.debug) {
			console.log("Core Data: ", _p(this._coreData));
			console.log("Base: ", _p(base));
			console.log("Base Overrides: ", base._overrides);
			console.log("References: ", references);
		}
		
		if(references  && references.length) {
			for(x=0; x<references.length; x++) {
				this.loadNounReferenceModifications(references[x], base, debug);
				if(debug || this.debug || this.universe.debug) {
					console.log("Reference[" + references[x] + "]: ", _p(base));
				}
			}
		}

		// TODO: Listen for changes on references
		
		// Reform Search String
		this._search = ""; //this.id.toLowerCase();
		if(this.name) {
			this._search += this.name.toLowerCase();
		}
		if(this.description) {
			this._search += this.description.toLowerCase();
		}
		if(this.type && this.type.toLowerCase) {
			this._search += this.type.toLowerCase();
		}
		if(this.classification && this.classification.toLowerCase) {
			this._search += this.classification.toLowerCase();
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
				if(typeof(base[base._calculated[x]]) === "string" && base._calculated[x] !== "undefined" && !load[base._calculated[x]]) {
					if(debug || this.debug || this.universe.debug) {
						console.warn("Calculator Processing[" + base._calculated[x] + "]: ", base[base._calculated[x]]);
					}
					base[base._calculated[x]] = this.universe.calculator.process(base[base._calculated[x]], this);
					load[base._calculated[x]] = true;
					if(debug || this.debug || this.universe.debug) {
						console.warn(" > Result[" + base._calculated[x] + "]: ", base[base._calculated[x]]);
					}
				}
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
		
		if(debug || this.debug || this.universe.debug) {
			console.log("Assembled: ", _p(this), _p(base));
		}
		
		this.rebuildKnown();
		
		if(this.recalculateHook) {
			this.recalculateHook();
		}
		
		if(debug || this.debug || this.universe.debug) {
			console.log("Recalculated: " + this.id + "\n > Base: ", _p(base), "\n > This: ", _p(this));
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
	loadNounReferenceModifications(noun, base, debug) {
		debug = debug || this.universe.debug;
		if(this.universe.nouns) {
			var reference,
				buffer,
				x;
			
			if(base && base._overrides && base._overrides[noun]) {
				reference = base._overrides[noun];
			} else if(base && base._replacedReferences && base._replacedReferences[noun]) {
				reference = base._replacedReferences[noun];
			} else {
				reference = this[noun];
			}
			
			if(debug || this.debug || this.universe.debug) {
				console.log("Check Noun Load[" + noun + " -> " + this.id + "]: ", reference);
			}
			
			if(reference instanceof Array) {
				for(x=0; x<reference.length; x++) {
					if(debug || this.debug || this.universe.debug) {
						console.log("Perform Noun Load[" + noun + " -> " + this.id + "]: ", reference[x]);
					}
					if(reference[x] && (buffer = this.universe.nouns[noun][reference[x]._sourced || reference[x]])) {
						if(debug || this.debug || this.universe.debug) {
							console.log("Buffered Noun Load[" + noun + " -> " + this.id + "]: ", buffer);
						}
						if(!this._registered[buffer.id]) {
							buffer.$on("modified", this.dependencyFired, this);
							this._registered[buffer.id] = buffer;
						}
						buffer.performModifications(base, this.id, debug);
					}
				}
			} else {
				if(reference && (buffer = this.universe.nouns[noun][reference._sourced || reference])) {
					buffer.performModifications(base, this.id, debug);
					if(!this._registered[buffer.id]) {
						buffer.$on("modified", this.dependencyFired, this);
						this._registered[buffer.id] = buffer;
					}
				}
			}
		}
	}

	/**
	 * 
	 * @method performModifications
	 * @param {Object} base
	 * @return {Boolean} Whether the modification was performed or not.
	 */
	performModifications(base, origin, finalize) {
		if(this.needs_slot && !this.inSlot(base._equipped)) {
			if(this.debug || this.universe.debug) {
				console.error(" ! Mod Aborted for Slot[" + origin + "]: " + this.id);
			}
			return false;
		}
		
		var buffer,
			keys,
			mod,
			m,
			x,
			y;
		
		if(this.debug || this.universe.debug) {
			console.error("Perform Mod[" + origin + "]: " + this.id);
		}
		
		for(x=0; this.condition && x < this.condition.length; x++) {
			buffer = this.universe.index.lookup[this.condition[x]];
			if(buffer && buffer.evaluate && !buffer.evaluate(base, this.id)) {
				return false;
			}
		}
		
		/*
		if(this.universe.index) {
			for(x=0; x<rsSystem.listingNouns.length; x++) {
				if(this._coreData[rsSystem.listingNouns[x]]) {
					if(this.debug || this.universe.debug) {
						console.warn(" ! Perform Cross Check[" + rsSystem.listingNouns[x] + "]: " + this.id);
					}
					if(this._coreData[rsSystem.listingNouns[x]] instanceof Array) {
						for(y=0; y<this._coreData[rsSystem.listingNouns[x]].length; y++) {
							if(this._coreData[rsSystem.listingNouns[x]][y]) {
								buffer = this.universe.index.lookup[this._coreData[rsSystem.listingNouns[x]][y]._sourced || this._coreData[rsSystem.listingNouns[x]][y]];
								if(buffer) {
									buffer.performModifications(base, this.id);
								} else {
									console.warn("Missing Reference[" + this._coreData[rsSystem.listingNouns[x]] + "] in object[" + this.id + "]");
								}
							}
						}
					} else if(this._coreData[rsSystem.listingNouns[x]]) {
						buffer = this.universe.index.lookup[this._coreData[rsSystem.listingNouns[x]]._sourced || this._coreData[rsSystem.listingNouns[x]]];
						if(buffer) {
							buffer.performModifications(base, this.id);
						} else {
							console.warn("Missing Reference[" + this._coreData[rsSystem.listingNouns[x]] + "] in object[" + this.id + "]");
						}
					}
				}
			}
		}
		*/
		if(this.universe.index) {
			for(x=0; x<rsSystem.listingNouns.length; x++) {
				if(this[rsSystem.listingNouns[x]]) {
					if(this.debug || this.universe.debug) {
						console.warn(" ! Perform Cross Check[" + rsSystem.listingNouns[x] + "]: " + this.id);
					}
					if(this[rsSystem.listingNouns[x]] instanceof Array) {
						for(y=0; y<this[rsSystem.listingNouns[x]].length; y++) {
							if(this[rsSystem.listingNouns[x]][y]) {
								buffer = this.universe.index.lookup[this[rsSystem.listingNouns[x]][y]._sourced || this[rsSystem.listingNouns[x]][y]];
								if(buffer) {
									buffer.performModifications(base, this.id);
								} else {
									console.warn("Missing Reference[" + this[rsSystem.listingNouns[x]] + "] in object[" + this.id + "]");
								}
							}
						}
					} else if(this[rsSystem.listingNouns[x]]) {
						buffer = this.universe.index.lookup[this[rsSystem.listingNouns[x]]._sourced || this[rsSystem.listingNouns[x]]];
						if(buffer) {
							buffer.performModifications(base, this.id);
						} else {
							console.warn("Missing Reference[" + this._coreData[rsSystem.listingNouns[x]] + "] in object[" + this.id + "]");
						}
					}
				}
			}
		}
		
		if(base._calculated) {
			this._calculated = {};
			for(x=0; x<base._calculated.length; x++) {
				if(!this._calculated[base._calculated[x]]) {
					this._calculated[base._calculated[x]] = true;
				}
			}
		}
		
		if(this.debug || this.universe.debug) {
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
	
	/**
	 * Rebuilds the _known property to track what things in the universe
	 * this object is aware of. This can be used as clarivoyance for what
	 * has touched or used an inanimate object to a creature's actual knowledge
	 * that it can share.
	 * @method rebuildKnown
	 */
	rebuildKnown() {
		var knowledge,
			key,
			x,
			y;
		
		for(x=0; x<this._knownKeys.length; x++) {
			delete(this._known[this._knownKeys[x]]);
		}
		this._knownKeys.splice(0);

		if(this.known_objects) {
			for(x=0; x<this.known_objects.length; x++) {
				if(!this._known[this.known_objects[x]]) {
					this._known[this.known_objects[x]] = [];
				}
				this._known[this.known_objects[x]].push(this.id);
				this._knownKeys.push(this.known_objects[x]);
			}
		}
		
		if(this.knowledge && this.knowledge.length) {
			for(x=0; x<this.knowledge.length; x++) {
				knowledge = this.universe.indexes.knowledge.index[this.knowledge[x]];
				if(knowledge && knowledge.related && knowledge.related.length) {
					for(y=0; y<knowledge.related.length; y++) {
						key = knowledge.related[y];
						if(!this._known[key]) {
							this._known[key] = [];
						}
						this._known[key].push(knowledge.id);
						this._knownKeys.push(key);
					}
				}
			}
		}
	}
	
	knowsOf(thing, threshold, knowledge) {
		if(knowledge && (!this.knowledge || this.knowledge.indexOf(knowledge.id || knowledge) === -1)) {
			return false;
		}
		
		if(thing) {
			if(typeof(thing) === "object") {
				return this._known[thing.id] && this._known[thing.id].length >= (thing.known_threshold || threshold || 1);
			} else {
				thing = thing.id || thing;
				if(!threshold) {
					threshold = 1;
				}
				return this._known[thing] && this._known[thing].length >= threshold;
			}
		}
		return false;
	}
}

/**
 * 
 * @method consumeSlotsFor
 * @param {RSObject} record The record to check.
 * @param {String} id The ID of the slot that is to be used.
 * @param {Array} slots Strings indicating the remaining slots
 */
RSObject.consumeSlotsFor = function(record, id, slots) {
	if(!record || !id || !slots || !slots.length) {
		return false;
	}

//	console.warn("Start Slot Check: " + record.id, record, id, slots);
	
	var indexes = [],
		index = -1,
		need;
	
	if(record.slots_used > 1) {
		need = record.slots_used;
	} else {
		need = 1;
	}
	
	while((index = slots.indexOf(id, index + 1)) !== -1 && indexes.length < need) {
		if(index !== -1) {
			indexes.push(index);
		}
	}
	
//	console.warn("Check Slots[" + need + "]: ", record, id, slots, indexes);
	
	if(indexes.length === need) {
		for(index=indexes.length-1; 0 <= index; index--) {
			slots.splice(indexes[index], 1);
		}
		return true;
	} else {
		return false;
	}
};