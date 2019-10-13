
/**
 * 
 * 
 * @class RSSWMap
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWMap", {
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
	"template": Vue.templified("pages/rssw/map.html")
});
