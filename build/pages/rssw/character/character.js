
/**
 * 
 * 
 * @class RSSWCharacter
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWCharacter", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};
		
		data.widgets = [];
		
		return data;
	},
	"computed": {
		"entity": function() {
			return this.universe.nouns.entity[this.$route.params.oid];
		}
	},
	"mounted": function() {
		this.entity.$on("modified", this.update);
		rsSystem.register(this);
		this.update();
	},
	"methods": {
		"update": function() {
			this.widgets.splice(0);
			if(this.entity.widgets) {
				this.widgets.push.apply(this.widgets, this.entity.widgets);
			}
			this.widgets.push({
	            "declaration": "rsswEntityHistory",
	            "sid": "ihoihou",
	            "enabled": true
			});
		}
	},
	"beforeDestroy": function() {
		this.entity.$off("modified", this.update);
	},
	"template": Vue.templified("pages/rssw/character.html")
});
