
/**
 * 
 * 
 * @class RSSWCharacterView
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWCharacterView", {
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
	"template": Vue.templified("components/rssw/character.html")
});
