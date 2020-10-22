
/**
 *
 *
 * @class RSSWShop
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWShop", {
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
			return this.universe.nouns.entity[this.$route.params.oid];
		},
		"customer": function() {
			return this.universe.nouns.entity[this.$route.params.cid];
		}
	},
	"watch": {
		"$route": {
			"deep": true,
			"handler": function() {
				this.update();
			}
		}
	},
	"mounted": function() {
		rsSystem.register(this);
		this.universe.$on("model:modified:complete", this.update);
		this.update();
	},
	"methods": {
		"update": function() {

		}
	},
	"beforeDestroy": function() {
		this.universe.$off("model:modified:complete", this.update);
	},
	"template": Vue.templified("pages/rssw/shop.html")
});
