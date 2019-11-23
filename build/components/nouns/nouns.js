
/**
 * 
 * 
 * @class rsNoun
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_nounComponentKey";
	
	var spacing = / /g;
	
	/**
	 * Fill out item to complete fields.
	 * @method completeItem
	 * @param {Object} item
	 */
	var completeItem = function(type, item) {
		if(!item.id) {
			if(!item.name) {
				throw new Error("No ID or name");
			} else {
				item.id = type + ":" + item.name.toLowerCase().replace(spacing, "");
			}
		}
		
		item.id = item.id.toLowerCase().trim();
		if(item.name) {
			item.name = item.name.trim();
		}
		
		return item;
	};
	
	rsSystem.component("rsNouns", {
		"inherit": true,
		"mixins": [
			rsSystem.components.StorageManager
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"player": {
				"required": true,
				"type": Object
			},
			"built": {
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.message = null;
			data.rawValue = "{}";
			data.isValid = true;
			data.copy = null;
			data.nouns = rsSystem.listingNouns.sort();
			data.state = this.loadStorage(storageKey, {
				"current": "player",
				"building": {}
			});
//			console.log("Loaded Data[" + storageKey + "]: ", data.state);
			
			data.extra_properties = [];
			
			return data;
		},
		"watch": {
			"copy": function(value) {
				if(value) {
//					var copy = this.copyNoun(this.universe.nouns[this.state.current][value]);
					Vue.set(this, "rawValue", JSON.stringify(this.universe.nouns[this.state.current][value].toJSON(), null, 4));
					Vue.set(this, "copy", null);
				}
			},
			"rawValue": function(value) {
				try {
					var parsed = JSON.parse(value),
						keys,
						x;
					
					Vue.set(this.state.building, this.state.current, parsed);
					this.saveStorage(storageKey, this.state);
					Vue.set(this, "message", null);
					Vue.set(this, "isValid", true);
					
					if(this.built) {
						keys = Object.keys(this.built);
						for(x=0; x<keys.length; x++) {
							Vue.set(this.built, keys[x], null);
						}
						keys = Object.keys(parsed);
						for(x=0; x<keys.length; x++) {
							Vue.set(this.built, keys[x], parsed[keys[x]]);
						}
					}
					
				} catch(exception) {
					Vue.set(this, "message", "Invalid: " + exception.message);
					Vue.set(this, "isValid", false);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			if(this.state.building[this.state.current]) {
				Vue.set(this, "rawValue", JSON.stringify(this.state.building[this.state.current], null, "\t"));
			}
		},
		"methods": {
			"newObject": function() {
				var keys = this.state.building[this.state.current],
					x;

				if(this.built) {
					for(x=0; x<keys.length; x++) {
						Vue.delete(this.state.building[this.state.current], keys[x]);
						Vue.set(this.built, keys[x], null);
					}
				} else {
					for(x=0; x<keys.length; x++) {
						Vue.delete(this.state.building[this.state.current], keys[x]);
					}
				}
				
				Vue.set(this, "rawValue", "{}");
			},
			"dropObject": function() {
				this.state.building[this.state.current]._type = this.state.current;
				this.universe.send("delete:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current]));
			},
			"copyNoun": function(source) {
				var result = {},
					keys = Object.keys(source),
					x;
				
				for(x=0; x<keys.length; x++) {
					if(keys[x] && keys[x][0] !== "_") {
						result[keys[x]] = source[keys[x]];
					}
				}
				
				return result;
			},
			"saveEvent": function(event) {
				console.warn("Save?", event);
				if(event.code === "KeyS" && event.ctrlKey) {
					console.warn("Save");
					this.modify();
					event.stopPropagation();
					event.preventDefault();
					return false;
				}
			},
			"modify": function() {
//				console.warn("modify: ", event);
				
				if(this.isValid) {
//					console.log("valid");
					if(this.state.building[this.state.current] instanceof Array) {
//						console.log("array");
						for(var x=0; x<this.state.building[this.state.current].length; x++) {
//							console.warn("sync: ", this.state.building[this.state.current][x]);
							this.state.building[this.state.current][x]._type = this.state.current;
							this.universe.send("modify:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current][x]));
						}
					} else {
//						console.warn("sync: ", this.state.building[this.state.current]);
						this.state.building[this.state.current]._type = this.state.current;
						this.universe.send("modify:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current]));
					}
				}
			}
		},
		"template": Vue.templified("components/nouns.html")
	});
})();
