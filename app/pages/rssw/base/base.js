
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

		data.entity = null;
		data.widgets = [];
		
		return data;
	},
	"watch": {
		"$route.params.oid": function(oid) {
			this.entity.$off("modified", this.update);
			Vue.set(this, "entity", this.universe.nouns.entity[this.$route.params.oid]);
			this.entity.$on("modified", this.update);
			this.update();
		}
	},
	"mounted": function() {
		if(this.$route.params.oid) {
			Vue.set(this, "entity", this.universe.nouns.entity[this.$route.params.oid]);
			this.entity.$on("modified", this.update);
		}
		rsSystem.register(this);
		this.update();
	},
	"methods": {
		"update": function() {
			console.warn("Base Update: ", this.entity, this.widgets);
			this.widgets.splice(0);
			if(this.entity) {
				if(this.entity.widgets) {
					this.widgets.push.apply(this.widgets, this.entity.widgets);
				}

				switch(this.entity.classification) {
					case "base":
					case "building":
					case "ship":
						this.widgets.push({
				            "declaration": "rsswEntityInside",
				            "sid": "entity:inside:" + this.entity.id,
				            "enabled": true
						});
						break;
				}
				
				this.widgets.push({
		            "declaration": "rsswEntityHistory",
		            "sid": "entity:history:" + this.entity.id,
		            "enabled": true
				});
			}
			console.warn("Updated: ", this.entity, this.widgets);
		}
	},
	"beforeDestroy": function() {
		this.entity.$off("modified", this.update);
	},
	"template": Vue.templified("pages/rssw/base.html")
});
