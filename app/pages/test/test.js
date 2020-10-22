
/**
 * 
 * 
 * @class RSTest
 * @constructor
 * @module Pages
 */
rsSystem.component("RSTest", {
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
	"template": Vue.templified("pages/test.html")
});
