
/**
 * 
 * 
 * @class RSSWLocality
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWLocality", {
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
	"template": Vue.templified("pages/rssw/locality.html")
});
