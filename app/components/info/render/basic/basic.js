
/**
 * 
 * 
 * @class rsObjectInfoBasic
 * @constructor
 * @module Components
 */
(function() {
	
	var invisibleKeys = {},
		referenceKeys = {};

	invisibleKeys.property = true;
	invisibleKeys.enhancementKey= true;
	invisibleKeys.propertyKey = true;
	invisibleKeys.bonusKey= true;

	invisibleKeys.randomize_name_spacing = true;
	invisibleKeys.randomize_name_dataset = true;
	invisibleKeys.randomize_name_prefix = true;
	invisibleKeys.randomize_name_suffix = true;
	invisibleKeys.randomize_name = true;
	
	invisibleKeys.information_renderer = true;
	invisibleKeys.invisibleProperties = true;
	invisibleKeys.locked_attunement = true;
	invisibleKeys.source_template = true;
	invisibleKeys.path_exception = true;
	invisibleKeys.known_objects = true;
	invisibleKeys.modifierstats = true;
	invisibleKeys.modifierattrs = true;
	invisibleKeys.no_modifiers = true;
	invisibleKeys.restock_base = true;
	invisibleKeys.render_name = true;
	invisibleKeys.restock_max = true;
	invisibleKeys.declaration = true;
	invisibleKeys.description = true;
	invisibleKeys.for_players = true;
	invisibleKeys.master_note = true;
	invisibleKeys.rarity_min = true;
	invisibleKeys.rarity_max = true;
	invisibleKeys.cancontain = true;
	invisibleKeys.properties = true;
//	invisibleKeys.indicators = true;
	invisibleKeys.suppressed = true;
	invisibleKeys.no_border = true;
	invisibleKeys.condition = true;
	invisibleKeys.exception = true;
	invisibleKeys.singleton = true;
	invisibleKeys.equipped = true;
	invisibleKeys.obscured = true;
	invisibleKeys.property = true;
	invisibleKeys.universe = true;
	invisibleKeys.playable = true;
	invisibleKeys.created = true;
	invisibleKeys.dataset = true;
	invisibleKeys.history = true;
	invisibleKeys.learned = true;
	invisibleKeys.updated = true;
	invisibleKeys.widgets = true;
	invisibleKeys.is_shop = true;
	invisibleKeys.no_rank = true;
	invisibleKeys.alters = true;
	invisibleKeys.linked = true;
	invisibleKeys.owners = true;
	invisibleKeys.parent = true;
	invisibleKeys.hidden = true;
	invisibleKeys.screen = true;
	invisibleKeys.class = true;
	invisibleKeys.order = true;
	invisibleKeys.name = true;
	invisibleKeys.icon = true;
	invisibleKeys.data = true;
	invisibleKeys.echo = true;
	invisibleKeys.url = true;
	invisibleKeys.sid = true;
	invisibleKeys.id = true;
	invisibleKeys.x = true;
	invisibleKeys.y = true;

	invisibleKeys.label_shadow_color = true;
	invisibleKeys.label_shadow_blur = true;
	invisibleKeys.label_shadow = true;
	invisibleKeys.label_shadow = true;
	invisibleKeys.label_thickness = true;
	invisibleKeys.fill_thickness = true;
	invisibleKeys.label_opacity = true;
	invisibleKeys.fill_opacity = true;
	invisibleKeys.label_color = true;
	invisibleKeys.fill_color = true;
	invisibleKeys.thickness = true;
	invisibleKeys.clickable = true;
	invisibleKeys.show_name = true;
	invisibleKeys.contained = true;
	invisibleKeys.must_know = true;
	invisibleKeys.has_path = true;
	invisibleKeys.pathing = true;
	invisibleKeys.opacity = true;
	invisibleKeys.values = true;
	invisibleKeys.curved = true;
	invisibleKeys.pathed = true;
	invisibleKeys.color = true;
	invisibleKeys.path = true;
	
	invisibleKeys.coordinates = true;
	invisibleKeys.shown_at = true;
	invisibleKeys.profile = true;
	invisibleKeys.showing = true;
	invisibleKeys.viewed = true;
	invisibleKeys.map = true;
	
	referenceKeys.requires_ability = "ability";
	referenceKeys.requires_knowledge = "knowledge";
	referenceKeys.archetypes = "archetype";
	referenceKeys.slot_usage = "slot";
	
	var prettifyValues = {};
	var prettifyNames = {};
	var knowledgeLink = {};
	var displayRaw = {};

	prettifyNames.slot_usages = "Slots Used";
	prettifyNames.dependency = "Dependencies";
	prettifyNames.itemtype = "Item Types";
	prettifyNames.xp_cost = "XP";
	prettifyNames.entity = function(value, record) {
		if(record._type === "entity") {
			return "Pilot";
		} else {
			return value;
		}
	};
	
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
	
	prettifyValues.category = function(property, value, record, universe) {
		var index;
		if(value && (index = value.indexOf(":")) !== -1) {
			value = value.substring(0, index).trim().capitalize() + " (" + value.substring(index + 1).trim().capitalize() + ")";
		}
		return value;
	};
	
	prettifyValues.date = function(property, value) {
		value = new Date(value);
		return value.toDateString();
	};
	
	prettifyValues.related = function(property, value, record, universe) {
		return "to " + (value?value.length:0) + " records";
	};
	
	prettifyValues.range = function(property, value, record, universe) {
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
	
	prettifyValues.activation = function(property, value, record, universe) {
		if(value) {
			return value.capitalize();
		}
		return "None";
	};
	
	prettifyValues.archetypes = function(property, value, record, universe) {
		
	};
	
	prettifyValues.dependency = function(property, value, record, universe) {
		
	};
	
	prettifyValues.piloting = function(property, value, record, universe) {
		if(universe.indexes.entity.index[value]) {
			return universe.indexes.entity.index[value].name;
		}
		return value;
	};
	
	prettifyValues.editor = function(property, value, record, universe) {
		if(universe.indexes.entity.index[value]) {
			return universe.indexes.entity.index[value].name;
		}
		return value;
	};
	
	prettifyValues.allegiance = function(property, value, record, universe) {
		return "<span class=\"" + value + "\"></span>";
	};
	
	prettifyValues.inside = function(property, value, record, universe) {
		var entity = universe.indexes.entity.lookup[value];
		if(entity) {
			return "<a data-id=\"" + value + "\"><span class=\"" + entity.icon + "\" data-id=\"" + value + "\"></span><span data-id=\"" + value + "\">" + entity.name + "</span></a>";
		}
		return "Unknown[" + value + "]";
	};
	
	prettifyValues.accepts = function(property, value, record, universe) {
		if(value) {
			switch(value) {
				case "entity":
					return "Character or Ship";
				default:
					return value.capitalize();
			}
		}
		return value;
	};
	
	prettifyValues.skill_check = function(property, value, record, universe) {
		if(!value || !universe.indexes.skill || !universe.indexes.skill.lookup) {
			return value;
		}
		
		var buffer = universe.indexes.skill.lookup[value] || universe.indexes.skill.lookup["skill:" + value];
		if(!buffer) {
			return value;
		}
		
		return buffer.name;
	};
	
	prettifyValues.indicators = function(property, value, record, universe) {
		if(value && value.length) {
			if(value.length < 10) {
				return value.join(", ");
			} else {
				value = [].concat(value).splice(0, 10);
				value.push("...");
				return value.join(", ");
			}
		}
		return "";
	};
	
	var prettifyPropertyPattern = /_([a-z])/ig, 
		prettifyPropertyName = function(full, match) {
			return " " + match.capitalize();
		};
	
	rsSystem.component("rsObjectInfoBasic", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSShowdown
		],
		"props": {
			"record": {
				"required": true,
				"type": Object
			},
			"universe": {
				"required": true,
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
			
			data.referenceKeys = referenceKeys;
			
			data.collapsed = true;
			data.relatedError = null;
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
			
			data.movableEntities = [];
			data.movingEntity = "";
			
			data.availableSlots = [];
			data.equipToSlot = "";
			
			data.partiesPresent = [];
			data.parties = [];
			data.entityToMove = "";
			data.partyToMove = "";
			
			data.equipped = [];
			
			data.relatedKnowledge = [];
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
//			this.$el.onclick = (event) => {
//				var follow = event.srcElement.attributes.getNamedItem("data-id");
//				if(follow && (follow = this.universe.index.index[follow.value])) {
////					console.log("1Follow: ", follow);
//					rsSystem.EventBus.$emit("display-info", follow);
//				}
//			};

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
				var el = $(this.$el).find(".displayed-id"),
					text;
				if(el[0]) {
					el[0].select();
					document.execCommand("copy");
					el.css({"background-color": "#63b35d"});
					if (window.getSelection) {
						text = window.getSelection().toString();
						window.getSelection().removeAllRanges();
					} else if (document.selection) {
						text = document.selection.toString();
						document.selection.empty();
					}
					
					if(text) {
						rsSystem.EventBus.$emit("copied-id", text);
						this.$emit("copying", text);
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
			"hasLearnDependencies": function() {
				switch(this.record._type) {
					case "ability":
						return (!this.record.requires_ability || !this.record.requires_ability.length || this.hasMapped("ability", this.record.requires_ability, this.record.dependency_type)) &&
								(!this.record.requires_knowledge || !this.record.requires_knowledge.length || this.hasMapped("knowledge", this.record.requires_knowledge, this.record.dependency_type)) &&
								(!this.record.archetypes || !this.record.archetypes.length || this.hasMapped("archetype", this.record.archetypes));
				}
				
				return false;
			},
			"classByXP": function(cost) {
				var x;
				
				if(this.base && this.base.xp && this.base.xp >= cost) {
					return "meets-requirements";
				}
				
				if(this.record.archetypes && this.record.archetypes.length) {
					if(!this.base.archetype) {
						return "requirements";
					}
					for(x=0; x<this.record.archetypes.length; x++) {
						if(this.base.archetype.indexOf(this.record.archetypes[x]) !== -1) {
							return "meets-requirements";
						}
					}
				}
				
				return "requirements";
			},
			"classByRequirements": function() {
				var buffer,
					x;
				
				if(this.base) {
					if(this.base.ability) {
						for(x=0; x<this.base.ability.length; x++) {
							buffer = this.universe.indexes.ability.index[this.base.ability[x]];
							if(buffer) {
								if(buffer.requires_ability && buffer.requires_ability.indexOf(this.record.id) !== -1) {
									return "requirements";
								}
							} else {
								console.warn("Requirement for Missing Ability[" + this.base.ability[x] + "] in Record[" + this.record.id + "]");
							}
						}
					}
					if(this.base.knowledge) {
						for(x=0; x<this.base.knowledge.length; x++) {
							buffer = this.universe.indexes.knowledge.index[this.base.knowledge[x]];
							if(buffer) {
								if(buffer.requires_knowledge && buffer.requires_knowledge.indexOf(this.record.id) !== -1) {
									return "requirements";
								}
							} else {
								console.warn("Requirement for Missing Knowledge[" + this.base.knowledge[x] + "] in Record[" + this.record.id + "]");
							}
						}
					}
				}
				
				return "meets-requirements";
			},
			"canForgetAbility": function() {
				return !this.record.locked_ability && this.hasLearnedAbility(); // Dependency requirements in classByRequirements
			},
			"hasMapped": function(reference, needs, type) {
				var meets = 0,
					x;
				if(reference && needs && this.base && this.base[reference] && this.base[reference].length) {
					for(x=0; x<this.base[reference].length; x++) {
						if(needs.indexOf(this.base[reference][x]) !== -1) {
							if(type === "any" || !type) {
								return true;
							} else {
								meets++;
							}
						}
					}
				}
				
				if(meets === needs.length) {
					return true;
				}
				
				return false;
			},
			"canLearnAbility": function() {
				return !this.record.locked_ability && this.base && this.player && (this.player.master || this.base.owner === this.player.id || (this.base.owners && this.base.owners.indexOf(this.player.id) !== -1)) &&
						this.record._type === "ability" && !this.hasLearnedAbility() && this.hasLearnDependencies();
			},
			"hasLearnedAbility": function() {
				return this.record && this.base && this.base.ability && this.base.ability.indexOf(this.record.id) !== -1;
			},
			"learnAbility": function() {
				if(!this.record.locked_ability) {
					var cost = parseInt(this.record.xp_cost) || 0,
						abilities,
						index;
					
					if(this.base && this.classByXP(cost) === "meets-requirements") {
						abilities = this.base.ability || [];
						index = abilities.indexOf(this.record.id);
						if(index === -1) {
							index = parseInt(this.base.xp - cost);
							this.base.commit({
								"ability": abilities.concat(this.record.id),
								"xp": index
							});
						}
					}
				}
			},
			"forgetAbility": function() {
				if(!this.record.locked_ability) {
					var cost = parseInt(this.record.xp_cost) || 0,
						abilities,
						index;
					
					if(this.base && this.classByRequirements() === "meets-requirements") {
						abilities = this.base.ability || [];
						index = abilities.indexOf(this.record.id);
						if(index !== -1) {
							abilities.splice(index, 1);
							index = parseInt(this.base.xp + cost);
							this.base.commit({
								"ability": abilities,
								"xp": index
							});
						}
					}
				}
			},
			"canTransfer": function() {
				var hold,
					x;
				
				if(this.record.untradable) {
					return false;
				}
				
				for(x=0; this.base && this.base.item && x<this.base.item.length; x++) {
					hold = this.universe.indexes.item.index[this.base.item[x]];
					if(hold && hold.item &&  hold.item.indexOf(this.record.id) !== -1) {
						return true;
					} else if(!hold) {
						console.warn("Invalid Item? " + this.base.item[x], hold);
					}
				}
				
				return this.base && ((this.base.item && this.base.item.indexOf(this.record.id) !== -1)
						|| (this.base.inventory && this.base.inventory.indexOf(this.record.id) !== -1));
			},
			"canTransferToSelf": function() {
				return this.base && !((this.base.item && this.base.item.indexOf(this.record.id) !== -1)
						|| (this.base.inventory && this.base.inventory.indexOf(this.record.id) !== -1));
			},
			"canAttach": function() {
				return this.base && (this.record.hardpoints || this.record.contents_max);
			},
			"canUnequip": function() {
				if(this.target) {
					if(this.base
							&& this.target._type === "slot"
							&& this.base.equipped
							&& this.base.equipped[this.target.accepts]
							&& this.base.equipped[this.target.accepts][this.target.id]
							&& this.base.equipped[this.target.accepts][this.target.id].indexOf(this.record.id) !== -1) {
						return this.target;
					}
				} else {
					if(this.base
							&& this.base.slot
							&& this.base.slot.length
							&& this.base.item
							&& this.base.item.indexOf(this.record.id) !== -1
							&& this.availableSlots.length) {
						for(var x=0; x<this.availableSlots.length; x++) {
							if(this.base.equipped && this.base.equipped[this.availableSlots[x].accepts] && this.base.equipped[this.availableSlots[x].accepts][this.availableSlots[x].id] && this.base.equipped[this.availableSlots[x].accepts][this.availableSlots[x].id].indexOf(this.record.id) !== -1) {
								return this.availableSlots[x];
							}
						}
					}
				}

				return false;
			},
			"unequip": function() {
				var slot = this.canUnequip();
				if(slot && this.base) {
					this.base.unequipSlot(slot, this.record);
				}
			},
			"canEquip": function() {
				if(this.base
						&& this.base.slot
						&& this.base.slot.length
						&& this.base.item
						&& this.base.item.indexOf(this.record.id) !== -1
						&& this.availableSlots.length) {
					for(var x=0; x<this.availableSlots.length; x++) {
						if(this.base.equipped && this.base.equipped[this.availableSlots[x].accepts] && this.base.equipped[this.availableSlots[x].accepts][this.availableSlots[x].id] && this.base.equipped[this.availableSlots[x].accepts][this.availableSlots[x].id].indexOf(this.record.id) !== -1) {
							return false;
						}
					}
					return true;
				} else {
					return false;
				}
			},
			"equip": function(slot) {
				if(slot && slot !== "cancel") {
					this.base.equipSlot(slot, this.record);
				}
				Vue.set(this, "equipToSlot", "");
			},
			"transferObject": function() {
				if(this.transfer_target && this.transfer_target !== "cancel") {
					this.universe.send("give:item", {
						"source": this.base.id,
						"target": this.transfer_target,
						"item": this.record.id
					});
				}
				Vue.set(this, "transfer_target", "");
			},
			"attachObject": function() {
				if(this.attach_target && this.attach_target !== "cancel") {
					this.universe.send("give:item", {
						"source": this.base.id,
						"target": this.record.id,
						"item": this.attach_target
					});
				}
				Vue.set(this, "attach_target", "");
			},
			"setCurrentSession": function() {
				if(this.universe.indexes.setting.index["setting:current:session"]) {
					this.universe.indexes.setting.index["setting:current:session"].commit({
						"value": this.record.id
					});
				}
			},
			"hideRecord": function() {
				this.record.commit({
					"hidden": this.record.hidden?false:true
				});
			},
			"obscureRecord": function() {
				this.record.commit({
					"obscured": this.record.obscured?false:true
				});
			},
			"knownRecord": function() {
				this.record.commit({
					"must_know": this.record.must_know?false:true
				});
			},
			"screenRecord": function() {
				this.record.commit({
					"screen": this.record.screen?false:true
				});
			},
			"prettifyKey": function(key) {
			},
			"prettifyPropertyName": function(property, record) {
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
							return prettifyNames[property](property, record, this.universe);
					}
				}

				return property.replace(prettifyPropertyPattern, prettifyPropertyName).capitalize();
			},
			"prettifyPropertyValue": function(property, value, record, universe) {
				var suffix = "",
					buffer;
				
				if(this.record._calculated && this.record._calculated[property]) {
					buffer = this.universe.calculateExpression(value, this.record, this.base, this.target);
//					console.warn("Display: ", property, value, this.universe.calculateExpression(value, this.record, this.base, this.target));
					if(buffer != value) {
						suffix = " [ " + value + " ]";
						value = buffer;
					}
				}
				
				switch(typeof(this.record._prettifyValue)) {
					case "function":
						value = this.record._prettifyValue(property, value, record, universe || this.universe);
						break;
					case "object":
						if(this.record._prettifyValue[property]) {
							value = this.record._prettifyValue[property] ;
						}
						break;
				}
				
				if(prettifyValues[property]) {
					switch(typeof(prettifyValues[property])) {
						case "string":
							value = prettifyValues[property];
							break;
						case "function":
							value = prettifyValues[property](property, value, record, universe || this.universe);
							break;
					}
				}
				
				if(value instanceof Array) {
					
				} else {
					switch(typeof(value)) {
						case "object":
							value = (value.hidden_name || value.name || value.id || value.description);
						default:
							if(this.universe.indexes[property]) {
								
							}
					}
				}
				
				return value + suffix;
			},
			"copyEntityHere": function(id) {
				window.open("/#/nouns/entity/" + id + "?copy=true&values={\"location\":\"" + this.record.id + "\"}", "building");
				Vue.set(this, "copyToHere", "");
			},
			"prettifyReferenceValue": function(reference, property, value) {
				
			},
			"displayInfo": function(record) {
				
			},
			"canDashboard": function() {
				return (this.record._type === "entity" && this.record.classification && this.isOwner(this.record));
			},
			"viewDashboard": function(new_window, stay) {
				var new_location = location.pathname + "#/dashboard/" + this.record.classification + "/" + this.record.id;
				if(new_window) {
					window.open(new_location);
					if(stay) {
						window.focus();
					}
				} else {
					window.location = new_location;
				}
			},
			"canMoveTo": function(id) {
				id = id || this.player.entity;
				if((this.record._type === "location" || (this.record._type === "entity" && this.record.classification !== "character")) && id
						&& this.universe.indexes.entity.index[id]) {
					return true;
				}
				return false;
			},
			"canTravelTo": function(id) {
				id = id || this.player.entity;
				if((this.record._type === "location" || (this.record._type === "entity" && this.record.classification !== "character")) && id
						&& this.universe.indexes.entity.index[id]
						&& this.universe.indexes.entity.index[id].location !== this.record.id
						&& this.universe.indexes.entity.index[id].inside !== this.record.id) {
					return true;
				}
				return false;
			},
			"travelToHere": function(id) {
				id = id || this.player.entity;
				if(this.canTravelTo(id)) {
					this.universe.indexes.entity.index[id].commit({
						"location": this.record.id
					});
				}
			},
			"editRecord": function(new_window, stay) {
				var new_location = location.pathname + "#/nouns/" + this.record._type + "/" + this.record.id;
				if(new_window) {
					window.open(new_location, "building");
					if(stay) {
						window.focus();
					}
				} else {
					window.location = new_location;
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
				Vue.set(this, "movingEntity", "");
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
			"showDirectProperties": function() {
				return !this.record.hide_properties && !this.record.hide_stats;
			},
			"showInheritRelations": function() {
				return !this.record.hide_relations && !this.record.hide_stats;
			},
			"update": function() {
				var buffer,
					hold,
					slot,
					map,
					x,
					y,
					z;
				
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
					Vue.set(this, "description", this.rsshowdown(this.record.description, this.record, this.base, this.target));
//					if(this.holdDescription !== this.record.description) {
//						Vue.set(this, "holdDescription", this.record.description);
//						Vue.set(this, "description", this.rsshowdown(this.record.description, this.record, this.base, this.target));
//					}
				} else {
					Vue.set(this, "holdDescription", null);
					Vue.set(this, "description", null);
				}
				
				if(this.record.master_note) {
					if(this.holdNote !== this.record.master_note) {
						Vue.set(this, "holdNote", this.record.master_note);
						Vue.set(this, "note", this.rsshowdown(this.record.master_note, this.record, this.base));
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
				if(this.record.name && this.record.label && this.record.name === this.record.label) {
					this.keys.splice(this.keys.indexOf("label"), 1);
				}
				
				this.partiesPresent.splice(0);
				map = {};
				for(x=0; x<this.universe.indexes.party.listing.length; x++) {
					buffer = this.universe.indexes.party.listing[x];
					if(buffer.location === this.record.id) {
						this.partiesPresent.push(buffer);
					}
					if(this.base && buffer.entity && buffer.entity.indexOf(this.base.id) !== -1) {
						for(y=0; y<buffer.entity.length; y++) {
							if(!map[buffer.entity[y]]) {
								map[buffer.entity[y]] = true;
							}
						}
					}
				}

				this.transfer_targets.splice(0);
				this.attach_targets.splice(0);
				if(this.base) {
					if(this.base.inside) {
						map[this.base.inside] = true;
					}
					for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
						buffer = this.universe.indexes.entity.listing[x];
						if(!buffer.obscured && !buffer.mob && !buffer.template && buffer.id !== this.base.id && (buffer.location === this.base.location || buffer.inside === this.base.inside || buffer.id === this.base.inside || buffer.inside === this.base.id || buffer.entity === this.base.id || buffer.id === this.base.entity || map[buffer.id])) {
							this.transfer_targets.push(buffer);
						}
					}
					this.transfer_targets.sort(byName);
					
					if(this.record.hardpoints || this.record.contents_max) {
						for(x=0; this.base.item && x<this.base.item.length; x++) {
							buffer = this.universe.indexes.item.lookup[this.base.item[x]];
							if(buffer.id !== this.record.id && !buffer.untradable) {
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
					}
					this.attach_targets.sort(byName);
				}
				
				buffer = this.player?this.player.id:null;
				this.availableTemplates.entity.splice(0);
				this.movableEntities.splice(0);
				this.hiddenEntities.splice(0);
				this.entities.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					if(((!this.universe.indexes.entity.listing[x].owners && !this.universe.indexes.entity.listing[x].owner)
							|| (this.universe.indexes.entity.listing[x].owners && this.universe.indexes.entity.listing[x].owners.indexOf(buffer) !== -1)
							|| this.universe.indexes.entity.listing[x].owner === buffer)
							&& this.universe.indexes.entity.listing[x].location !== this.record.id
							&& this.universe.indexes.entity.listing[x].inside !== this.record.id){
						this.movableEntities.push(this.universe.indexes.entity.listing[x]);
					}
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
				
				this.availableSlots.splice(0);
				if(this.base && this.base.slot && this.base.slot.length) {
					for(x=0; x<this.base.slot.length; x++) {
						hold = this.universe.indexes.slot.lookup[this.base.slot[x]];
						if(hold && hold.accepts === this.record._type && this.availableSlots.indexOf(hold) === -1 && ((!hold.itemtype) || (this.record.itemtype && this.sharesOne(hold.itemtype, this.record.itemtype)))) {
							this.availableSlots.push(hold);
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
				
				this.relatedKnowledge.splice(0);
				if(this.base && this.base.knowledge) {
					for(x=0; x<this.base.knowledge.length; x++) {
						if((buffer = this.universe.indexes.knowledge.lookup[this.base.knowledge[x]]) && buffer.related && buffer.related.indexOf(this.record.id) !== -1) {
							this.relatedKnowledge.push(buffer);
						}
					}
				}
				
				this.equipped.splice(0);
				if(this.record.equipped) {
					buffer = Object.keys(this.record.equipped);
					for(x=0; x<buffer.length; x++) {
						map = Object.keys(this.record.equipped[buffer[x]]);
						for(y=0; y<map.length; y++) {
							slot = this.universe.indexes.slot.lookup[map[y]];
							if(slot && this.record.equipped[buffer[x]][slot.id] && this.record.equipped[buffer[x]][slot.id].length) {
								for(z=0; z<this.record.equipped[buffer[x]][slot.id].length; z++) {
									if(hold = this.universe.index.lookup[this.record.equipped[buffer[x]][slot.id][z]]) {
										this.equipped.push([slot,hold]);
									}
								}
							}
						}
					}
				}
				
				if(this.base && this.base._relatedErrors && this.base._relatedErrors[this.record.id]) {
					Vue.set(this, "relatedError", this.rsshowdown(this.base._relatedErrors[this.record.id].message || this.base._relatedErrors[this.record.id], this.record, this.base, this.target));
				} else {
					Vue.set(this, "relatedError", null);
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