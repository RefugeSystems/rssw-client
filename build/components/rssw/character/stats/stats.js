
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
		data.leveling = null;
		
		return data;
	},
	"mounted": function() {
		this.character.$on("modified", this.update);
		rsSystem.register(this);
	},
	"methods": {
		"update": function() {
			this.$forceUpdate();
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
			
			console.log("Direction: ", JSON.stringify({"d": direction, "x": this.character.xp, "c": cost, "e": (cost <= this.character.xp), calculating}));
			if(direction > 0 && cost <= this.character.xp) {
				change[stat] = this.character._coreData[stat] + 1;
				change.xp = this.character.xp - cost;
				if(!isNaN(change.xp)) {
					this.character.commit(change);
				}
			} else if(direction < 0 && calculating > 0) {
				change[stat] = this.character._coreData[stat] - 1;
				change.xp = this.character.xp - cost;
				if(!isNaN(change.xp)) {
					this.character.commit(change);
				}
			}
			console.log("Result: ", change);
		}
	},
	"beforeDestroy": function() {
		this.character.$off("modified", this.update);
	},
	"template": Vue.templified("components/rssw/character/stats.html")
});
