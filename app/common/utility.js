
/**
 *
 *
 * @class RSComponentUtility
 * @constructor
 * @module Components
 */

(function() {
	var skipped = /[^a-zA-Z0-9]/g,
		spacing = /[ _-]/g;

	var dice = {};
	// dice.proficiency = "fas fa-dice-d12 rs-yellow";
	// dice.ability = "fas fa-dice-d8 rs-green";
	// dice.boost = "fas fa-dice-d6 rs-light-blue";
	// dice.challenge = "fas fa-dice-d12 rs-red";
	// dice.difficulty = "fas fa-dice-d8 rs-purple";
	// dice.setback = "fas fa-dice-d6 rs-black";
	// dice.force = "fas fa-dice-d12 rs-white";
	// dice.wash = "fal fa-dice-d6 rs-white";
	dice.p = "fas fa-dice-d12 rs-yellow";
	dice.a = "fas fa-dice-d8 rs-green";
	dice.b = "fas fa-dice-d6 rs-light-blue";
	dice.c = "fas fa-dice-d12 rs-red";
	dice.d = "fas fa-dice-d8 rs-purple";
	dice.s = "fas fa-dice-d6 rs-black";
	dice.f = "fas fa-dice-d12 rs-white";
	dice.w = "fal fa-dice-d6 rs-white";

	/**
	 * Listed in render order
	 * @property diceTypes
	 * @type Array
	 * @private
	 * @static
	 */
	var diceTypes = [
		"p",
		"a",
		"b",
		"c",
		"d",
		"s",
		"w",
		"f"
		// "proficiency",
		// "ability",
		// "boost",
		// "challenge",
		// "difficulty",
		// "setback",
		// "wash",
		// "force"
	];

	rsSystem.component("RSComponentUtility", {
		"inherit": true,
		"mixins": [
		],
		"props": {
			"universe": {
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.diceTypes = diceTypes;

			return data;
		},
		"computed": {
		},
		"watch": {
		},
		"mounted": function() {

		},
		"methods": {
			"getDice": function(skill, entity) {
				return this.renderRoll(this.getSkillRoll(skill, entity));
			},
			"getSkillRoll": function(skill, entity) {
				var roll = {},
					x;

				roll.proficiency = 0;
				roll.ability = 0;
				roll.boost = 0;
				roll.challenge = 0;
				roll.difficulty = 0;
				roll.setback = 0;
				roll.setfoward = 0;
				roll.force = 0;

				entity = entity || this.entity;
				if(typeof(entity) === "string") {
					if(!this.universe) {
						throw new Error("Universe parameter required in " + this.$vnode.tag);
					}
					skill = this.universe.indexes.entity.lookup[skill];
				}
				if(typeof(skill) === "string") {
					if(!this.universe) {
						throw new Error("Universe parameter required in " + this.$vnode.tag);
					}
					skill = this.universe.indexes.skill.lookup[skill];
				}

				if(skill && entity) {
					for(x=0; x<entity[skill.base] || x<entity[skill.propertyKey]; x++) {
						if(x<entity[skill.base] && x<entity[skill.propertyKey]) {
							++roll.proficiency;
						} else {
							++roll.ability;
						}
					}
					for(x=0; x<entity[skill.bonusKey]; x++) {
						++roll.boost;
					}
				}

				if(this.entity["skill_amend_" + skill.property]) {
					this.addRolls(roll, Dice.parseDiceRoll(this.entity["skill_amend_" + skill.property]));
				}

				return roll;
			},
			"addRolls": function(result, ...rolls) {
				var i,
					r;

				if(!result) {
					result = {};
				}

				for(i=0; i<diceTypes.length; i++) {
					if(isNaN(result[diceTypes[i]])) {
						result[diceTypes[i]] = 0;
					}
				}

				for(r=0; r<rolls.length; r++) {
					for(i=0; i<diceTypes.length; i++) {
						if(!isNaN(rolls[r][diceTypes[i]])) {
							result[diceTypes[i]] += rolls[r][diceTypes[i]];
						}
					}
				}

				return result;
			},
			"renderRoll": function(roll, rendering) {
				rendering = rendering || [];
				var r,
					x;

				for(r=0; r<diceTypes.length; r++) {
					for(x=0; roll[diceTypes[r]] && x<roll[diceTypes[r]]; x++) {
						rendering.push(dice[diceTypes[r]]);
					}
				}

				return rendering;
			},
			"showInfo": function(view, base, target) {
				if(view && view.id && this.isOwner(view)) {
					if(!base && this.entity) {
						base = this.entity;
					}
					rsSystem.EventBus.$emit("display-info", {
						"target": target,
						"record": view,
						"base": base
					});
				}
			},
			"isOwner": function(record, player) {
				player = this.player || player;

				if(player.master) {
					return true;
				}

				if(record.is_public) {
					return true;
				} else if(record.is_private) {
					return false;
				} else if(record.owner === this.player.id) {
					return true;
				} else if(record.owners && record.owners.indexOf(this.player.id) !== -1) {
					return true;
				} else if(!record.owner && (!record.owners || record.owners.length === 0)) {
					return true;
				} else {
					return false;
				}
			},
			/**
			 * Compare to lists and find the first matched occurrence. Used primarily for comparing
			 * itemtype lists for agreement.
			 * @method sharesOne
			 * @param {Array} corpus The list of Strings with which to start.
			 * @param {Array} compare The list of Strings against which to compare.
			 * @return The first element found that occurs in both lists or null if
			 * 		no shared element is found.
			 */
			"sharesOne": function(corpus, compare) {
				var x, y;
				for(x=0; x<corpus.length; x++) {
					for(y=0; y<compare.length; y++) {
						if(corpus[x] === compare[y]) {
							return corpus[x];
						}
					}
				}

				return null;
			},
			"raceHasDataset": function(race) {
				race = race || this.models[this.state.current].race;
				return (race && this.universe.indexes.race.index[race] && this.universe.indexes.race.index[race].dataset)
					|| (!race && this.universe.defaultDataset);
			},
			"getRacialNameGenerator": function(race) {
				var generator = null,
					data,
					x;

				if(race && this.universe.indexes.race.index[race] && this.universe.indexes.race.index[race].dataset) {
					data = "";
					for(x=0; x<this.universe.indexes.race.index[race].dataset.length; x++) {
						if(this.universe.indexes.dataset.index[this.universe.indexes.race.index[race].dataset[x]]) {
							data += " " + this.universe.indexes.dataset.index[this.universe.indexes.race.index[race].dataset[x]].set;
						}
					}
					generator = new NameGenerator(data);
				} else if(this.universe.defaultDataset) {
					if(!this.universe.defaultDataset.set) {
						this.universe.defaultDataset.recalculateProperties();
					}
					generator = new NameGenerator(this.universe.defaultDataset.set);
				}

				return generator;
			},
			/**
			 *
			 * @method idFromName
			 * @param {String} name
			 * @return {String}
			 */
			"idFromName": function(name) {
				if(name) {
					return name.toLowerCase().replace(spacing, ":").replace(skipped, "");
				}
				return "";
			},
			/**
			 *
			 * @method uniqueByID
			 * @param {Array} corpus The array to clean.
			 * @return {Array} The passed array that is now cleaned.
			 */
			"uniqueByID": function(corpus) {
				if(!corpus) {
					return corpus;
				}

				var track = {},
					x;

				for(x=corpus.length-1; 0<=x; x--) {
					if(track[corpus[x].id]) {
						corpus.splice(x, 1);
					} else {
						track[corpus[x].id] = true;
					}
				}

				return corpus;
			},
			"sortData": function(a, b) {
				var aName,
					bName;

				if(a.order !== undefined && b.order !== undefined && a.order !== null && b.order !== null) {
					if(a.order < b.order) {
						return -1;
					} else if(a.order > b.order) {
						return 1;
					}
				}
				if((a.order === undefined || a.order === null) && b.order !== undefined && b.order !== null) {
					return -1;
				}
				if((b.order === undefined || b.order === null) && a.order !== undefined && a.order !== null) {
					return 1;
				}

				if(a.name !== undefined && b.name !== undefined && a.name !== null && b.name !== null) {
					aName = a.name.toLowerCase();
					bName = b.name.toLowerCase();
					if(aName < bName) {
						return -1;
					} else if(aName > bName) {
						return 1;
					}
				}

				if(a.date || b.date) {
					if((a.name === undefined || a.name === null) && b.name !== undefined && b.name !== null) {
						return -1;
					}
					if((b.name === undefined || b.name === null) && a.name !== undefined && a.name !== null) {
						return 1;
					}

					if((a.date === undefined || a.date === null) && b.date !== undefined && b.date !== null) {
						return -1;
					}
					if((b.date === undefined || b.date === null) && a.date !== undefined && a.date !== null) {
						return 1;
					}

					if(a.date < b.date) {
						return -1;
					} else if(a.date > b.date) {
						return 1;
					}
				}

				if(a.id < b.id) {
					return -1;
				} else if(a.id > b.id) {
					return 1;
				}

				return 0;
			}
		}
	});
})();
