
/**
 * 
 * 
 * @class RSSWMap
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWMap", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"props": {
		
	},
	"computed": {
		"location": function() {
			return this.universe.nouns.location[this.$route.params.oid] || this.universe.nouns.location["location:universe"];
		}
	},
	"data": function() {
		var data = {};
		
		return data;
	},
	"mounted": function() {
		rsSystem.register(this);
	},
	"methods": {
		
	},
	"template": Vue.templified("pages/rssw/map.html")
});
