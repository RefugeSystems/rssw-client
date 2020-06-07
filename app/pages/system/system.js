
/**
 * 
 * 
 * @class RSSystem
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSystem", {
	"inherit": true,
	"mixins": [],
	"props": ["universe", "user"],
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		
		data.system = rsSystem;
		
		return data;
	},
	"methods": {
	},
	"template": Vue.templified("pages/system.html")
});
