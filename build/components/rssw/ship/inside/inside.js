
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
			
			return data;
		},
		"mounted": function() {
			this.universe.$on("model:modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"watch": {
			
		},
		"methods": {
			"isOwner": function(record) {
				return !record.template && (record.owner === this.player.id || (!record.owner && record.owners && record.owners.indexOf(this.player.id) !== -1));
			},
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
			"update": function() {
				var buffer,
					x;

				this.entities.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					buffer = this.universe.indexes.entity.listing[x];
					if(buffer.inside === this.entity.id) {
						this.entities.push(buffer);
					}
				}
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
			this.universe.$off("model:modified", this.update);
		},
		"template": Vue.templified("components/rssw/ship/inside.html")
	});
})();