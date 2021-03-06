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
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSCorePage
		],
		// "state": {
		// 	"deep": true,
		// 	"handler": function() {
		// 		this.update();
		// 	}
		// },
		"data": function() {
			var data = {},
				x;

			data.storageKeyID = storageKey;
			if(this.cid) {
				data.storageKeyID += ":" + this.cid;
			}
			data.state = this.loadStorage(data.storageKeyID, {
			});

			data.racialNaming = null;
			data.base = {};
			data.base.species =[];
			data.base.careers =[];
			data.base.specializations = [];

			data.race = null;
			data.career = null;
			data.specialization = null;
			data.choices = [];
			data.summary = {};
			data.fields = {};

			data.rankSpecializationOptions = [];
			data.rankedSpecialization = [];
			data.rankCareerOptions = [];
			data.rankedCareer = [];
			data.rankRaceOptions = [];
			data.rankedRace = [];

			data.state.species = {
				"raw": true
			};
			data.fields.species = [
				"wounds_start",
				"strain_start",
				"xp_start",

				"brawn",
				"agility",
				"intellect",
				"cunning",
				"willpower",
				"pressence"
			];
			data.summary.species = {
				"wounds_start": "Starting Wounds",
				"strain_start": "Starting Strain",
				"xp_start": "Starting XP",

				"brawn": " Brawn",
				"agility": "Agility",
				"intellect": "Intellect",
				"cunning": "Cunning",
				"willpower": "Willpower",
				"pressence": "Pressence"
			};


			data.state.careers = {
				"panel_descriptions": true,
				"raw": true
			};
			data.fields.careers = [];
			data.summary.careers = {};

			data.building = {};
			data.building.id = "character:" + this.user.id + ":" + Date.now();

			data.checking = false;
			data.stage = 0;

			data.base.species.splice(0);
			for(x=0; x<this.universe.indexes.race.listing.length; x++) {
				if(this.universe.indexes.race.listing[x].playable) {
					data.base.species.push(this.universe.indexes.race.listing[x]);
				}
			}

			data.base.careers.splice(0);
			for(x=0; x<this.universe.indexes.archetype.listing.length; x++) {
				if(this.universe.indexes.archetype.listing[x].classification === "primary" && this.universe.indexes.archetype.listing[x].playable) {
					data.base.careers.push(this.universe.indexes.archetype.listing[x]);
				} else {
//					console.warn("Skip Archetype: ", _p(this.universe.indexes.archetype.listing[x]));
				}
			}

			data.base.species.sort(nameSort);
			data.base.careers.sort(nameSort);

			return data;
		},
		// "watch": {
		// 	"building": {
		// 		"deep": true,
		// 		"handler": function() {
		// 			this.recalculateStart();
		// 		}
		// 	}
		// },
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
				var response,
					skill,
					keys,
					x;

				switch(this.stage) {
					case 0:
						Vue.set(this, "race", record);
						Vue.set(this.building, record._type, record.id);
						this.forward();
						break;
					case 1:
						// this.building.archetype = [record.id];
					 	Vue.set(this, "career", record);
						if(!this.building[record._class]) {
							Vue.set(this.building, record._class, []);
						}
						this.building[record._class].splice(0);
						this.building[record._class].push(record.id);
						this.forward();
						break;
					case 2:
						Vue.set(this, "specialization", record);
						this.building.archetype.splice(1);
						this.building.archetype.push(record.id);

						this.rankSpecializationOptions.splice(0);
						this.rankedSpecialization.splice(0);
						this.rankCareerOptions.splice(0);
						this.rankedCareer.splice(0);
						this.rankRaceOptions.splice(0);
						this.rankedRace.splice(0);

						keys = Object.keys(this.career);
						for(x=0; x<keys.length; x++) {
							if(keys[x].startsWith("skill_enhanced_")) {
								skill = this.universe.indexes.skill.lookup["skill:" + keys[x].substring(15)];
								if(skill) {
									this.rankCareerOptions.push(skill);
								}
							}
						}

						keys = Object.keys(this.specialization);
						for(x=0; x<keys.length; x++) {
							if(keys[x].startsWith("skill_enhanced_")) {
								skill = this.universe.indexes.skill.lookup["skill:" + keys[x].substring(15)];
								if(skill) {
									this.rankSpecializationOptions.push(skill);
								}
							}
						}

						if(this.race.skills_starting) {
							this.rankRaceOptions.push.apply(this.rankRaceOptions, this.universe.indexes.skill.translate(this.race.skills_starting));
						}

						this.forward();
						break;
					case 3:
						if(this.rankedSpecialization.length !== 1 || this.rankedCareer.length !== 4 || (this.race.skills_starting_count && this.rankedRace.length !== this.race.skills_starting_count)) {
							return false;
						}

						skill = [];
						if(this.rankedRace.length) {
							skill.push("Race");
							for(x=0; x<this.rankedRace.length; x++) {
								skill.push("<li><a class=\"linked-value\" data-id=\"" + this.rankedRace[x].id + "\">" + this.rankedRace[x].name + "</a></li>");
							}
						}
						skill.push("Career");
						for(x=0; x<this.rankedCareer.length; x++) {
							skill.push("<li><a class=\"linked-value\" data-id=\"" + this.rankedCareer[x].id + "\">" + this.rankedCareer[x].name + "</a></li>");
						}
						skill.push("Specialization");
						for(x=0; x<this.rankedSpecialization.length; x++) {
							skill.push("<li><a class=\"linked-value\" data-id=\"" + this.rankedSpecialization[x].id + "\">" + this.rankedSpecialization[x].name + "</a></li>");
						}
						skill = "<ul>" + skill.join("") + "</ul>";

						this.choices.splice(0);
						this.choices.push(this.race);
						this.choices.push({
							"name": "Description",
							"description": this.building.description
						});
						this.choices.push(this.career);
						this.choices.push(this.specialization);
						this.choices.push({
							"name": "Starting Ranked Skills",
							"description": skill
						});
						this.choices.push({
							"name": "Motivations",
							"description": this.building.motivations
						});
						this.choices.push({
							"name": "Obligations",
							"description": this.building.obligations
						});
						this.forward();
						break;
					case 4:
						if(this.race.xp_start) {
							this.building.xp = parseInt(this.race.xp_start);
						} else {
							this.race.xp_start = 0;
						}

						if(this.race.wounds_start) {
							// TODO: Switch to System Set Calculation
							switch(typeof(this.race.wounds_start)) {
								case "string":
									this.building.wounds_max = parseInt(eval(this.race.wounds_start.replace("starting.brawn", this.race.brawn)));
									break;
								case "number":
									this.building.wounds_max = this.race.wounds_start;
									break;
							}
							this.building.wounds = this.building.wounds_max;
						} else {
							console.error("No Wounds Calculation?");
//							this.race.wounds = 0;
						}
						if(this.race.strain_start) {
							// TODO: Switch to System Set Calculation
							switch(typeof(this.race.strain_start)) {
								case "string":
									this.building.strain_max = parseInt(eval(this.race.strain_start.replace("starting.willpower", this.race.willpower)));
									break;
								case "number":
									this.building.strain_max = this.race.strain_start;
									break;
							}
							this.building.strain = this.building.strain_max;
						} else {
							console.error("No Strain Calculation?");
//							this.race.strain = 0;
						}

						this.building.defense_melee = 0;
						this.building.defense_range = 0;
						this.building.soak = 0;

						for(x=0; x<this.rankedRace.length; x++) {
							if(!this.building[this.rankedRace[x].propertyKey]) {
								this.building[this.rankedRace[x].propertyKey] = 0;
							}
							this.building[this.rankedRace[x].propertyKey] += 1;
						}
						for(x=0; x<this.rankedCareer.length; x++) {
							if(!this.building[this.rankedCareer[x].propertyKey]) {
								this.building[this.rankedCareer[x].propertyKey] = 0;
							}
							this.building[this.rankedCareer[x].propertyKey] += 1;
						}
						for(x=0; x<this.rankedSpecialization.length; x++) {
							if(!this.building[this.rankedSpecialization[x].propertyKey]) {
								this.building[this.rankedSpecialization[x].propertyKey] = 0;
							}
							this.building[this.rankedSpecialization[x].propertyKey] += 1;
						}

						// console.warn("Create Player Entity: ", this.building);
						response = () => {
							setTimeout(() => {
								// console.warn("Checking[" + this.building.id + "]: ", this.universe.indexes.entity.lookup[this.building.id], event);
								if(this.stage === 5 && this.universe.nouns.entity[this.building.id]) {
									this.universe.nouns.entity[this.building.id].recalculateProperties();
									this.universe.nouns.entity[this.building.id].recalculateProperties();
									Vue.set(this, "building", this.universe.nouns.entity[this.building.id]);
									this.building.$on("modified", this.recalculateStart);
									this.universe.$off("universe:modified", response);
									this.forward();
								}
							}, 0);
						};
						this.universe.$on("universe:modified", response);
						this.universe.send("create:self", this.building);

						this.forward();
						break;
					case 6:
						this.building.$off("modified", this.recalculateStart);
						this.$router.push("/dashboard/character/" + this.building.id);
						break;
				}

				return true;
			},
			"forward": function() {
				// console.trace("Forward[" + this.stage + "] -> " + (this.stage + 1));
				switch(this.stage) {
					case 2:
						if(this.user.master) {
							this.building.id = "entity:npc:" + this.idFromName(this.building.name) + ":" + Date.now();
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
			"randomName": function() {
				if(this.racialNaming) {
					Vue.set(this.building, "name", this.racialNaming.corpus[Random.integer(this.racialNaming.corpus.length)].capitalize() + " " + this.racialNaming.corpus[Random.integer(this.racialNaming.corpus.length)].capitalize());
				}
			},
			"generateName": function() {
				if(this.racialNaming) {
					Vue.set(this.building, "name", this.racialNaming.create().capitalize() + " " + this.racialNaming.create().capitalize());
				}
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

				if(this.stage > 1 && this.stage < 5) {
					this.base.specializations.splice(0);
					for(x=0; x<this.universe.indexes.archetype.listing.length; x++) {
						if(this.universe.indexes.archetype.listing[x].classification === "secondary" && this.universe.indexes.archetype.listing[x].parent === this.building.archetype[0]) {
							this.base.specializations.push(this.universe.indexes.archetype.listing[x]);
						}
					}

					Vue.set(this, "racialNaming", this.getRacialNameGenerator(this.building.race));
				}

				this.base.species.sort(nameSort);
				this.base.careers.sort(nameSort);
				this.base.specializations.sort(nameSort);

				this.$forceUpdate();
			},
			"recalculateStart": function(spark) {
				var modifier = {},
					push = false,
					buffer;

				if(this.stage === 6 && !this.checking) {
					Vue.set(this, "checking", true);
					// console.warn("Stage 6 Re-Calc: ", this.race);
					this.building.recalculateProperties();

					if(this.building.wounds_start) {
						// TODO: Switch to System Set Calculation
						// console.log("Wounds Calc[" + this.building.brawn + "]: ", this.building.wounds_start);
						// buffer = eval(this.race.wounds_start.replace("brawn", this.building.brawn));
						switch(typeof(this.building.wounds_start)) {
							case "string":
								buffer = Math.floor(eval(this.building.wounds_start.replace("brawn", this.building.brawn)));
								break;
							case "number":
								buffer = this.building.wounds_start;
								break;
						}
						// console.log("Wounds Result: " + this.building.wounds_max + " -> " + buffer);
						if(this.building.wounds_max !== buffer) {
							modifier.wounds_max = buffer;
							modifier.wounds = buffer;
							push = true;
						}
					} else {
						console.error("No Wounds Calculation?");
					}
					if(this.building.strain_start) {
						// TODO: Switch to System Set Calculation
						// console.log("Strain Calc[" + this.building.willpower + "]: ", this.building.strain_start);
						// buffer = eval(this.race.strain_start.replace("willpower", this.building.willpower));
						switch(typeof(this.building.strain_start)) {
							case "string":
								buffer = Math.floor(eval(this.building.strain_start.replace("willpower", this.building.willpower)));
								break;
							case "number":
								buffer = this.building.strain_start;
								break;
						}
						// console.log("Strain Result: " + this.building.strain_max + " -> " + buffer);
						if(this.building.strain_max !== buffer) {
							modifier.strain_max = buffer;
							modifier.strain = buffer;
							push = true;
						}
					} else {
						console.error("No Strain Calculation?");
					}
				}

				if(push) {
					// console.log("Pushing Modification: ", modifier);
					this.building.commit(modifier);
				}
				Vue.set(this, "checking", false);
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
		},
		"template": Vue.templified("pages/rssw/character/builder.html")
	});
})();
