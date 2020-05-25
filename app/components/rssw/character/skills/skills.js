/**
 * 
 * 
 * @class rsswCharacterSkills
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rssw_characterskillsComponentKey";
	
	var levelBars = [0,1,2,3,4];

	var instance = 0;
	
	rsSystem.component("rsswCharacterSkills", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"character": {
				"required": true,
				"type": Object
			},
			"state": {
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.storageKeyID = storageKey + this.character.id;
			data.levelBars = levelBars;
			data.leveling = "";
//			data.state = this.loadStorage(data.storageKeyID, {
//				"hideNames": false,
//				"search": ""
//			});

			data.instance = instance++;
			data.customSkills = [];
			data.levelSkills = [];
			data.subSkills = [];
			
			if(!this.state.rolls) {
				Vue.set(this.state, "rolls", {});
			}
			
			return data;
		},
		"watch": {
//			"state": {
//				"deep": true,
//				"handler": function() {
//					if(this.state.search !== this.state.search.toLowerCase()) {
//						Vue.set(this.state, "search", this.state.search.toLowerCase());
//					}
//					this.saveStorage(this.storageKeyID, this.state);
//				}
//			}
		},
		"mounted": function() {
			this.character.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"viewSkill": function(skill) {
				if(this.state.infoSkill) {
					this.showInfo(this.universe.indexes.skill.lookup[skill], this.entity);
				}
			},
			"skillNameTouched": function(skill) {
				this.viewSkill(skill.id);
			},
			"skillRollTouched": function(skill) {
				if(this.state.emitSkillRoll) {
					this.character.$emit("roll-skill", skill);
				} else if(this.state.rollSkill) {
					Vue.set(this.state.rolls, skill.id, Dice.calculateDiceRoll(this.getDiceExpression(skill)));
				}
			},
			"skillTouched": function(skill) {
				if(this.state.rollSkill) {
					Vue.set(this.state.rolls, skill.id, Dice.calculateDiceRoll(this.getDiceExpression(skill)));
				} else if(this.leveling === skill.id) {
					this.viewSkill(skill.id);
				}
				if(skill.can_rank) {
					Vue.set(this, "leveling", skill.id);
				}
			},
			"getXPCost": function(skill, direction) {
				skill = this.universe.indexes.skill.lookup[skill];
				if(!skill) {
					return "";
				}
				
				var calculating = this.character[skill.propertyKey] || 0;
//				console.log("Cal: ", calculating);
				if(calculating >= 5) {
					return "X";
				}
				
				if(direction > 0) {
					return (this.character[skill.enhancementKey]?5:10) * (calculating + 1);
				} else {
					return -1 * (this.character[skill.enhancementKey]?5:10) * (calculating);
				}
			},
			"levelSkill": function(skill, direction) {
				skill = this.universe.indexes.skill.lookup[skill];
				if(!skill) {
					return "";
				}

				var calculating = this.character[skill.propertyKey] || 0,
					cost = this.getXPCost(skill.id, direction),
					change = {};
				
//				console.log("Direction: ", JSON.stringify({"d": direction, "x": this.character.xp, "c": cost, "e": (cost <= this.character.xp)}));
				if(direction > 0 && cost <= this.character.xp) {
					change[skill.propertyKey] = calculating + 1;
					change.xp = this.character.xp - cost;
					if(!isNaN(change.xp)) {
						this.character.commit(change);
					}
				} else if(direction < 0 && calculating > 0) {
					change[skill.propertyKey] = calculating - 1;
					change.xp = this.character.xp - cost;
					if(!isNaN(change.xp)) {
						this.character.commit(change);
					}
				}
			},
			"getDiceExpression": function(skill) {
				var roll = {},
					s,
					x;
				
				s = this.character[skill.propertyKey] || 0;
				roll.b = this.character[skill.bonusKey] || 0;
				if(this.character[skill.base] < s) {
					roll.a = s - this.character[skill.base];
					roll.p = this.character[skill.base];
				} else {
					roll.a = this.character[skill.base] - s;
					roll.p = s;
				}

				return roll.a + "a + " + roll.b + "b + " + roll.p + "p";
			},
			"getDice": function(skill) {
				var roll = [], x;

				for (x = 0; x < this.character[skill.base]; x++) {
					if (x < this.character[skill.base] && x < this.character[skill.propertyKey]) {
						roll.push("fas fa-dice-d12 rs-yellow");
					} else {
						roll.push("fas fa-dice-d8 rs-green rot45");
					}
				}
				for (x = 0; this.character[skill.bonusKey] && x < this.character[skill.bonusKey]; x++) {
					roll.push("fas fa-dice-d6 rs-lightblue");
				}

				return roll;
			},
			"enhancedSkill": function(skill) {
				return !!this.character[skill.enhancementKey];
			},
			"update": function() {
				var mapped = {},
					buffer,
					x;

				this.customSkills.splice(0);
				this.levelSkills.splice(0);
				for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
					if(this.universe.indexes.skill.listing[x].section && !this.universe.indexes.skill.listing[x].no_rank) {
						this.levelSkills.push(this.universe.indexes.skill.listing[x]);
					}
				}
				if(this.character.skill) {
					for(x=0; x<this.character.skill.length; x++) {
						buffer = this.universe.indexes.skill.lookup[this.character.skill[x]];
						if(buffer && !mapped[buffer.id]) {
							this.customSkills.push(buffer);
							mapped[buffer.id] = true;
							if(!buffer.no_rank) {
								this.levelSkills.push(buffer);
							}
						}
					}
				}
				this.uniqueByID(this.levelSkills);
				this.levelSkills.sort(this.sortData);
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/skills.html")
	});	
})();
