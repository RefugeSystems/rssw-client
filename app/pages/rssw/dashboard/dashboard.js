
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
		rsSystem.components.RSComponentUtility,
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};
		
		data.self = this.universe.nouns.entity[this.universe.nouns.player[this.user.id].entity];
		data.selectedEntities = [];
		data.owned = [];
		
		return data;
	},
	"mounted": function() {
		this.universe.$on("universe:modified", this.updateEntities);
		this.universe.$on("model:modified", this.updateEntities);
		rsSystem.register(this);
		
		this.updateEntities();
	},
	"methods": {
		"canOpenDashboard": function() {
			return !!this.selectedEntities.length;
		},
		"toggleSelect": function(record) {
			var index = this.selectedEntities.indexOf(record);
			if(index === -1) {
				this.selectedEntities.push(record);
			} else {
				this.selectedEntities.splice(index, 1);
			}
		},
		"isSelected": function(record) {
			return this.selectedEntities.indexOf(record) !== -1;
		},
		"openDashboard": function(type, external) {
			var eids = [].concat(this.selectedEntities),
				primary = null,
				x;
			
			switch(type) {
				case "ship":
					for(x=0; !primary && x<this.selectedEntities.length; x++) {
						if(this.selectedEntities[x].entity === this.self.id) {
							primary = this.selectedEntities[x].id;
							eids.splice(x, 1);
						}
					}
					
					if(!primary) {
						primary = this.selectedEntities[0].id;
						eids.splice(0, 1);
					}

					for(x=0; x<eids.length; x++) {
						eids[x] = eids[x].id;
					}
					
					if(external) {
						window.open(location.pathname + "#/dashboard/ship/" + primary + "?ships=" + eids.join(","), "dashboard");
					} else {
						window.location = location.pathname + "#/dashboard/ship/" + primary + "?ships=" + eids.join(",");
					}
					break;
				case "character":
					for(x=0; !primary && x<this.selectedEntities.length; x++) {
						if(this.selectedEntities[x].entity === this.self.id) {
							primary = this.selectedEntities[x].id;
							eids.splice(x, 1);
						}
					}
					
					if(!primary) {
						primary = this.selectedEntities[0].id;
						eids.splice(0, 1);
					}

					for(x=0; x<eids.length; x++) {
						eids[x] = eids[x].id;
					}
					
					if(external) {
						window.open(location.pathname + "#/dashboard/character/" + primary + "?characters=" + eids.join(","), "dashboard");
					} else {
						window.location = location.pathname + "#/dashboard/character/" + primary + "?characters=" + eids.join(",");
					}
					break;
			}
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
//					entity.$on("modified", this.updateDisplay);
					owned.push(entity);
				}
			}
			
			Vue.set(this, "self", this.universe.nouns.entity[this.universe.nouns.player[this.user.id].entity]);
			this.owned.splice(0);
			this.owned.push.apply(this.owned, owned);
			this.owned.sort(this.sortData);
		}
	},
	"beforeDestroy": function() {
		this.universe.$off("universe:modified", this.updateEntities);
		this.universe.$off("model:modified", this.updateEntities);
	},
	"template": Vue.templified("pages/rssw/dashboard.html")
});
