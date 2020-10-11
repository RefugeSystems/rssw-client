
/**
 *
 *
 * @class rsObjectInfoBasic
 * @constructor
 * @module Components
 */
(function() {

	var invisibleKeys = {},
		referenceKeys = {},

		shownLength = 7;

	// TODO: Track down bug putting this into the list
	invisibleKeys.types = true;

	invisibleKeys.property = true;
	invisibleKeys.enhancementKey= true;
	invisibleKeys.propertyKey = true;
	invisibleKeys.bonusKey= true;

	invisibleKeys["_delta"] = true;
	invisibleKeys["+delta"] = true;
	invisibleKeys["-delta"] = true;
	invisibleKeys["delta"] = true;

	invisibleKeys.randomize_name_spacing = true;
	invisibleKeys.randomize_name_dataset = true;
	invisibleKeys.randomize_name_prefix = true;
	invisibleKeys.randomize_name_suffix = true;
	invisibleKeys.randomize_name = true;

	invisibleKeys.information_renderer = true;
	invisibleKeys.auto_nearby_children = true;
	invisibleKeys.invisibleProperties = true;
	invisibleKeys.locked_attunement = true;
	invisibleKeys.source_template = true;
	invisibleKeys.path_exception = true;
	invisibleKeys.known_objects = true;
	invisibleKeys.modifierstats = true;
	invisibleKeys.modifierattrs = true;
	invisibleKeys.map_distance = true;
	invisibleKeys.no_modifiers = true;
	invisibleKeys.render_name = true;
	invisibleKeys.auto_nearby = true;
	invisibleKeys.restock_max = true;
	invisibleKeys.declaration = true;
	invisibleKeys.description = true;
	invisibleKeys.for_players = true;
	invisibleKeys.master_note = true;
	invisibleKeys.background = true;
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
	invisibleKeys.maneuver = true;
	invisibleKeys.passcode = true;
	invisibleKeys.property = true;
	invisibleKeys.universe = true;
	invisibleKeys.playable = true;
	invisibleKeys.created = true;
	invisibleKeys.dataset = true;
	invisibleKeys.history = true;
	invisibleKeys.learned = true;
	invisibleKeys.updated = true;
	invisibleKeys.widgets = true;
	invisibleKeys.no_rank = true;
	invisibleKeys.alters = true;
	invisibleKeys.linked = true;
	invisibleKeys.loaded = true;
	invisibleKeys.owners = true;
	invisibleKeys.parent = true;
	invisibleKeys.hidden = true;
	invisibleKeys.screen = true;
	invisibleKeys.class = true;
	invisibleKeys.label = true;
	invisibleKeys.state = true;
	invisibleKeys.order = true;
	invisibleKeys.name = true;
	invisibleKeys.icon = true;
	invisibleKeys.data = true;
	invisibleKeys.dice = true;
	invisibleKeys.echo = true;
	invisibleKeys.url = true;
	invisibleKeys.sid = true;
	invisibleKeys.id = true;
	invisibleKeys.x = true;
	invisibleKeys.y = true;

	invisibleKeys.wounds_start = true;
	invisibleKeys.strain_start = true;
	invisibleKeys.xp_start = true;

	invisibleKeys.is_hostile= true;
	invisibleKeys.is_public = true;
	invisibleKeys.is_shop = true;

	invisibleKeys.rarity_inverted = true;
	invisibleKeys.restock_clear = true;
	invisibleKeys.restock_base = true;
	invisibleKeys.restock_max = true;
	invisibleKeys.rarity_mean = true;
	invisibleKeys.rarity_min = true;
	invisibleKeys.rarity_max = true;

	invisibleKeys.label_shadow_color = true;
	invisibleKeys.label_shadow_blur = true;
	invisibleKeys.label_shadow = true;
	invisibleKeys.label_shadow = true;
	invisibleKeys.label_thickness = true;
	invisibleKeys.fill_thickness = true;
	invisibleKeys.locked_ability = true;
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
	invisibleKeys.active = true;
	invisibleKeys.curved = true;
	invisibleKeys.pathed = true;
	invisibleKeys.values = true;
	invisibleKeys.color = true;
	invisibleKeys.path = true;

	invisibleKeys.coordinates = true;
	invisibleKeys.shown_at = true;
	invisibleKeys.profile = true;
	invisibleKeys.showing = true;
	invisibleKeys.viewed = true;
	invisibleKeys.map = true;

	referenceKeys.ship_active_abilities = "ability";
	referenceKeys.requires_knowledge = "knowledge";
	referenceKeys.requires_ability = "ability";
	referenceKeys.archetypes = "archetype";
	referenceKeys.slot_usage = "slot";
	referenceKeys.involved = "entity";
	referenceKeys.members = "entity";
	referenceKeys.soldtypes = "type";
	referenceKeys.locals = "entity";
	referenceKeys.mentioned = "all";

	var cssClassBreaking = /[^a-zA-Z]/g;
	var spaceBreaks = /[ _-]/;
	var prettifyValues = {};
	var prettifyNames = {};
	var knowledgeLink = {};
	var displayRaw = {};

	prettifyNames.mentioned = "Mentions";
	prettifyNames.slot_usages = "Slots Used";
	prettifyNames.dependency = "Dependencies";
	prettifyNames.itemtype = "Item Types";
	prettifyNames.xp_cost = "XP";
	prettifyNames.slowfire = "Slow Fire";
	prettifyNames.autofire = "Auto-Fire";
	prettifyNames.stundamage = "Stun Damage";
	prettifyNames.limitedammo = "Limited Ammo";
	prettifyNames.soldtypes = "Sold Types";
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

	knowledgeLink.accurate = "ability:quality:accurate";
	knowledgeLink.pierce = "ability:quality:pierce";
	knowledgeLink.critical = "ability:quality:critical";
	knowledgeLink.slowfire = "ability:quality:slowfire";
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

	prettifyValues.size = function(property, value, record, universe) {
		if(!value) {
			return "";
		}
		if(typeof(value) !== "string") {
			return value;
		}

		var buffer = value.split(spaceBreaks),
			x;

		value = "";
		for(x=0; x<buffer.length; x++) {
			if(value) {
				value += " " + buffer[x].capitalize();
			} else {
				value = buffer[x].capitalize();
			}
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
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSMasterControls,
			rsSystem.components.RSShopControls,
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
			data.calculated = {};
			data.holdNote = null;
			data.profile = null;
			data.image = null;
			data.note = null;
			data.id = null;

			data.showDistribution = false;
			data.showContributions = {};

			data.availableTemplates = {};
			data.availableTemplates.entity = [];
			data.availableEntities = [];
			data.eventToReference = "";
			data.copyToEntity = "";
			data.partyToAdd = "";
			data.copyToHere = "";

			data.transfer_targets = [];
			data.transfer_target = "";

			data.attach_targets = [];
			data.attach_target = "";

			data.shownLocations = [];
			data.locations = [];

			data.shownEntities = [];
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

			data.activeEvents = [];

			data.equipped = [];

			data.relatedKnowledge = [];
			data.keys = [];

			return data;
		},
		"watch": {
			"record": {
				"deep": true,
				"handler": function() {
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
				return key && value !== undefined && value !== null && value !== "" && key !== "image" && key[0] !== "_" && !invisibleKeys[key] && (!this.record.invisibleProperties || this.record.invisibleProperties.indexOf(key) === -1);
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
				return !this.record.locked_ability &&
						this.base && this.player &&
						(this.player.master || this.base.owner === this.player.id || (this.base.owners && this.base.owners.indexOf(this.player.id) !== -1)) &&
						(this.record._type === "ability" || this.record._class === "ability") &&
						!this.hasLearnedAbility() &&
						this.hasLearnDependencies();
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
			"activateRecord": function() {
				this.record.commit({
					"active": this.record.active?false:true
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
				var buffer;

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

				if(property.startsWith("skill_amend_")) {
					buffer = this.universe.indexes.skill.index["skill:" + property.substring(12)];
					if(buffer) {
						return buffer.name + " Bonus";
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
			"toClassName": function(property) {
				return "property-" + property.replace(cssClassBreaking, "-");
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
			"viewShopInventory": function() {
				var new_location = location.pathname + "#/shop/" + this.record.id;
				if(this.base) {
					window.location = new_location + "/" + this.base.id;
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
			"addMeasurePoint": function(point) {
				rsSystem.EventBus.$emit("measure-point", point || this.record);
			},
			"restockLocation": function() {
				if(!this.restocking) {
					Vue.set(this, "restocking", true);

					// this.universe.send("location:restock", {
					// 	"id": this.record.id
					// });
					this.restockShop(this.record);

					setTimeout(() => {
						Vue.set(this, "restocking", false);
					}, 1000);
				}
			},
			"openCombatEvent": function(new_window, stay) {
				var new_location = location.pathname.replace("?", "") + "#/combat/" + this.record.id;
				if(new_window) {
					window.open(new_location, "event");
					if(stay) {
						window.focus();
					}
				} else {
					window.location = new_location;
				}
			},
			"showDirectProperties": function() {
				return !this.record.hide_properties && !this.record.hide_stats;
			},
			"showInheritRelations": function() {
				return !this.record.hide_relations && !this.record.hide_stats;
			},
			"amendEventWithParty": function(partyToAdd) {
				Vue.set(this, "partyToAdd", "");
				partyToAdd = this.universe.indexes.party.index[partyToAdd];
				console.log("Adding Party: ", partyToAdd);
				this.record.commitAdditions({
					"involved": partyToAdd.entity
				});
			},
			"addEntityToEvent": function(eventToReference) {
				Vue.set(this, "eventToReference", "");
				eventToReference = this.universe.indexes.event.index[eventToReference];
				eventToReference.commitAdditions({
					"involved": this.id
				});
			},
			"showAllLocations": function() {
				this.shownLocations.splice(0);
				for(var x=0; x<this.locations.length; x++) {
					this.shownLocations.push(this.locations[x]);
				}
			},
			"showAllEntities": function() {
				this.shownEntities.splice(0);
				for(var x=0; x<this.entities.length; x++) {
					this.shownEntities.push(this.entities[x]);
				}
			},
			"showRestockDistribution": function() {
				Vue.set(this, "showDistribution", true);
				setTimeout(() => {
					this.renderRestockDistribution();
				}, 0);
			},
			"toggleContributions": function(property) {
				Vue.set(this.showContributions, property, !this.showContributions[property]);
			},
			"directPropertyClasses": function(property) {
				if(this.calculated[property]) {
					return "calculated-value";
				}
				return "";
			},
			"contributionClasses": function(property) {
				if(this.showContributions[property]) {
					return "open";
				}
				return "closed";
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
									} else if(buffer.type && buffer.type.length) {
										hold = true;
										for(y=0; hold && y<buffer.type.length; y++) {
											if(this.record.cancontain.indexOf(buffer.type[y]) !== -1) {
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
				this.shownEntities.splice(0);
				this.entities.splice(0);

				this.shownLocations.splice(0);
				this.locations.splice(0);

				if(this.record && this.record.id && this.record._class === "location" || this.record._class === "entity") {
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
								this.shownEntities.push(this.universe.indexes.entity.listing[x]);
								this.entities.push(this.universe.indexes.entity.listing[x]);
							}
						}
					}

					if(this.record._class === "location") {
						for(x=0; x<this.universe.indexes.location.listing.length; x++) {
							if(this.universe.indexes.location.listing[x] && this.universe.indexes.location.listing[x].location === this.record.id) {
								this.shownLocations.push(this.universe.indexes.location.listing[x]);
								this.locations.push(this.universe.indexes.location.listing[x]);
							}
						}

						if(this.record.pathing) {
							for(x=0; x<this.record.pathing.length; x++) {
								if(this.record.pathing[x] && this.loctions.indexOf(this.record.pathing[x]) === -1) {
									this.shownLocations.push(this.record.pathing[x]);
									this.locations.push(this.record.pathing[x]);
								}
							}
						}
					}
				}

				this.shownLocations.sortBy(byName);
				this.shownEntities.sortBy(byName);
				this.shownLocations.splice(shownLength);
				this.shownEntities.splice(shownLength);

				this.availableSlots.splice(0);
				if(this.base && this.base.slot && this.base.slot.length) {
					for(x=0; x<this.base.slot.length; x++) {
						hold = this.universe.indexes.slot.lookup[this.base.slot[x]];
						if(hold && this.availableSlots.indexOf(hold) === -1 && ((!hold.itemtype || hold.itemtype.hasCommon(this.record.itemtype)) || (!hold.type || hold.type.hasCommon(this.record.type)))) {
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
				}
				Vue.set(this, "calculatedEncumberance", hold);

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

				this.availableEntities.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					if(this.universe.indexes.entity.listing[x] && (this.universe.indexes.entity.listing[x].screen || this.universe.indexes.entity.listing[x].owner || (this.universe.indexes.entity.listing[x].owners && this.universe.indexes.entity.listing[x].owners.length))) {
						this.availableEntities.push(this.universe.indexes.entity.listing[x]);
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

				this.activeEvents.splice(0);
				for(x=0; x<this.universe.indexes.event.listing.length; x++) {
					if(this.universe.indexes.event.listing[x] && this.universe.indexes.event.listing[x].active) {
						this.activeEvents.push(this.universe.indexes.event.listing[x]);
					}
				}
				this.activeEvents.sort(this.sortData);

				if(this.base && this.base._relatedErrors && this.base._relatedErrors[this.record.id]) {
					Vue.set(this, "relatedError", this.rsshowdown(this.base._relatedErrors[this.record.id].message || this.base._relatedErrors[this.record.id], this.record, this.base, this.target));
				} else {
					Vue.set(this, "relatedError", null);
				}

				if(!this.player.hide_contributed && this.record._calculated) {
					for(x=0; x<this.record._calculated.length; x++) {
						if(this.calculated[this.record._calculated[x]]) {
							this.calculated[this.record._calculated[x]].involved.splice(0);
						} else {
							Vue.set(this.calculated, this.record._calculated[x], {
								"result": 0,
								"involved": []
							});
						}
						Vue.set(this.calculated[this.record._calculated[x]], "result", this.universe.calculator.process(this.record[this.record._calculated[x]], this.record, this.base));
						if(this.record._statContributions && this.record._statContributions[this.record._calculated[x]]) {
							buffer = Object.keys(this.record._statContributions[this.record._calculated[x]]);
							for(y=0; y<buffer.length; y++) {
								// this.calculated[this.record._calculated[x]].involved.push(this.universe.indexes.all.index[buffer[y]]);
								if(buffer[y] !== this.record.id && this.universe.indexes.all.index[buffer[y]] && (this.player.master || (!this.universe.indexes.all.index[buffer[y]].obscured && !this.universe.indexes.all.index[buffer[y]].template))) {
									this.calculated[this.record._calculated[x]].involved.push(this.universe.indexes.all.index[buffer[y]]);
								}
							}
							if(this.calculated[this.record._calculated[x]].result != this.record[this.record._calculated[x]]) {
								this.calculated[this.record._calculated[x]].involved.push(this.base);
							}
						}
					}
				}

				if(this.record.restock_base && this.player.master) {
					setTimeout(() => {
						this.renderRestockDistribution();
					}, 10);
				}

				this.$forceUpdate();
			},
			"renderRestockDistribution": function() {
				var margin = {top: 10, right: 10, bottom: 50, left: 50},
					width = 350 - margin.left - margin.right,
					height = 300 - margin.top - margin.bottom,

					max = this.record.rarity_max || 5,
					min = this.record.rarity_min || 0,

					mean = this.record.rarity_mean || ( (max - min)/2 + min),
					spread = this.record.rarity_spread || 1,
					base = this.record.restock_base,
					invspread = 1/spread,
					step = 1,

					mouseover,
					mousemove,
					mouseout,
					bisect,

					histogram,
					bins,

					focusText,
					linefunc,
					focus,
					axisX,
					axisY,
					data,
					func,
					set,
					svg,
					y;

				func = function(x) {
					if(this.record && typeof(this.record.restockFunction) === "function") {
						return this.record.restockFunction(x);
					}
					return -1 * Math.pow(invspread * x - invspread * mean, 2) + base;
				};

				linefunc = d3.line()
				//.curve(d3.curveBasis)
				.x(function(d) {
					return axisX(d.x);
				})
				.y(function(d) {
					return axisY(d.y);
				});

				set = min;
				data = [];
				while(set <= max) {
					y = func(set);
					if(y > 0) {
						data.push({
							"x": parseFloat(set.toFixed(1)),
							"y": y
						});
					}
					set += step;
				}

				svg = d3.select(".restock-graph");
				svg.selectAll("*").remove();

				svg = d3.select(".restock-graph")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

				svg.append("text")
				.attr("x", width / 2 + margin.left)
				.attr("y", height + margin.top + margin.bottom - 10)
				.style("text-anchor", "middle")
				.text("Rarity");

				svg.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0)
				.attr("x", - (height / 2))
				.attr("dy", "1em")
				.style("text-anchor", "middle")
				.text("Number of Items");

				focus = svg.append("g")
				.append("circle")
				.style("fill", "none")
				.attr("stroke", "black")
				.attr("r", 8.5)
				.style("opacity", 0);

				focusText = svg.append("g")
				.append("text")
				.style("opacity", 0)
				.attr("text-anchor", "left")
				.attr("alignment-baseline", "middle");

				svg = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// What happens when the mouse move -> show the annotations at the right positions.
				bisect = d3.bisector(function(d) { return d.x; }).left;

				mouseover = function() {
					focusText.style("opacity",1);
					focus.style("opacity", 1);
				};

				mousemove = function() {
					// recover coordinate we need
					var x0 = axisX.invert(d3.mouse(this)[0]),
						i = bisect(data, x0, 0),
						selectedData = data[i];

					if(selectedData) {
						focus.attr("cx", axisX(selectedData.x) + margin.left)
						.attr("cy", axisY(selectedData.y) + margin.top);

						focusText.html("Rarity[" + parseInt(selectedData.x) + "]: " + parseInt(selectedData.y) + " Items")
						.attr("x", margin.left + 10)
						.attr("y", margin.top);
//						.attr("x", axisX(selectedData.x) + margin.left + 15)
//						.attr("y", axisY(selectedData.y) + margin.top);
					}
				};

				mouseout = function() {
					focusText.style("opacity", 0);
					focus.style("opacity", 0);
				};

				svg.append("rect")
				.style("fill", "none")
				.style("pointer-events", "all")
				.attr("width", width)
				.attr("height", height)
				.on("mouseover", mouseover)
				.on("mousemove", mousemove)
				.on("mouseout", mouseout);

				// X scale and Axis
				axisX = d3.scaleLinear()
				.domain([min - 1, max + 1])
				.range([0, width]);

				svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(axisX));

				// X scale and Axis
				axisY = d3.scaleLinear()
				.domain([0, base + 1])
				.range([height, 0]);

				svg.append("g")
				.call(d3.axisLeft(axisY));

				svg.append("path")
				.datum(data)
				.attr("stroke", "steelblue")
				.attr("stroke-width", 2)
				.attr("fill", "none")
				.attr("d", linefunc(data));

//				histogram = d3.histogram()
//				.value(func)
//				.domain(axisX.domain())
//				.thresholds(axisX.ticks(1));
//
//				bins = histogram(data);
//
//				svg.selectAll("rect")
//				.data(bins)
//				.enter()
//				.append("rect")
//				.attr("x", 1)
//				.attr("transform", function(d) {return "translate(" + axisX(d.x0) + "," + axisY(d.length) + ")";})
//				.attr("width", function(d) {return axisX(d.x1) - axisX(d.x0) - 1;})
//				.attr("height", function(d) {return height - axisY(d.length);})
//				.attr("fill", "#2121ff");
			},
			"openStarwarsFandom": function() {
				window.open("https://starwars.fandom.com/wiki/" + this.record.name.replace("System", "system"));
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
