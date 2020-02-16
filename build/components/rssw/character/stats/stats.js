
/**
 * 
 * 
 * @class rsswCharacterStats
 * @constructor
 * @module Components
 */
rsSystem.component("rsswCharacterStats", {
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
		
		data.keys = ["brawn", "agility", "intellect", "cunning", "willpower", "pressence"];
		data.leveling = "";
		
		return data;
	},
	"mounted": function() {
		this.character.$on("modified", this.update);
		rsSystem.register(this);
	},
	"methods": {
		"viewSkill": function(skill) {
			this.showInfo(this.universe.indexes.skill.lookup["skill:" + skill], this.entity);
		},
		"noIncrease": function(stat) {
			console.warn("Stat Check[" + stat + "]: ", this.character[stat], this.getXPCost(stat, 1), this.character.xp);
			return this.character[stat] >= 5 || this.getXPCost(stat, 1) > this.character.xp;
		},
		"canDecrease": function(stat) {
			return this.character._coreData[stat] === undefined || this.character._coreData[stat] <= 0;
		},
		"getXPCost": function(stat, dir) {
			if(dir > 0) {
				return (parseInt(this.character[stat]) + dir) * 10;
			} else {
				return -1 * parseInt(this.character[stat]) * 10;
			}
		},
		"levelStat": function(stat, direction) {
			var calculating = this.character[stat] || 0,
				cost = this.getXPCost(stat, direction),
				change = {};
			
//			console.log("Direction: ", JSON.stringify({"d": direction, "x": this.character.xp, "c": cost, "e": (cost <= this.character.xp), calculating}));
			if(direction > 0 && cost <= this.character.xp) {
				change[stat] = (this.character._coreData[stat] || 0) + 1;
				change.xp = this.character.xp - cost;
				if(!isNaN(change.xp)) {
					this.character.commit(change);
				}
			} else if(direction < 0 && calculating > 0) {
				change[stat] = (this.character._coreData[stat] || 0)  - 1;
				change.xp = this.character.xp - cost;
				if(!isNaN(change.xp)) {
					this.character.commit(change);
				}
			}
//			console.log("Result: ", change);
		},
		"update": function() {
			this.$forceUpdate();
		}
	},
	"beforeDestroy": function() {
		this.character.$off("modified", this.update);
	},
	"template": Vue.templified("components/rssw/character/stats.html")
});
