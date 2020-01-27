
/**
 * 
 * 
 * @class RSSWBase
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWBase", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};
		
		return data;
	},
	"computed": {
		"entity": function() {
			console.warn("Entity: ", this.universe.nouns.entity[this.$route.params.oid]);
			return this.universe.nouns.entity[this.$route.params.oid];
		}
	},
	"mounted": function() {
		rsSystem.register(this);
	},
	"methods": {
		
	},
	"template": Vue.templified("pages/rssw/base.html")
});
