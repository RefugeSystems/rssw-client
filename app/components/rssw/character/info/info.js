
/**
 * 
 * 
 * @class rsswCharacterInfo
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_infoComponentKey";
	
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
			
			data.race = null;
			data.displayAbilityTrees = false;
			data.energy_consumption = 0;
			data.energy_output = 0;
			data.encumberance_max = 0;
			data.encumberance = 0;
			data.experience = 0;
			data.credits = 0;
	
			data.mdDescription = null;
			data.description = "";
			data.state = this.loadStorage(data.storageKeyID, {
				"viewing": false
			});
			
			data.piloting = null;
			data.location = null;
			data.inside = null;
			
			data.specializations = [];
			data.abilities = [];
			data.inventory = [];
			data.loadout = [];
			data.items = [];
			data.rooms = [];
			
			data.careers = [];
			
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
					rsSystem.EventBus.$emit("display-info", follow);
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
			"closeAbilities": function() {
				Vue.set(this, "displayAbilityTrees", false);
			},
			"openAbilities": function() {
				Vue.set(this, "displayAbilityTrees", true);
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
			},
			"update": function() {
				var buffer,
					x;
				
				Vue.set(this, "race", this.universe.nouns.race[this.character.race]);
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
						this.abilities.push(buffer);
					}
				}
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("model:modified", this.updateFromUniverse);
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/info.html")
	});
})();
