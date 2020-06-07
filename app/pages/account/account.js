
/**
 * 
 * 
 * @class RSAccount
 * @constructor
 * @module Pages
 */
rsSystem.component("RSAccount", {
	"inherit": true,
	"mixins": [],
	"props": ["universe", "user"],
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		return data;
	},
	"methods": {
	},
	"template": Vue.templified("pages/account.html")
});
