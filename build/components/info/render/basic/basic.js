
/**
 * 
 * 
 * @class rsObjectInfoBasic
 * @constructor
 * @module Components
 */
(function() {
	
	var invisibleKeys = {};
	invisibleKeys.information_renderer = true;
	invisibleKeys.invisibleProperties = true;
	invisibleKeys.source_template = true;
	invisibleKeys.modifierstats = true;
	invisibleKeys.modifierattrs = true;
	invisibleKeys.restock_base = true;
	invisibleKeys.restock_max = true;
	invisibleKeys.description = true;
	invisibleKeys.master_note = true;
	invisibleKeys.rarity_min = true;
	invisibleKeys.rarity_max = true;
	invisibleKeys.properties = true;
	invisibleKeys.condition = true;
	invisibleKeys.singleton = true;
	invisibleKeys.obscured = true;
//	invisibleKeys.playable = true;
	invisibleKeys.universe = true;
	invisibleKeys.playable = true;
	invisibleKeys.dataset = true;
	invisibleKeys.is_shop = true;
	invisibleKeys.linked = true;
	invisibleKeys.owners = true;
	invisibleKeys.hidden = true;
	invisibleKeys.name = true;
	invisibleKeys.icon = true;
	invisibleKeys.data = true;
	invisibleKeys.echo = true;
	invisibleKeys.url = true;
	invisibleKeys.id = true;
	invisibleKeys.x = true;
	invisibleKeys.y = true;
	

	invisibleKeys.coordinates = true;
	invisibleKeys.shown_at = true;
	invisibleKeys.profile = true;
	invisibleKeys.showing = true;
	invisibleKeys.viewed = true;
	invisibleKeys.map = true;
	
	var prettifyValues = {};
	var prettifyNames = {};
	var knowledgeLink = {};
	var displayRaw = {};
	
	prettifyNames.itemtype = "Item Types";
	
	var byName = function(a, b) {
		a = (a.name || "").toLowerCase();
		b = (b.name || "").toLowerCase();
		if(a < b) {
			return -1;
		} else if(a > b) {
			return 1;
		} else {
			return 0;
		}
	};

	knowledgeLink.encumberance = "knowledge:item:encumberance";
	knowledgeLink.critical = "knowledge:combat:critical";
	knowledgeLink.range = "knowledge:combat:rangebands";
	
	prettifyValues.range = function(record, value) {
		if(record.is_attachment) {
			return value;
		}
		
		switch(value) {
			case 1: return "Engaged (1)";
			case 2: return "Short (2)";
			case 3: return "Medium (3)";
			case 4: return "Long (4)";
			case 5: return "Extreme (5)";
		}
		
		return value;
	};
	
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
			},
			"source": {
				"type": Object
			},
			"target": {
				"type": Object
			},
			"player": {
				"type": Object
			},
			"user": {
				"type": Object
			},
			"base": {
				"type": Object
			},
			"options": {
				"type": Object,
				"default": function() {
					return {};
				}
			}
		},
		"data": function() {
			var data = {};
			
			data.collapsed = true;
			data.knowledgeLink = knowledgeLink;
			data.displayRaw = displayRaw;
			data.holdDescription = null;
			data.transfer_targets = [];
			data.transfer_target = "";
			data.restocking = false;
			data.description = null;
			data.holdNote = null;
			data.note = null;
			data.profile = null;
			data.image = null;
			data.keys = [];
			data.id = null;
			
			return data;
		},
		"watch": {
			"record": {
				"deep": true,
				"handler": function() {
//					console.warn("Record Shift: ", this.record);
					this.update();
				}
			}
		},
		"mounted": function() {
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value])) {
//					console.log("1Follow: ", follow);
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
				return key && key !== "image" && value !== null && key[0] !== "_" && !invisibleKeys[key] && (!this.record.invisibleProperties || this.record.invisibleProperties.indexOf(key) === -1);
			},
			"isArray": function(value) {
				return value instanceof Array;
			},
			"canTransfer": function() {
				return this.source && ((this.source.item && this.source.item.indexOf(this.record.id) !== -1) || (this.source.inventory && this.source.inventory.indexOf(this.record.id) !== -1));
			},
			"transferObject": function() {
				if(this.transfer_target && this.transfer_target !== "cancel") {
					this.universe.send("give:item", {
						"source": this.source.id,
						"target": this.transfer_target,
						"item": this.record.id
					});
				}
				
				Vue.set(this, "transfer_target", "");
			},
			"hideRecord": function() {
				this.record.commit({
					"hidden": this.record.hidden?null:true
				});
			},
			"obscureRecord": function() {
				this.record.commit({
					"obscured": this.record.obscured?null:true
				});
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
				if(this.record._calculated && this.record._calculated[property]) {
					property = this.universe.calculateExpression(value, this.source, this.base, this.target);
					if(property == value) {
						return this.universe.calculateExpression(value, this.source, this.base, this.target);
					} else {
						return this.universe.calculateExpression(value, this.source, this.base, this.target) + " [ " + value + " ]";
					}
				}
				
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
							return prettifyValues[property](this.record, value);
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
			"displayInfo": function(record) {
				
			},
			"restockLocation": function() {
				if(!this.restocking) {
					Vue.set(this, "restocking", true);
					
					this.universe.send("location:restock", {
						"id": this.record.id
					});
					
					setTimeout(() => {
						Vue.set(this, "restocking", false);
					}, 1000);
				}
			},
			"update": function() {
				var x;
				
//				console.log("Check: " + this.id + " | " + this.record.id);
				if(this.id && this.id !== this.record.id) {
//					console.log("Shifting");
					if(this.universe.index.index[this.id] && this.universe.index.index[this.id].$off) {
						this.universe.index.index[this.id].$off("modified", this.update);
					}
					if(this.record.$on) {
						this.record.$on("modified", this.update);
					}
					Vue.set(this, "id", this.record.id);
				} else {
//					console.log("Setting");
					Vue.set(this, "id", this.record.id);
				}
				
				if(this.record.description) {
					if(this.holdDescription !== this.record.description) {
						Vue.set(this, "holdDescription", this.record.description);
						Vue.set(this, "description", this.rsshowdown(this.record.description));
					}
				} else {
					Vue.set(this, "holdDescription", null);
					Vue.set(this, "description", null);
				}
				
				if(this.record.master_note) {
					if(this.holdNote !== this.record.master_note) {
						Vue.set(this, "holdNote", this.record.master_note);
						Vue.set(this, "note", this.rsshowdown(this.record.master_note));
					}
				} else {
					Vue.set(this, "holdNote", null);
					Vue.set(this, "note", null);
				}
				
				if(this.record.image && this.universe.nouns.image[this.record.image]) {
					Vue.set(this, "image", this.universe.nouns.image[this.record.image]);
				} else {
					Vue.set(this, "image", null);
				}
				
				if(this.record.profile && this.universe.nouns.image[this.record.profile]) {
					Vue.set(this, "profile", this.universe.nouns.image[this.record.profile]);
				} else {
					Vue.set(this, "profile", null);
				}
				
				this.keys.splice(0);
				this.keys.push.apply(this.keys, Object.keys(this.record));
				
				this.transfer_targets.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					if(this.source && !this.universe.indexes.entity.listing[x].obscured && !this.universe.indexes.entity.listing[x].mob && !this.universe.indexes.entity.listing[x].template && this.universe.indexes.entity.listing[x].id !== this.source.id) {
						this.transfer_targets.push(this.universe.indexes.entity.listing[x]);
					}
				}
				this.transfer_targets.sort(byName);
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
//			console.log("Finishing");
			if(this.record && this.record.$off) {
				this.record.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/info/render/basic.html")
	}, "display");
})();