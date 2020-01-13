/**
 * 
 * 
 * @class RSSWCharacterBuilder
 * @constructor
 * @module Pages
 */
(function() {
	var storageKey = "_rs_characterBuilderComponentKey";
	
	var spaces = /\\s/g;
	
	var nameSort = function(a, b) {
		if(a.name < b.name) {
			return -1;
		} else if(a.name > b.name) {
			return 1;
		} else if(a.id < b.id) {
			return -1;
		} else if(a.id > b.id) {
			return 1;
		} else {
			return 0;
		}
	};
	
	rsSystem.component("RSSWCharacterBuilder", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCorePage
		],
		"state": {
			"deep": true,
			"handler": function() {
				this.update();
			}
		},
		"data": function() {
			var data = {};
			
			data.base = {};
			data.base.species =[];
			data.base.careers =[];
			data.base.specializations = [];
			
			data.choices = [];
	
			data.building = {};
			data.building.id = "character:" + this.user.id + ":" + Date.now();
			
			data.stage = 0;
			
			data.storageKeyID = storageKey;
			if(this.cid) {
				data.storageKeyID += ":" + this.cid;
			}
			data.state = this.loadStorage(data.storageKeyID, {
			});
			
			return data;
		},
		"watch": {
			"building": {
				"deep": true,
				"handler": function() {
					var modifier = {},
						push = false,
						buffer;
					
					if(this.stage === 6) {
						console.warn("Stage 6 Re-Calc: ", this.choices[0]);
						if(this.choices[0].wound_start) {
							// TODO: Switch to System Set Calculation
							console.warn("Wound Calc[" + this.building.brawn + "]: ", this.choices[0].wound_start);
							buffer = eval(this.choices[0].wound_start.replace("brawn", this.building.brawn));
							if(this.building.wounds_max !== buffer) {
								modifier.wounds_max = buffer;
								modifier.wounds = buffer;
								push = true;
							}
						} else {
							this.choices[0].wounds = 0;
						}
						if(this.choices[0].strain_start) {
							// TODO: Switch to System Set Calculation
							console.warn("Strain Calc[" + this.building.willpower + "]: ", this.choices[0].strain_start);
							buffer = eval(this.choices[0].strain_start.replace("willpower", this.building.willpower));
							if(this.building.strain_max !== buffer) {
								modifier.strain_max = buffer;
								modifier.strain = buffer;
								push = true;
							}
						} else {
							this.choices[0].strain = 0;
						}
					}
					
					if(push) {
						this.building.commit(modifier);
					}
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("universe:modified", this.update);
			this.update();
		},
		"methods": {
			"back": function(stage) {
				if(stage === undefined) {
					stage = this.stage - 1;
				}
				Vue.set(this, "stage", stage);
			},
			"selected": function(record) {
				switch(this.stage) {
					case 0:
						this.forward();
						break;
					case 1:
						Vue.set(this.building, record._type, record.id);
						this.choices.splice(0);
						this.choices.push(record);
						this.forward();
						break;
					case 2:
						this.building.archetype = [record.id];
						if(!this.building[record._type]) {
							Vue.set(this.building, record._type, []);
						}
						this.building[record._type].splice(0);
						this.building[record._type].push(record.id);
						this.choices.splice(1);
						this.choices.push(record);
						this.forward();
						break;
					case 3:
						this.building.archetype.splice(1);
						this.building.archetype.push(record.id);
						this.choices.splice(2);
						this.choices.push(record);
						this.forward();
						break;
					case 4:
						if(this.choices[0].xp_start) {
							this.building.xp = parseInt(this.choices[0].xp_start);
						} else {
							this.choices[0].xp_start = 0;
						}

						if(this.choices[0].wound_start) {
							// TODO: Switch to System Set Calculation
							this.building.wounds_max = eval(this.choices[0].wound_start.replace("brawn", this.choices[0].brawn));
							this.building.wounds = this.building.wounds_max;
						} else {
							this.choices[0].wounds = 0;
						}
						if(this.choices[0].strain_start) {
							// TODO: Switch to System Set Calculation
							this.building.strain_max = eval(this.choices[0].strain_start.replace("willpower", this.choices[0].willpower));
							this.building.strain = this.building.strain_max;
						} else {
							this.choices[0].strain = 0;
						}

						this.building.defense_melee = 0;
						this.building.defense_range = 0;
						this.building.soak = 0;
						
						console.warn("Create Player Entity: ", this.building);
						this.universe.$on("universe:modified", (event) => {
							setTimeout(() => {
								console.warn("Checking[" + this.building.id + "]: ", this.universe.indexes.entity.lookup[this.building.id], event);
								if(this.universe.nouns.entity[this.building.id]) {
									this.universe.nouns.entity[this.building.id].recalculateProperties();
									this.universe.nouns.entity[this.building.id].recalculateProperties();
									Vue.set(this, "building", this.universe.nouns.entity[this.building.id]);
									this.forward();
								}
							}, 0);
						});
						this.universe.send("create:self", this.building);
						
						this.forward();
						break;
					case 6:
						this.$router.push("/dashboard/character/" + this.building.id);
						break;
				}
			},
			"forward": function() {
				switch(this.stage) {
					case 2:
						if(this.user.master) {
							this.building.id = "entity:npc:" + this.reduceName(this.building.name) + ":" + Date.now();
						}
						break;
					case 3:
						break;
				}
				Vue.set(this, "stage", this.stage + 1);
				this.update();
			},
			"reduceName": function(name) {
				return name.toLowerCase().replace(spaces, "");
			},
			"update": function() {
				var loading,
					x;
				
				this.base.species.splice(0);
				for(x=0; x<this.universe.indexes.race.listing.length; x++) {
					if(this.universe.indexes.race.listing[x].playable) {
						this.base.species.push(this.universe.indexes.race.listing[x]);
					}
				}
				
				this.base.careers.splice(0);
				for(x=0; x<this.universe.indexes.archetype.listing.length; x++) {
					if(this.universe.indexes.archetype.listing[x].classification === "primary" && this.universe.indexes.archetype.listing[x].playable) {
						this.base.careers.push(this.universe.indexes.archetype.listing[x]);
					} else {
//						console.warn("Skip Archetype: ", _p(this.universe.indexes.archetype.listing[x]));
					}
				}
				
				if(this.stage > 2 && this.stage < 5) {
					this.base.specializations.splice(0);
					for(x=0; x<this.universe.indexes.archetype.listing.length; x++) {
						if(this.universe.indexes.archetype.listing[x].classification === "secondary" && this.universe.indexes.archetype.listing[x].parent === this.building.archetype[0]) {
							this.base.specializations.push(this.universe.indexes.archetype.listing[x]);
						}
					}
				}

				this.base.careers.sort(nameSort);
				this.base.species.sort(nameSort);
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
		},
		"template": Vue.templified("pages/rssw/character/builder.html")
	});
})();