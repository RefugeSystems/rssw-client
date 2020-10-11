
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
		rsSystem.components.RSComponentUtility,
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

		this.$el.onclick = (event) => {
			var follow = event.srcElement.attributes.getNamedItem("data-id");
			if(follow && (follow = this.universe.index.index[follow.value]) && this.isOwner(follow)) {
				rsSystem.EventBus.$emit("display-info", follow);
				event.stopPropagation();
				event.preventDefault();
			}
		};
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
