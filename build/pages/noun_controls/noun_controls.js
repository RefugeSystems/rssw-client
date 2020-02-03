
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
	},
	"mounted": function() {
		rsSystem.register(this);
	},
	"methods": {
		
	},
	"template": Vue.templified("pages/noun/controls.html")
});
