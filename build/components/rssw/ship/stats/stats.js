
/**
 * 
 * 
 * @class rsswShipStats
 * @constructor
 * @module Components
 */

(function() {

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
	
	rsSystem.component("rsswShipStats", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSShowdown,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"ship": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.encumberance = 0;
			data.properties = {};
			data.image = null;
			data.items = [];
			data.points = 0;
			
			data.availablePilots = [];
			data.editingPilot = false;
			data.setPilot = null;
			data.pilot = null;
			data.skill = 0;

			data.editingPilotAbility = false;
			data.abilityDescription = "";
			data.setPilotAbility = "";
			data.pilotAbilities = [];
			data.pilotAbility = null;
			data.abilities = [];
			data.ability = null;

			data.availableSlots = [];
			data.mounted = [];
			data.points = 0;
			
			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value])) {
//					console.log("1Follow: ", follow);
					rsSystem.EventBus.$emit("display-info", follow);
				}
			};

			this.universe.$on("model:modified", this.updateFromUniverse);
			this.ship.$on("modified", this.update);
			this.updateFromUniverse();
			this.update();
		},
		"methods": {
			"isOwner": function(record) {
				return !record.template && (record.owner === this.player.id || (!record.owner && record.owners && record.owners.indexOf(this.player.id) !== -1));
			},
			"editPilot": function() {
				Vue.set(this, "editingPilot", !this.editingPilot);
			},
			"editPilotAbility": function() {
				Vue.set(this, "editingPilotAbility", !this.editingPilotAbility);
			},
			"showInfo": function(view) {
				rsSystem.EventBus.$emit("display-info", {
					"source": this.ship,
					"base": this.pilot,
					"record": view
				});
			},
			"setNewPilot": function(setPilot) {
				Vue.set(this, "editingPilot", false);
				
				if(setPilot === "") {
					setPilot = null;
				}
				
				this.ship.commit({
					"entity": setPilot
				});
			},
			"setNewPilotAbility": function(setPilotAbility) {
				Vue.set(this, "editingPilotAbility", false);
				
				if(setPilotAbility === "") {
					setPilotAbility = null;
				}
				
				this.ship.commit({
					"ship_active_abilities": [setPilotAbility]
				});
				
			},
			"recalculate": function() {
				this.ship.recalculateProperties();
			},
			"updated": function(field) {
				var committing = {};
				committing[field] = this.properties[field];
				this.ship.commit(committing);
				console.log("Commit: ", committing);
			},
			"updateFromUniverse": function() {
				var buffer,
					hold,
					x;

				this.availablePilots.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					buffer = this.universe.indexes.entity.listing[x];
					if(buffer.classification === "character" && this.isOwner(buffer) && buffer.inside === this.ship.id) {
						this.availablePilots.push(buffer);
					}
				}
				this.availablePilots.sort(byName);
			},
			"update": function() {
				var points = this.ship.points || 0,
					buffer,
					hold,
					x;

				if(this.ship.profile && this.universe.nouns.image[this.ship.profile]) {
					Vue.set(this, "image", this.universe.nouns.image[this.ship.profile]);
				} else {
					Vue.set(this, "image", null);
				}

				buffer = this.universe.nouns.entity[this.ship.entity];
				if(buffer) {
					if(this.pilot) {
						if(this.pilot.id !== buffer.id) {
							this.pilot.$off("modified", this.update);
							buffer.$on("modified", this.update);
							Vue.set(this, "pilot", buffer);
						}
					} else {
						buffer.$on("modified", this.update);
						Vue.set(this, "pilot", buffer);
					}
				} else if(this.pilot) {
					this.pilot.$off("modified", this.update);
					Vue.set(this, "pilot", null);
				}

				this.pilotAbilities.splice(0);
				this.abilities.splice(0);
				
				for(x=0; this.ship.ability && x<this.ship.ability.length; x++) {
					buffer = this.universe.nouns.ability[this.ship.ability[x]];
					if(buffer && buffer.type === "ship") {
						this.abilities.push(buffer);
					}
				}
				
				if(this.pilot) {
					Vue.set(this, "skill", this.pilot.pilot_skill || 0);
					
					for(x=0; this.pilot.ability && x<this.pilot.ability.length; x++) {
						buffer = this.universe.nouns.ability[this.pilot.ability[x]];
						if(buffer) {
							switch(buffer.type) {
								case "ship":
									this.abilities.push(buffer);
									break;
								case "pilot":
									this.pilotAbilities.push(buffer);
									break;
							}
						} else {
							console.warn("Unidentified Ability: " + this.pilot.ability[x]);
						}
					}
				}
				
				if(this.pilot && this.pilot.ability && this.ship.ship_active_abilities && this.ship.ship_active_abilities.length && this.pilot.ability.indexOf(this.ship.ship_active_abilities[0]) !== -1 && (buffer = this.universe.indexes.ability.index[this.ship.ship_active_abilities[0]])) {
					Vue.set(this, "abilityDescription", this.rsshowdown(buffer.description, this.ship, this.pilot));
					Vue.set(this, "pilotAbility", buffer);
				} else {
					Vue.set(this, "abilityDescription", this.rsshowdown(this.ship.description, this.ship));
					Vue.set(this, "pilotAbility", null);
				}
				
				this.availableSlots.splice(0);
				for(x=0; this.ship.slot && x<this.ship.slot.length; x++) {
					buffer = this.universe.indexes.slot.index[this.ship.slot[x]];
					if(buffer) {
						this.availableSlots.push(buffer);
					}
				}
				
				this.mounted.splice(0);
				for(x=0; this.ship.item && x<this.ship.item.length; x++) {
					buffer = this.universe.indexes.item.index[this.ship.item[x]];
					if(buffer && buffer.needs_slot) {
						this.mounted.push(buffer);
					}
				}

				if(this.ship.item) {
					if(this.items.length !== this.ship.item.length) {
						this.items.splice(0);
						hold = 0;
						for(x=0; x<this.ship.item.length; x++) {
							buffer = this.universe.indexes.item.index[this.ship.item[x]];
							if(buffer) {
								hold += buffer.encumberance;
								this.items.push(buffer);
							}
						}
						Vue.set(this, "encumberance", hold);
					}
				} else {
					this.items.splice(0);
				}
				
				if(this.ship.name) {
					Vue.set(this.properties, "name", this.ship.name);
				}
				if(this.ship.location) {
					Vue.set(this.properties, "location", this.universe.indexes.location.index[this.ship.location]);
				} else {
					Vue.set(this.properties, "location", null);
				}
				if(this.ship.inside) {
					Vue.set(this.properties, "inside", this.universe.indexes.entity.index[this.ship.inside]);
				} else {
					Vue.set(this.properties, "inside", null);
				}
				
				Vue.set(this, "points", this.ship.point_cost || 0);
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("model:modified", this.updateFromUniverse);
			this.ship.$off("modified", this.update);
			if(this.pilot) {
				this.pilot.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/rssw/ship/stats.html")
	});	
})();