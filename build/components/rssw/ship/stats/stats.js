
/**
 * 
 * 
 * @class rsswShipStats
 * @constructor
 * @module Components
 */
rsSystem.component("rsswShipStats", {
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
		var data = {},
			x;
		
		data.damage = {};
		for(x=0; x<this.shipStats.length; x++) {
			
		}
		
		return data;
	},
	"methods": {
		
	},
	"template": Vue.templified("components/rssw/ship/stats.html")
});
