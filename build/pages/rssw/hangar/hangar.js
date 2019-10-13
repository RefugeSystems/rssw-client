
/**
 * 
 * 
 * @class RSSWDashboard
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWHangar", {
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
	"template": Vue.templified("pages/rssw/hangar.html")
});
