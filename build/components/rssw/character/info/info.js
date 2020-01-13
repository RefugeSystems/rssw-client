
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
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value])) {
					rsSystem.EventBus.$emit("display-info", follow);
				}
			};
			
			this.character.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"showInfo": function(view) {
				rsSystem.EventBus.$emit("display-info", view);
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
					Vue.set(this, "mdDescription", this.rsshowdown(this.character.description));
					Vue.set(this.state, "viewing", true);
				}
			},
			"changed": function(property, value) {
				var change = {};
				change[property] = value;
				this.character.commit(change);
			},
			"update": function() {
				var buffer,
					x;
				
				Vue.set(this, "race", this.universe.nouns.race[this.character.race]);
				this.specializations.splice(0);
				this.abilities.splice(0);
				this.careers.splice(0);
				this.items.splice(0);
				this.rooms.splice(0);
				
				if(this.experience !== this.character.xp) {
					Vue.set(this, "experience", this.character.xp);
				}
				if(this.description !== this.character.description) {
					Vue.set(this, "description", this.character.description);
				}
				if(this.credits !== this.character.credits) {
					Vue.set(this, "credits", this.character.credits);
				}
				if(this.character.description) {
					Vue.set(this, "mdDescription", this.rsshowdown(this.character.description));
				}
				this.encumberance_max = 5 + this.character.brawn + (this.character.encumberance_bonus || 0);
				this.encumberance = 0;
				if(this.character.item && this.character.item.length) {
					for(x=0; x<this.character.item.length; x++) {
						buffer = this.universe.nouns.item[this.character.item[x]];
						if(buffer) {
							this.encumberance += (buffer.encumberance || 0);
							this.items.push(buffer);
						} else {
							console.warn("Item Not Found: " + this.character.item[x]);
						}
					}
				}
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
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/info.html")
	});
})();
