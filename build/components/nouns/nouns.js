
/**
 * 
 * 
 * @class rsNoun
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_nounComponentKey";
	
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
			}
		},
		"mounted": function() {
			rsSystem.register(this);
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
			console.log("Loaded Data[" + storageKey + "]: ", data.state);
			
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
					var parsed = JSON.parse(value);
					Vue.set(this.state.building, this.state.current, parsed);
					this.saveStorage(storageKey, this.state);
					Vue.set(this, "message", null);
					Vue.set(this, "isValid", true);
				} catch(exception) {
					Vue.set(this, "message", "Invalid: " + exception.message);
					Vue.set(this, "isValid", false);
				}
			}
		},
		"methods": {
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
			"modify": function() {
				if(this.isValid) {
					if(this.state.building[this.state.current] instanceof Array) {
						for(var x=0; x<this.state.building[this.state.current].length; x++) {
							this.state.building[this.state.current][x]._type = this.state.current;
							this.universe.send("modify:" + this.state.current, this.state.building[this.state.current][x]);
						}
					} else {
						this.state.building[this.state.current]._type = this.state.current;
						this.universe.send("modify:" + this.state.current, this.state.building[this.state.current]);
					}
				}
			}
		},
		"template": Vue.templified("components/nouns.html")
	});
})();
