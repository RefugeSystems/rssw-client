
/**
 * 
 * 
 * @class RSSWPartyPage
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWPartyPage", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};
		
		data.linked = null;
		
		return data;
	},
	"computed": {
		"record": function() {
			return this.universe.nouns.entity[this.$route.params.oid];
		}
	},
	"watch": {
		"record": function(incoming) {
			console.warn("Party record Changed");
			if(this.linked && (!incoming || incoming.id !== this.linked.id)) {
				this.linked.$off(this.update);
			}
			if(incoming) {
				incoming.$on("modified", this.update);
				Vue.set(this, "linked", incoming);
			}
		}
	},
	"mounted": function() {
		rsSystem.register(this);
		if(this.record && !this.linked) {
			this.record.$on("modified", this.update);
			Vue.set(this, "linked", this.record);
		}
	},
	"methods": {
		/**
		 * 
		 * @method update
		 */
		"update": function(event) {
			console.warn("Party Updated: ", event);
		}
	},
	"beforeDestroy": function() {
		if(this.linked) {
			this.linked.$off("modified", this.update);
		}
	},
	"template": Vue.templified("pages/rssw/party.html")
});
