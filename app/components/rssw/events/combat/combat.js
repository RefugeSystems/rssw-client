
/**
 * 
 * 
 * @class rsswCombatView
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_combatviewComponentKey:",
		collater = new EventEmitter(),
		involved,
		inside,
		place;
	
	involved = {
		"label": "Involved",
		"property": "involved",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	inside = {
		"label": "Inside",
		"property": "inside",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	place = {
		"label": "Place",
		"property": "place",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	rsSystem.component("rsswCombatView", {
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
			},
			"event": function() {
				console.log("Tracking...");
				if(this.track) {
					this.track.$off("modified", this.update);
				}
				this.event.$on("modified", this.update);
				Vue.set(this, "track", this.event);
				this.update();
//			},
//			"event.state": {
//				"deep": true,
//				"handler": function(newValue) {
//					console.log("state");
//					this.event.commit({
//						"state": this.event.state
//					});
//				}
//			},
//			"event.order": {
//				"deep": true,
//				"handler": function(newValue) {
//					console.log("order");
//					this.event.commit({
//						"order": this.event.order
//					});
//				}
			}
		},
		"computed": {
			"description": function() {
				return this.rsshowdown(this.event.description || "");
			}
		},
		"data": function() {
			var data = {};
			
			involved.source_index = this.universe.indexes.entity;
			inside.source_index = this.universe.indexes.entity;
			place.source_index = this.universe.indexes.location;

			data.storageKeyID = storageKey + this.event.id;
			data.state = this.loadStorage(data.storageKeyID, {
				"search": ""
			});
			if(!data.state.history) {
				data.state.history = [];
			}
			if(!data.state.expression) {
				data.state.expression = "";
			}
			
			data.collater = collater;
			
			data.fields = [place, involved, inside];
			data.track = this.event;
			data.tracking = {};
			data.selected = [];
			data.involved = [];
			
			data.tracing = {};
			data.tracing.involved = [];
			data.tracing.inside = [];
			data.tracing.place = [];
			
			data.upNext = null;
			data.message = "";
			
			if(!this.event.state) {
				this.event.commit({
					"state": {}
				});
			}
			if(!this.event.order) {
				this.event.commit({
					"order": {}
				});
			}
			if(!this.event.dice) {
				this.event.commit({
					"dice": {}
				});
			}
			
			return data;
		},
		"mounted": function() {
			this.event.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"newRound": function() {
				var x;
				
				if(this.player.master) {
					if(this.event.state.round) {
						for(x=0; x<this.involved.length; x++) {
							if(!this.event.state[this.involved[x].id]) {
								Vue.set(this, "message", "Has Not Gone: " + this.involved[x].name);
								return false;
							}
						}
					}
					
					if(this.message) {
						Vue.set(this, "message", "");
					}
					
					if(this.event.state.round === undefined) {
						this.event.state.round = 1; 
					} else {
						this.event.state.round++;
					}
					if(this.involved.length) {
						this.event.state.current = this.involved[0].id;
						if(this.involved.length > 1) {
							this.event.state.next = this.involved[1].id;
						}
					}
					this.event.state.turn = 0;
					for(x=0; x<this.involved.length; x++) {
						this.event.state[this.involved[x].id] = false;
					}
					
					this.event.commit({
						"state": this.event.state
					});
					this.universe.send("game:round:start", this.event);
					
					return true;
				}
				
				return false;
			},
			"nextTurn": function() {
				if(this.player.master) {
					if(this.event.state.turn === undefined) {
						this.event.state.turn = 0; 
					} else {
						this.event.state.turn++;
					}
					if(this.event.state.turn < this.event.involved.length) {
						if(this.involved[this.event.state.turn]) {
							this.event.state.current = this.involved[this.event.state.turn].id;
							this.event.state.next = this.involved[(this.event.state.turn + 1)%this.involved.length].id;
						}
						this.event.commit({
							"state": this.event.state
						});
					}
					this.universe.send("game:round:turn", this.event);
				}
			},
			"unmarkAll": function() {
				for(var x=0; x<this.involved.length; x++) {
					Vue.set(this.event.state, this.involved[x].id, false);
				}
				this.$forceUpdate();
			},
			"markAll": function() {
				for(var x=0; x<this.involved.length; x++) {
					Vue.set(this.event.state, this.involved[x].id, true);
				}
				this.$forceUpdate();
			},
			"finishEvent": function() {
				if(this.player.master) {
					this.event.commit({
						"active": false
					});
				}
			},
			"openEvent": function() {
				if(this.player.master) {
					this.event.commit({
						"active": true
					});
				}
			},
			"toggleEntity": function(id) {
				Vue.set(this.event.state, id, !this.event.state[id]);
				this.event.commit({
					"state": this.event.state
				});
			},
			"selectEntity": function(entity) {
				if(this.tracking[entity.id]) {
					this.selected.splice(this.selected.indexOf(entity), 1);
					this.tracking[entity.id] = false;
				} else {
					this.tracking[entity.id] = true;
					this.selected.push(entity);
				}
			},
			"reorderInvolved": function() {
				this.event.commit({
					"order": this.event.order
				});
				
				this.involved.sort(this.sortInvolved);
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
			"setCurrent": function(entity) {
				Vue.set(this.event.state, "current", entity.id);
				this.event.commit({
					"state": this.event.state
				});
			},
			"getEntityStyling": function(entity) {
				var classes = "";
				
				if(this.event.state) {
					if(this.event.state.current === entity.id) {
						classes += " current";
					}
				}
				
				return classes;
			},
			"getIndicatorStyling": function(entity) {
				if(this.event.state.next === entity.id) {
					return "fas fa-clock";
				}
				if(this.event.state.current === entity.id) {
					return "fas fa-fas fa-chevron-double-right";
				}
				return "rs-transparent";
			},
			"traceRoll": function(roll) {
				this.collater.$emit("roll-expression", roll);
			},
			"sync": function(event) {
				var sync = {};
				sync[event.property] = event.value;
				this.event.commit(sync);
			},
			"update": function() {
				var track = {},
					buffer,
					x;
				
				this.involved.splice(0);
				for(x=0; x<this.involved.length; x++) {
					this.involved[x].$off("roll-expression", this.traceRoll);
					this.involved[x].$off("roll-skill", this.traceRoll);
				}
				if(this.event.involved) {
					for(x=0; x<this.event.involved.length; x++) {
						buffer = this.universe.indexes.entity.index[this.event.involved[x]];
						if(buffer) {
							buffer.$on("roll-expression", this.traceRoll);
							buffer.$on("roll-skill", this.traceRoll);
							this.involved.push(buffer);
							track[buffer.id] = true;
						}
					}
					this.involved.sort(this.sortInvolved);
				}
				
				for(x=0; x<this.selected.length; x++) {
					if(!track[this.selected[x].id]) {
						Vue.set(this.tracking, this.selected[x].id, false);
						this.selected.splice(x--, 1);
					}
				}
				
				this.tracing.involved.splice(0);
				if(this.event.involved) {
					for(x=0; x<this.event.involved.length; x++) {
						this.tracing.involved.push(this.event.involved[x]);
					}
				}
				this.tracing.inside.splice(0);
				if(this.event.inside) {
					for(x=0; x<this.event.inside.length; x++) {
						this.tracing.inside.push(this.event.inside[x]);
					}
				}
				this.tracing.place.splice(0);
				if(this.event.place) {
					for(x=0; x<this.event.place.length; x++) {
						this.tracing.place.push(this.event.place[x]);
					}
				}
				
				if(this.event.state.next) {
					buffer = this.universe.indexes.entity.index[this.event.state.next];
					if(buffer) {
						Vue.set(this, "upNext", buffer);
					}
				}
			}
		},
		"beforeDestroy": function() {
			this.event.$off("modified", this.update);
			for(var x=0; x<this.involved.length; x++) {
				this.involved[x].$off("roll-expression", this.traceRoll);
				this.involved[x].$off("roll-skill", this.traceRoll);
			}
		},
		"template": Vue.templified("components/rssw/events/combat.html")
	});
})();