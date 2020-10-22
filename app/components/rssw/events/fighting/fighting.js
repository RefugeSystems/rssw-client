
/**
 *
 *
 * @class rsswFightingView
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_fightingviewComponentKey:";



	rsSystem.component("rsswFightingView", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSShowdown,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"event": {
				"required": true,
				"type": Object
			}
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"data": function() {
			var data = {};

			data.storageKeyID = storageKey + this.event.id;
			data.state = this.loadStorage(data.storageKeyID, {
				"search": ""
			});

			data.involved = [];

			return data;
		},
		"mounted": function() {
			this.event.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"getEntityStyling": function(entity) {
				var classes = "";

				if(this.event.state && this.event.state.current === entity.id) {
					classes += " current";
				}

				return classes;
			},
			"getIndicatorStyling": function(entity) {
				if(this.event.state && this.event.state.next === entity.id) {
					return "fas fa-clock";
				}
				if(this.event.state && this.event.state.current === entity.id) {
					return "fas fa-fas fa-chevron-double-right";
				}
				return "rs-transparent";
			},
			"sortInvolved": function(a, b) {
				if(this.event.order[a.id] && this.event.order[b.id]) {
					if(this.event.order[a.id] < this.event.order[b.id]) {
						return -1;
					} else if(this.event.order[a.id] > this.event.order[b.id]) {
						return 1;
					}
				} else if(this.event.order[a.id] && !this.event.order[b.id]) {
					return -1;
				} else if(!this.event.order[a.id] && this.event.order[b.id]) {
					return 1;
				}

				return 0;
			},

			"update": function() {
				console.log("Update...");
				this.involved.splice(0);
				this.universe.indexes.entity.translate(this.event.involved, this.involved);
				this.involved.sort(this.sortInvolved);
			}
		},
		"beforeDestroy": function() {
			console.log("Disengaging...");
			this.event.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/events/fighting.html")
	});
})();
