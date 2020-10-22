
/**
 * 
 * 
 * @class RSSWShip
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWShip", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSComponentUtility,
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};

		data.additional_ships = [];
		data.entity = null;
		
		return data;
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
			var data = {},
				prep = [],
				ships,
				ship,
				x;
			
			if((this.entity && this.entity.id !== this.$route.params.oid)
					|| (!this.entity && this.$route.params.oid)) {
				ship = this.universe.nouns.entity[this.$route.params.oid];
				if(ship && this.isOwner(ship)) {
					Vue.set(this, "entity", ship);
				} else {
					console.warn("? ", this.isOwner(ship), ship);
				}
			}
	
			if(this.$route.query.ships) {
				ships = this.$route.query.ships.split(",");
				for(x=0; x<ships.length; x++) {
					ship = this.universe.indexes.entity.lookup[ships[x]];
					if(ship && ship.classification === "ship" && this.isOwner(ship)) {
						prep.push(ship);
					}
				}
			}
			
			if(prep.length !== this.additional_ships.length) {
				this.additional_ships.splice(0);
				for(x=0; x<prep.length; x++) {
					this.additional_ships.push(prep[x]);
				}
			}
		}
	},
	"beforeDestroy": function() {
		this.universe.$off("model:modified:complete", this.update);
	},
	"template": Vue.templified("pages/rssw/ship.html")
});
