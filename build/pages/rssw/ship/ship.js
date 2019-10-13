
/**
 * 
 * 
 * @class RSSWShip
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWShip", {
	"inherit": true,
	"mixins": [rsSystem.components.RSCore],
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		
		return data;
	},
	"methods": {
		
	},
	"template": Vue.templified("pages/rssw/ship.html")
});
