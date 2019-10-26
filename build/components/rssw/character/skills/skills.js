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

	rsSystem.component("rsswCharacterSkills", {
		"inherit": true,
		"mixins": [
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
			data.levelBars = levelBars;
			data.leveling = null;
			data.state = this.loadStorage(data.storageKeyID, {
				"hideNames": false,
				"search": ""
			});
			
			data.levelSkills = [];

			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					if(this.state.search !== this.state.search.toLowerCase()) {
						Vue.set(this.state, "search", this.state.search.toLowerCase());
					}
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"mounted": function() {
			this.character.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"getXPCost": function(skill, direction) {
				skill = this.entityStats[skill];
				if(!skill) {
					return "";
				}
				
				var calculating = this.character[skill.propertyKey] || 0;
				console.log("Cal: ", calculating);
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
				skill = this.entityStats[skill];
				if(!skill) {
					return "";
				}

				var calculating = this.character[skill.propertyKey] || 0,
					cost = this.getXPCost(skill.id, direction),
					change = {};
				
				console.log("Direction: ", JSON.stringify({"d": direction, "x": this.character.xp, "c": cost, "e": (cost <= this.character.xp)}));
				if(direction > 0 && cost <= this.character.xp) {
					change[skill.propertyKey] = calculating + 1;
					change.xp = this.character.xp - cost;
					if(!isNaN(change.xp)) {
						this.character.commit(change);
					}
				} else if(direction < 0 && calculating > 0) {
					change[skill.propertyKey] = calculating - 1;
					change.xp = this.character.xp - cost;
					if(change.xp) {
						this.character.commit(change);
					}
				}
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
				var buffer, x;

				this.levelSkills.splice(0);
				this.levelSkills.push.apply(this.levelSkills, this.characterStatsListing);
				this.levelSkills.push.apply(this.levelSkills, this.skillStatsListing);
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/skills.html")
	});	
})();
