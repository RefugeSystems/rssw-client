
/**
 * 
 * 
 * @class RSNounControls
 * @constructor
 * @module Pages
 */
rsSystem.component("RSNounControls", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCorePage
	],
	"data": function() {
		var data = {};
		
		return data;
	},
	"mounted": function() {
		rsSystem.register(this);
	},
	"methods": {
	},
	"template": Vue.templified("pages/noun/controls.html")
});
