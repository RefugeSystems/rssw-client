
/**
 * 
 * 
 * @class RSNounControls
 * @constructor
 * @module Pages
 */
rsSystem.component("RSNounControls", {
	"inherit": true,
	"mixins": [],
	"props": {
		"universe": {
			"required": true,
			"type": Object
		},
		"player": {
			"required": true,
			"type": Object
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
	"template": Vue.templified("pages/noun/controls.html")
});
