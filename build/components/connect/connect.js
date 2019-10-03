
/**
 * 
 * 
 * @class RSConnect
 * @constructor
 * @module Components
 */
rsSystem.components.RSConnect = Vue.component("RSConnect", {
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
	"template": Vue.templified("components/connect.html")
});
