
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
		rsSystem.components.RSCorePage,
		rsSystem.components.RSShowdown
	],
	"data": function() {
		var data = {};

		data.infoOptions = {};
		data.infoOptions.noMaster = true;

		data.modeling = null;
		data.description = "";
		data.built = {};

		return data;
	},
	"watch": {
		/*
		"built": {
			"deep": true,
			"handler": function() {
				if(this.built.description) {
					console.warn("Update DEscription");
					Vue.set(this, "description", this.rsshowdown(this.built.description));
				} else {
					Vue.set(this, "description", "");
				}
			}
		}
		*/
		// "modeling.icon": function() {
		// 	this.$forceUpdate();
		// },
		// "modeling.name": function() {
		// 	this.$forceUpdate();
		// }
	},
	"mounted": function() {
		rsSystem.register(this);
	},
	"methods": {
		"changeModel": function(modeling) {
			Vue.set(this, "modeling", modeling);
		},
		"rerender": function() {
			this.$forceUpdate();
		}
	},
	"template": Vue.templified("pages/noun/controls.html")
});
