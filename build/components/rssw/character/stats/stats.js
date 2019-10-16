
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
		this.character.$on("modified", this.update);
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		
		data.keys = ["brawn", "agility", "intellect", "cunning", "willpower", "pressence"];
		
		return data;
	},
	"methods": {
		"update": function() {
			this.$forceUpdate();
		},
		"getXPCost": function(stat) {
			return (parseInt(this.character[stat]) + 1) * 10;
		},
		"levelStat": function(stat) {
			console.log("Level Stat: " + stat);
		}
	},
	"beforeDestroy": function() {
		this.character.$off("modified", this.update);
	},
	"template": Vue.templified("components/rssw/character/stats.html")
});
