
/**
 * 
 * 
 * @class rsObjectInfoBasic
 * @constructor
 * @module Components
 */
(function() {
	
	var invisibleKeys = {};
	invisibleKeys.invisibleProperties = true;
	invisibleKeys.modifierstats = true;
	invisibleKeys.modifierattrs = true;
	invisibleKeys.description = true;
	invisibleKeys.condition = true;
	invisibleKeys.singleton = true;
//	invisibleKeys.playable = true;
	invisibleKeys.universe = true;
	invisibleKeys.name = true;
	invisibleKeys.icon = true;
	invisibleKeys.echo = true;
	invisibleKeys.id = true;
	
	var prettifyNames = {};
	var prettifyValues = {};
	
	var prettifyPropertyPattern = /_([a-z])/ig, 
		prettifyPropertyName = function(full, match) {
			return " " + match.capitalize();
		};
	
	rsSystem.component("rsObjectInfoBasic", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSShowdown
		],
		"props": {
			"record": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.holdDescription = null;
			data.description = null;
			data.keys = [];
			data.id = null;
			
			return data;
		},
		"watch": {
			"record": function() {
				this.update();
			}
		},
		"mounted": function() {
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value])) {
					console.log("Follow: ", follow);
					rsSystem.EventBus.$emit("display-info", follow);
				}
			};

			if(this.record.$on) {
				this.record.$on("modified", this.update);
			} else {
				console.warn("Record is not listenable? ", this.record);
			}
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"visible": function(key, value) {
				return key && value !== null && key[0] !== "_" && !invisibleKeys[key] && (!this.record.invisibleProperties || this.record.invisibleProperties.indexOf(key) === -1);
			},
			"isArray": function(value) {
				return value instanceof Array;
			},
			"prettifyKey": function(key) {
			},
			"prettifyPropertyName": function(property) {
				switch(typeof(this.record._prettifyName)) {
					case "function":
						return this.record._prettifyName(property);
					case "object":
						if(this.record._prettifyName[property]) {
							return this.record._prettifyName[property];
						}
				}
				
				if(prettifyNames[property]) {
					switch(typeof(prettifyNames[property])) {
						case "string":
							return prettifyNames[property];
						case "function":
							return prettifyNames[property](property);
					}
				}

				return property.replace(prettifyPropertyPattern, prettifyPropertyName).capitalize();
			},
			"prettifyPropertyValue": function(property, value) {
				switch(typeof(this.record._prettifyValue)) {
					case "function":
						return this.record._prettifyValue(property, value);
					case "object":
						if(this.record._prettifyValue[property]) {
							return this.record._prettifyValue[property];
						}
				}
				
				if(prettifyValues[property]) {
					switch(typeof(prettifyValues[property])) {
						case "string":
							return prettifyValues[property];
						case "function":
							return prettifyValues[property](property);
					}
				}
				
				if(value instanceof Array) {
					
				} else {
					switch(typeof(value)) {
						case "object":
							return value.hidden_name || value.name || value.id || value.description;
						default:
							if(this.universe.indexes[property]) {
								
							}
					}
				}
				
				return value;
			},
			"prettifyReferenceValue": function(reference, property, value) {
				
			},
			"update": function() {
//				console.log("Check: " + this.id + " | " + this.record.id);
				if(this.id && this.id !== this.record.id) {
//					console.log("Shifting");
					this.universe.index.index[this.id].$off("modified", this.update);
					this.record.$on("modified", this.update);
					Vue.set(this, "id", this.record.id);
				} else {
//					console.log("Setting");
					Vue.set(this, "id", this.record.id);
				}
				
				if(this.record.description) {
					if(this.holdDescription !== this.record.description) {
						Vue.set(this, "holdDescription", this.record.description);
						Vue.set(this, "description", this.rsshowdown(this.holdDescription));
					}
				} else {
					Vue.set(this, "holdDescription", null);
					Vue.set(this, "description", null);
				}
				
				this.keys.splice(0);
				this.keys.push.apply(this.keys, Object.keys(this.record));
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
//			console.log("Finishing");
			this.record.$off("modified", this.update);
		},
		"template": Vue.templified("components/info/render/basic.html")
	}, "display");
})();