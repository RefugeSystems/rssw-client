
/**
 *
 *
 * @class rsswCharacterInfo
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_infoComponentKey";

	var careerText = "";

	var specializationText = "";

	rsSystem.component("rsswCharacterInfo", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSShowdown,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"character": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.storageKeyID = storageKey + this.character.id;
			data.specializationText = specializationText;
			data.careerText = careerText;

			data.race = null;
			data.displayAbilityTrees = false;
			data.energy_consumption = 0;
			data.energy_output = 0;
			data.encumberance_max = 0;
			data.encumberance = 0;
			data.experience = 0;
			data.credits = 0;

			data.displaySpecializations = false;
			data.availableSpecializations = [];
			data.displayCareers = false;
			data.availableCareers = [];
			data.specializations = [];
			data.careers = [];
			data.archetypeStats = {};

			data.mdDescription = null;
			data.description = "";
			data.state = this.loadStorage(data.storageKeyID, {
				"viewing": false
			});

			data.state.panel_descriptions = true;

			data.piloting = null;
			data.location = null;
			data.inside = null;

			data.abilities = [];
			data.inventory = [];
			data.loadout = [];
			data.effects = [];
			data.items = [];
			data.rooms = [];


			data.calculating = false;

			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);

			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value]) && this.isOwner(follow)) {
					rsSystem.EventBus.$emit("display-info", {
						"source": this.character,
						"base": this.character,
						"record": follow
					});
					event.stopPropagation();
					event.preventDefault();
				}
			};

			this.universe.$on("model:modified", this.updateFromUniverse);
			this.character.$on("modified", this.update);
			this.updateFromUniverse();
			this.update();
		},
		"methods": {
			"showInfo": function(view) {
				if(this.isOwner(view)) {
					rsSystem.EventBus.$emit("display-info", {
						"source": this.character,
						"base": this.character,
						"record": view
					});
				}
			},
			"exitEntity": function(entity) {
				this.character.commit({
					"inside": null
				});
			},
			"stopPiloting": function(entity) {
				entity.commit({
					"entity": null
				});
			},
			"closeCareers": function() {
				Vue.set(this, "displayCareers", false);
			},
			"openCareers": function() {
				Vue.set(this, "displayCareers", true);
			},
			"getCareerXPCost": function(career) {
				if(this.careers.length === 0) {
					return 0;
				}

				return 10 * (this.careers.length + 1);
			},
			"getSpecializationsXPCost": function(specialization) {
				var cost;

				if(this.specializations.length === 0) {
					return 0;
				}

				cost = 10 * (this.specializations.length + 1);
				if(this.careers.contains(specialization.parent)) {
					return cost;
				}

				return cost + 10;
			},
			"closeSpecializations": function() {
				Vue.set(this, "displaySpecializations", false);
			},
			"openSpecializations": function() {
				Vue.set(this, "displaySpecializations", true);
			},
			"styleSpecializationPanel": function(specialization) {
				var classes = "";

				if(this.careers.indexOf(specialization.parent) === -1) {
					classes += "external-specialization ";
				}
				if(!this.archetypeStats[specialization.id] || this.character.xp < this.archetypeStats[specialization.id].cost) {
					classes += "red-shadow ";
				}

				return classes;
			},
			"getSpecializationPanelText": function(specialization) {
				var parent = this.universe.indexes.archetype.index[specialization.parent],
					skills = [],
					skill,
					keys,
					x;

				keys = Object.keys(specialization);
				for(x=0; x<keys.length; x++) {
					if(keys[x].startsWith("skill_enhanced_")) {
						skill = this.universe.indexes.skill.lookup["skill:" + keys[x].substring(15)];
						if(skill) {
							skills.push("<a class=\"linked-value\" data-id=\"" + skill.id + "\">" + skill.name + "</a>");
						}
					}
				}
				if(skills.length) {
					skills = "<span>This specialization focuses in the following skills:</span><ul><li>" + skills.join("</li><li>") + "</li></ul>";
				}
				if(parent) {
					return `<div class="panel-stats">
						<div class="panel-stat">
							<span class="stat-label">Career</span>
							<span>:</span>
							<span class="stat-value">` + parent.name + `</span>
						</div>
					</div>` + skills;
				}

				return "";
			},
			"previewSpecializationAbilities": function(specialization) {
				Vue.set(this.state, "selected_archetype", specialization.id);
				this.openAbilities();
			},
			"learnSpecialization": function(specialization) {
				var cost = this.getSpecializationsXPCost(specialization),
					changes;

				if(this.displaySpecializations && cost <= this.experience) {
					Vue.set(this, "displaySpecializations", false);
					changes = {};
					changes.archetype = [specialization.id];
					changes.xp = -cost;
					this.character.commitAdditions(changes);
					Vue.set(this, "experience", this.experience - cost);
				}
			},
			"closeAbilities": function() {
				Vue.set(this, "displayAbilityTrees", false);
			},
			"openAbilities": function() {
				Vue.set(this, "displayAbilityTrees", true);
			},
			"getXPCostClassing": function(cost) {
				if(this.character.xp < cost) {
					return "red-shadow";
				}

				return "";
			},
			"updateCharacter": function() {
				if(!this.calculating) {
					Vue.set(this, "calculating", true);
					this.character.recalculateProperties();
					setTimeout(() => {
						Vue.set(this, "calculating", false);
					}, 1000);
				}
			},
			"getSex": function() {
				if(this.character.sex) {
					var index = this.character.sex.indexOf(":");
					if(index === -1) {
						return this.character.sex;
					}
					return this.character.sex.substring(index + 1);
				}
				return "";
			},
			"getEnergyIcon": function() {
				if(this.energy_consumption > this.energy_output) {
					return "far fa-battery-empty rs-red";
				} else if(this.energy_consumption == this.energy_output || this.energy_consumption > this.energy_output - (this.energy_output * .15)) {
					return "far fa-battery-quarter rs-orange";
				} else if(this.energy_consumption && this.energy_output) {
					return "far fa-battery-three-quarters rs-green";
				} else {
					return "far fa-battery-full rs-green";
				}
			},
			"getEncumberanceIcon": function() {
				if(this.encumberance > this.encumberance_max) {
					return "fas fa-person-carry rs-red";
				} else if(this.encumberance == this.encumberance_max || this.encumberance > this.encumberance_max - (this.encumberance_max * .15)) {
					return "fas fa-person-carry rs-orange";
				} else {
					return "fas fa-person-carry rs-green";
				}
			},
			"toggleDescription": function() {
				if(this.state.viewing) {
					Vue.set(this.state, "viewing", false);
				} else {
					Vue.set(this, "mdDescription", this.rsshowdown(this.character.description, this.character));
					Vue.set(this.state, "viewing", true);
				}
			},
			"changed": function(property, value) {
				var change = {};
				change[property] = value;
				this.character.commit(change);
			},
			"changeEvent": function(property, value) {
				var change = {};
				change[property] = value;
				this.character.commit(change);
			},
			"updateFromUniverse": function() {
				var buffer,
					hold,
					x;

				for(x=0; !hold && x<this.universe.indexes.entity.listing.length; x++) {
					buffer = this.universe.indexes.entity.listing[x];
					if(buffer.classification === "ship" && buffer.entity === this.character.id) {
						hold = buffer;
					}
				}
				if(hold) {
					Vue.set(this, "piloting", hold);
				} else {
					Vue.set(this, "piloting", null);
				}

				hold = 0;
				if(this.character.item) {
					if(this.items.length !== this.character.item.length) {
						this.items.splice(0);
						if(this.character.item && this.character.item.length) {
							for(x=0; x<this.character.item.length; x++) {
								buffer = this.universe.nouns.item[this.character.item[x]];
								if(buffer) {
									hold += (buffer.encumberance || 0);
									this.items.push(buffer);
								} else {
									console.warn("Item Not Found: " + this.character.item[x]);
								}
							}
						}
					} else {
						for(x=0; x<this.character.item.length; x++) {
							buffer = this.universe.nouns.item[this.character.item[x]];
							if(buffer) {
								hold += (buffer.encumberance || 0);
							} else {
								console.warn("Item Not Found: " + this.character.item[x]);
							}
						}
					}
				}
				Vue.set(this, "encumberance", hold);

				this.effects.splice(0);
				if(this.character.effect) {
					for(x=0; x<this.character.effect.length; x++) {
						buffer = this.universe.nouns.effect[this.character.effect[x]];
						if(buffer) {
							this.effects.push(buffer);
						}
					}
				}
			},
			"update": function(event) {
				var buffer,
					x;

				Vue.set(this, "race", this.universe.nouns.race[this.character.race]);
				this.availableSpecializations.splice(0);
				this.availableCareers.splice(0);
				this.specializations.splice(0);
				this.abilities.splice(0);
				this.careers.splice(0);
				this.rooms.splice(0);

				if(this.experience !== this.character.xp) {
					Vue.set(this, "experience", this.character.xp || 0);
				}
				if(this.description !== this.character.description) {
					Vue.set(this, "description", this.character.description);
				}
				if(this.credits !== this.character.credits) {
					Vue.set(this, "credits", this.character.credits || 0);
				}
				if((!this.location && this.character.location) || (this.location && this.location.id !== this.character.location)) {
					Vue.set(this, "location", this.universe.indexes.location.index[this.character.location]);
				}
				if((!this.inside && this.character.inside) || (this.inside && this.inside.id !== this.character.inside)) {
					Vue.set(this, "inside", this.universe.indexes.entity.index[this.character.inside]);
				}
				if(this.character.description) {
					Vue.set(this, "mdDescription", this.rsshowdown(this.character.description, this.character));
				}
				this.encumberance_max = 5 + this.character.brawn + (this.character.encumberance_bonus || 0);
				if(this.character.room && this.character.room.length) {
					for(x=0; x<this.character.room.length; x++) {
						buffer = this.universe.nouns.room[this.character.room[x]];
						if(buffer) {
							this.rooms.push(buffer);
						} else {
							console.warn("Room Not Found: " + this.character.room[x]);
						}
					}
				}

				if(this.character.archetype) {
					for(x=0; x<this.character.archetype.length; x++) {
						buffer = this.universe.nouns.archetype[this.character.archetype[x]];
						if(buffer) {
							switch(buffer.classification) {
								case "secondary":
									this.specializations.push(buffer);
									break;
								case "primary":
									this.careers.push(buffer);
									break;
							}
						}
					}
				}

				this.energy_consumption = this.character.energy_consume || 0;
				this.energy_output = this.character.energy_out || 0;

				if(this.character.ability) {
					for(x=0; x<this.character.ability.length; x++) {
						buffer = this.universe.nouns.ability[this.character.ability[x]];
						if(buffer && buffer.type.indexOf("character") !== -1) {
							this.abilities.push(buffer);
						}
					}
				}

				for(x=0; x<this.universe.indexes.archetype.listing.length; x++) {
					buffer = this.universe.indexes.archetype.listing[x];
					if(buffer.classification === "secondary" && buffer.parent && this.specializations.indexOf(buffer) == -1) {
						if(!this.archetypeStats[buffer.id]) {
							this.archetypeStats[buffer.id] = {};
						}
						this.archetypeStats[buffer.id].cost = this.getSpecializationsXPCost(buffer);
						this.availableSpecializations.push(buffer);
					}
				}
				this.availableSpecializations.sortBy("parent");
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("model:modified", this.updateFromUniverse);
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/info.html")
	});
})();
