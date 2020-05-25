
/**
 * 
 * 
 * @class RSComponentUtility
 * @constructor
 * @module Components
 */

(function() {
	var dice = {};
	dice.proficiency = "fas fa-dice-d12 rs-yellow";
	dice.ability = "fas fa-dice-d8 rs-green";
	dice.boost = "fas fa-dice-d6 rs-color";
	dice.challenge = "fas fa-dice-d12 rs-red";
	dice.difficulty = "fas fa-dice-d8 rs-purple";
	dice.setback = "fas fa-dice-d6 rs-black";
	dice.force = "fas fa-dice-d12 rs-white";
	dice.wash = "fal fa-dice-d6 rs-white";
	
	/**
	 * Listed in render order
	 * @property diceTypes
	 * @type Array
	 * @private
	 * @static
	 */
	var diceTypes = [
		"proficiency",
		"ability",
		"boost",
		"challenge",
		"difficulty",
		"setback",
		"wash",
		"force"
	];
	
	rsSystem.component("RSComponentUtility", {
		"inherit": true,
		"mixins": [
		],
		"props": {
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
					skill = this.universe.indexes.entity.lookup[skill];
				}
				if(typeof(skill) === "string") {
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
				
				return roll;
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
				
				if(record.owner === this.player.id) {
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
				if((a.name === undefined || a.name === null) && b.name !== undefined && b.name !== null) {
					return -1;
				}
				if((b.name === undefined || b.name === null) && a.name !== undefined && a.name !== null) {
					return 1;
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