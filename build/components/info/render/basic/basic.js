
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
	invisibleKeys.randomize_name = true;
	invisibleKeys.modifierstats = true;
	invisibleKeys.modifierattrs = true;
	invisibleKeys.restock_base = true;
	invisibleKeys.restock_max = true;
	invisibleKeys.declaration = true;
	invisibleKeys.description = true;
	invisibleKeys.for_players = true;
	invisibleKeys.master_note = true;
	invisibleKeys.rarity_min = true;
	invisibleKeys.rarity_max = true;
	invisibleKeys.cancontain = true;
	invisibleKeys.properties = true;
	invisibleKeys.condition = true;
	invisibleKeys.singleton = true;
	invisibleKeys.obscured = true;
//	invisibleKeys.playable = true;
	invisibleKeys.universe = true;
	invisibleKeys.playable = true;
	invisibleKeys.dataset = true;
	invisibleKeys.history = true;
	invisibleKeys.widgets = true;
	invisibleKeys.is_shop = true;
	invisibleKeys.linked = true;
	invisibleKeys.owners = true;
	invisibleKeys.parent = true;
	invisibleKeys.hidden = true;
	invisibleKeys.name = true;
	invisibleKeys.icon = true;
	invisibleKeys.data = true;
	invisibleKeys.echo = true;
	invisibleKeys.url = true;
	invisibleKeys.sid = true;
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
			data.calculatedEncumberance = 0;
			data.knowledgeLink = knowledgeLink;
			data.displayRaw = displayRaw;
			data.holdDescription = null;
			data.restocking = false;
			data.description = null;
			data.holdNote = null;
			data.note = null;
			data.profile = null;
			data.image = null;
			data.id = null;

			data.availableTemplates = {};
			data.availableTemplates.entity = [];
			data.copyToHere = "";
			
			data.transfer_targets = [];
			data.transfer_target = "";
			
			data.attach_targets = [];
			data.attach_target = "";
			
			data.locations = [];
			
			data.entities = [];
			data.hiddenEntities = [];
			
			data.partiesPresent = [];
			data.parties = [];
			data.entityToMove = "";
			data.partyToMove = "";
			
			data.keys = [];
			
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
			prettifyValues.skill_check = (record, value) => {
//				console.warn("Recording: ", record, value);
				var buffer = this.universe.indexes.skill.lookup[record.skill_check];
				if(buffer) {
					return buffer.name;
				}
				return value;
			};
			
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value])) {
//					console.log("1Follow: ", follow);
					rsSystem.EventBus.$emit("display-info", follow);
				}
			};

			this.universe.$on("model:modified", this.update);
			if(this.record.$on) {
				this.record.$on("modified", this.update);
			} else {
				console.warn("Record is not listenable? ", this.record);
			}
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"highlight": function() {
				var el = $(this.$el).find(".displayed-id");
				if(el[0]) {
					el[0].select();
					document.execCommand("copy");
					el.css({"background-color": "#63b35d"});
					if (window.getSelection) {
						this.$emit("copying", window.getSelection().toString());
						window.getSelection().removeAllRanges();
					} else if (document.selection) {
						this.$emit("copying", document.selection.toString());
						document.selection.empty();
					}
					setTimeout(function() {
						el.css({"background-color": "transparent"});
					}, 5000);
				}
			},
			"visible": function(key, value) {
				return key && key !== "image" && value !== null && key[0] !== "_" && !invisibleKeys[key] && (!this.record.invisibleProperties || this.record.invisibleProperties.indexOf(key) === -1);
			},
			"isArray": function(value) {
				return value instanceof Array;
			},
			"isOwner": function(record) {
				if(record.owner === this.player.id) {
					return true;
				} else if(record.owners && record.owners.indexOf(this.player.id) !== -1) {
					return true;
				} else if(!record.owner && !(record.owners || record.owners.length === 0)) {
					return true;
				} else {
					return false;
				}
			},
			"canTransfer": function() {
				var hold,
					x;
				
				for(x=0; this.source && this.source.item && x<this.source.item.length; x++) {
					hold = this.universe.indexes.item.index[this.source.item[x]];
					if(hold && hold.item &&  hold.item.indexOf(this.record.id) !== -1) {
						return true;
					} else if(!hold) {
						console.warn("Invalid Item? " + this.source.item[x], hold);
					}
				}
				
				return this.source && ((this.source.item && this.source.item.indexOf(this.record.id) !== -1)
						|| (this.source.inventory && this.source.inventory.indexOf(this.record.id) !== -1));
			},
			"canTransferToSelf": function() {
				return this.source && !((this.source.item && this.source.item.indexOf(this.record.id) !== -1)
						|| (this.source.inventory && this.source.inventory.indexOf(this.record.id) !== -1));
			},
			"canAttach": function() {
				return this.source && (this.record.hardpoints || this.record.contents_max);
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
			"attachObject": function() {
				if(this.attach_target && this.attach_target !== "cancel") {
					this.universe.send("give:item", {
						"source": this.source.id,
						"target": this.record.id,
						"item": this.attach_target
					});
				}
				Vue.set(this, "attach_target", "");
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
			"copyEntityHere": function(id) {
				window.open("/#/nouns/entity/" + id + "?copy=true&values={\"location\":\"" + this.record.id + "\"}", "building");
				Vue.set(this, "copyToHere", "");
			},
			"editRecord": function() {
				window.open(location.pathname + "#/nouns/" + this.record._type + "/" + this.record.id, "building");
			},
			"prettifyReferenceValue": function(reference, property, value) {
				
			},
			"displayInfo": function(record) {
				
			},
			"canTravelTo": function(id) {
				id = id || this.player.entity;
				if(this.record._type === "location" && id && this.universe.indexes.entity.index[id] && this.universe.indexes.entity.index[id].location !== this.record.id) {
					return true;
				}
				return false;
			},
			"travelToHere": function(id) {
				id = id || this.player.entity;
				if(this.universe.indexes.entity.index[id]) {
					this.universe.indexes.entity.index[id].commit({
						"location": this.record.id
					});
				}
			},
			"movePartyHere": function(party) {
				var update = {},
					hold,
					x;
				
				switch(this.record._type) {
					case "entity":
						update.inside = this.record.id;
						break;
					default:
						update[this.record._type] = this.record.id;
				}
				
				party = this.universe.indexes.party.index[party];
				if(party) {
					party.commit(update);
					for(x=0; party.entity && x < party.entity.length; x++) {
						hold = this.universe.indexes.entity.index[party.entity[x]];
						if(hold) {
							hold.commit(update);
						}
					}
				}
				
				Vue.set(this, "partyToMove", "");
			},
			"moveEntityHere": function(entity) {
				var update = {},
					hold,
					x;
				
				switch(this.record._type) {
					case "entity":
						update.inside = this.record.id;
						break;
					default:
						update[this.record._type] = this.record.id;
				}

				
				entity = this.universe.indexes.entity.index[entity];
				if(entity) {
					entity.commit(update);
				}

				Vue.set(this, "entityToMove", "");
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
				var buffer,
					hold,
					map,
					x,
					y;
				
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
						Vue.set(this, "description", this.rsshowdown(this.record.description, this.source, this.base, this.target));
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
				
				this.partiesPresent.splice(0);
				map = {};
				for(x=0; x<this.universe.indexes.party.listing.length; x++) {
					buffer = this.universe.indexes.party.listing[x];
					if(buffer.location === this.record.id) {
						this.partiesPresent.push(buffer);
					}
					if(this.source && buffer.entity && buffer.entity.indexOf(this.source.id) !== -1) {
						for(y=0; y<buffer.entity.length; y++) {
							if(!map[buffer.entity[y]]) {
								map[buffer.entity[y]] = true;
							}
						}
					}
				}

				this.transfer_targets.splice(0);
				this.attach_targets.splice(0);
				if(this.source) {
					
					for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
						buffer = this.universe.indexes.entity.listing[x];
						if(!buffer.obscured && !buffer.mob && !buffer.template && buffer.id !== this.source.id && ((buffer.location && buffer.location === this.source.location) || (buffer.inside && buffer.inside === this.source.inside) || map[buffer.id])) {
							this.transfer_targets.push(buffer);
						}
					}
					this.transfer_targets.sort(byName);
					
					if(this.record.hardpoints || this.record.contents_max) {
						for(x=0; this.source.item && x<this.source.item.length; x++) {
							buffer = this.universe.indexes.item.lookup[this.source.item[x]];
							if(this.record.cancontain && this.record.cancontain.length) {
								if(buffer.itemtype && buffer.itemtype.length) {
									hold = true;
									for(y=0; hold && y<buffer.itemtype.length; y++) {
										if(this.record.cancontain.indexOf(buffer.itemtype[y]) !== -1) {
											this.attach_targets.push(buffer);
											hold = false;
										}
									}
								}
							} else {
								this.attach_targets.push(buffer);
							}
						}
					}
					this.attach_targets.sort(byName);
				}
				
				this.availableTemplates.entity.splice(0);
				this.hiddenEntities.splice(0);
				this.entities.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					if(this.record._type === "location" && this.universe.indexes.entity.listing[x].template) {
						this.availableTemplates.entity.push(this.universe.indexes.entity.listing[x]);
					}
					if(this.universe.indexes.entity.listing[x].location === this.record.id || this.universe.indexes.entity.listing[x].inside === this.record.id) {
						if(this.universe.indexes.entity.listing[x].hidden || this.universe.indexes.entity.listing[x].obscured) {
							this.hiddenEntities.push(this.universe.indexes.entity.listing[x]);
						} else {
							this.entities.push(this.universe.indexes.entity.listing[x]);
						}
					}
				}
				
				hold = 0;
				if(this.record.item && this.record.item.length) {
					for(x=0; x<this.record.item.length; x++) {
						buffer = this.universe.indexes.item.lookup[this.record.item[x]];
						if(buffer) {
							hold += parseInt(buffer.encumberance) || 0;
						} else {
							console.warn({
								"message": "Invalid item in record",
								"record": this.record,
								"item": this.record.item[x]
							});
						}
					}
					Vue.set(this, "calculatedEncumberance", hold);
				}
				
				this.parties.splice(0);
				for(x=0; x<this.universe.indexes.party.listing.length; x++) {
					if(this.universe.indexes.party.listing[x].active) {
						this.parties.push(this.universe.indexes.party.listing[x]);
					}
				}
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
//			console.log("Finishing");
			this.universe.$off("model:modified", this.update);
			if(this.record && this.record.$off) {
				this.record.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/info/render/basic.html")
	}, "display");
})();