
/**
 *
 *
 * @class RSSWLocality
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWLocality", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSComponentUtility,
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};

		data.currentlyInside = null;
		data.activeLocation = null;
		data.activeEntity = null;
		data.entities = [];
		data.events = [];
		data.nearBy = [];

		return data;
	},
	"mounted": function() {
		rsSystem.register(this);
		this.universe.$on("universe:modified:complete", this.update);
		this.update();
	},
	"methods": {

		"focusEntity": function(entity) {
			Vue.set(this, "activeEntity", entity);
			Vue.set(this, "activeLocation", this.universe.indexes.location.index[this.activeEntity.location]);
			Vue.set(this, "currentlyInside", this.universe.indexes.entity.index[this.activeEntity.inside]);
			this.update();
		},
		"update": function() {
			console.log("Updating...");
			var location,
				buffer,
				event,
				x,
				e;

//			for(x=0; x<this.events.length; x++) {
//				this.events[x].$off("modified", this.update);
//			}

			this.events.splice(0);
			for(x=0; x<this.universe.indexes.event.listing.length; x++) {
				event = this.universe.indexes.event.listing[x];
				if(event.active && event.category === "combat") {
					for(e=0; e<event.involved.length; e++) {
						buffer = this.universe.indexes.entity.index[event.involved[e]];
						if(buffer && buffer.owners && buffer.owners.indexOf(this.player.id) !== -1) {
//							event.$on("modified", this.update);
							this.events.push(event);
						}
					}
				}
			}

			this.nearBy.splice(0);
			if(this.activeEntity && this.activeLocation && this.activeLocation.locals && this.activeLocation.locals.length) {
				this.universe.indexes.entity.translate(this.activeLocation.locals, this.nearBy);
			}

			this.entities.splice(0);
			for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
				buffer = this.universe.indexes.entity.listing[x];
				if(buffer) {
					if(buffer.owners && buffer.owners.indexOf(this.player.id) !== -1) {
						this.entities.push(buffer);
					}
					if(!buffer.obscured && (!this.activeEntity || buffer.id !== this.activeEntity.id)) {
						if(this.activeLocation && this.activeLocation.auto_nearby && buffer.location === this.activeLocation.id) {
							this.nearBy.push(buffer);
						} else if(this.currentlyInside && this.currentlyInside.id === buffer.inside) {
							this.nearBy.push(buffer);
						}
					}
				}
			}
			this.entities.sort(this.sortData);
		}
	},
	"beforeDestroy": function() {
		console.log("Disengaging...");
		this.universe.$off("universe:modified:complete", this.update);
//		for(var x=0; x<this.events.length; x++) {
//			this.events[x].$off("modified", this.update);
//		}
	},
	"template": Vue.templified("pages/rssw/locality.html")
});
