
/**
 * 
 * 
 * @class rsswEntityInside
 * @constructor
 * @module Components
 */
(function() {
	
	var byName = function(a, b) {
		a = (a.name || "").toLowerCase();
		b = (b.name || "").toLowerCase();
		if(a < b) {
			return -1;
		} else if(a > b) {
			return 1;
		} else {
			return 0;
		}
	};

	rsSystem.component("rsswEntityInside", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.availableEntities = [];
			data.entities = [];
			data.moving = "";
			data.crew = 0;
			
			return data;
		},
		"mounted": function() {
			this.universe.$on("model:modified:complete", this.update);
			rsSystem.register(this);
			this.update();
		},
		"watch": {
			"entity": function() {
				this.update();
			}
		},
		"methods": {
			"moveEntity": function(entity, destination) {
				entity = this.universe.indexes.entity.index[entity];
				if(entity && this.isOwner(entity)) {
					entity.commit({
						"inside": destination
					});
				}
				Vue.set(this, "moving", null);
			},
			"showInfo": function(view) {
				if(this.isOwner(view)) {
					rsSystem.EventBus.$emit("display-info", {
						"source": this.entity,
						"record": view
					});
				}
			},
			"getCountClass": function() {
				if(this.entity.required_crew) {
					var p;
					
					p = this.crew / this.entity.required_crew;
					
					if(0 <= p && p < .6) {
						return "rs-light-red";
					} else if(.6 <= p && p < 1) {
						return "rs-light-orange";
					}
				}
				if(this.entity.maximum_crew) {
					if(this.entity.maximum_crew < this.crew) {
						return "rs-red";
					}
				}
				return "rs-green";
			},
			"update": function() {
				var crew = 0,
					buffer,
					x;

				this.entities.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					buffer = this.universe.indexes.entity.listing[x];
					if(buffer.inside === this.entity.id) {
						this.entities.push(buffer);
						if(buffer.classification === "character" && !buffer.mob) {
							crew++;
						}
					}
				}
				Vue.set(this, "crew", crew);
				this.entities.sort(byName);
				
				this.availableEntities.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					buffer = this.universe.indexes.entity.listing[x];
					if(this.isOwner(buffer) && this.entities.indexOf(buffer.id) === -1 && buffer.id !== this.entity.id && buffer.inside !== this.entity.id) {
						this.availableEntities.push(buffer);
					}
				}
				this.availableEntities.sort(byName);
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("model:modified:complete", this.update);
		},
		"template": Vue.templified("components/rssw/ship/inside.html")
	});
})();