
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
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		
		data.keys = ["brawn", "agility", "intellect", "cunning", "willpower", "pressence"];
		
		return data;
	},
	"methods": {
		"getXPCost": function(stat) {
			return (parseInt(this.character[stat]) + 1) * 10;
		},
		"levelStat": function(stat) {
			console.log("Level Stat: " + stat);
		}
	},
	"template": Vue.templified("components/rssw/character/stats.html")
});
