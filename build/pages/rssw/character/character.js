
/**
 * 
 * 
 * @class RSSWCharacter
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWCharacter", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};
		
		return data;
	},
	"computed": {
		"entity": function() {
			return this.universe.nouns.entity[this.$route.params.oid];
		}
	},
	"mounted": function() {
		rsSystem.register(this);
	},
	"methods": {
		
	},
	"template": Vue.templified("pages/rssw/character.html")
});
