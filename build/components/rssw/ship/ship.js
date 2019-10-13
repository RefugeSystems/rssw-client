
/**
 * 
 * 
 * @class RSSWShipView
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWShipView", {
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
	"template": Vue.templified("components/rssw/ship.html")
});
