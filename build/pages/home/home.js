
/**
 * 
 * 
 * @class RSHome
 * @constructor
 * @module Pages
 */
rsSystem.component("RSHome", {
	"inherit": true,
	"mixins": [],
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		return data;
	},
	"methods": {
	},
	"template": Vue.templified("pages/home.html")
});
