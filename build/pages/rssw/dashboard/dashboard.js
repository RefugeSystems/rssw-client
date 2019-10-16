
/**
 * 
 * 
 * @class RSSWDashboard
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWDashboard", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"mounted": function() {
		this.universe.$on("universe:modified", this.updateEntities);
		this.universe.$on("model:modified", this.updateDisplay);
		rsSystem.register(this);
	},
	"data": function() {
		var data = {},
			entities,
			entity,
			x;
		
		entities = Object.keys(this.universe.nouns.entity);
		data.owned = [];
		for(x=0; x<entities.length; x++) {
			entity = this.universe.nouns.entity[entities[x]];
			if(entity && entity.owners && entity.owners.indexOf(this.user.id) !== -1) {
				entity.$on("modified", this.updateDisplay);
				data.owned.push(entity);
			}
		}
		
		return data;
	},
	"computed": {
		"self": function() {
			return this.universe.nouns.entity[this.universe.nouns.player[this.user.id].self];
		}
	},
	"methods": {
		"updateDisplay": function() {
			this.$forceUpdate();
		},
		"updateEntities": function() {
			var entities,
				entity,
				owned,
				x;
			
			for(x=0; x<this.owned.length; x++) {
				this.owned[x].$off("modified", this.updateDisplay);
			}
			
			entities = Object.keys(this.universe.nouns.entity);
			owned = [];
			for(x=0; x<entities.length; x++) {
				entity = this.universe.nouns.entity[entities[x]];
				if(entity && entity.owners && entity.owners.indexOf(this.player.id) !== -1) {
					entity.$on("modified", this.updateDisplay);
					owned.push(entity);
				}
			}
			
			this.owned.splice(0);
			this.owned.push.apply(this.owned, owned);
			this.$forceUpdate();
		}
	},
	"beforeDestroy": function() {
		this.universe.$off("universe:modified", this.updateEntities);
		this.universe.$off("model:modified", this.updateDisplay);
	},
	"template": Vue.templified("pages/rssw/dashboard.html")
});
