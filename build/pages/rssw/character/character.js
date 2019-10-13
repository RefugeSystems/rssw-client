
/**
 * 
 * 
 * @class RSSWDashboard
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWCharacter", {
	"inherit": true,
	"mixins": [rsSystem.components.RSCore],
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		
		return data;
	},
	"computed": {
		"entity": function() {
			return this.universe.nouns.entity[this.$route.params.oid];
		}
	},
	"methods": {
		
	},
	"template": Vue.templified("pages/rssw/character.html")
});
