
/**
 * 
 * 
 * @class rsswMasterResults
 * @constructor
 * @module Components
 * @param {String} [wid] To identify this widget in storage for uniqueness.
 */
(function() {
	var storageKey = "_rs_resultviewComponentKey:";
	
	rsSystem.component("rsswMasterResults", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"wid": {
				"type": String
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

			data.storageKeyID = storageKey + this.wid;
			data.state = this.loadStorage(data.storageKeyID, {});
			if(!data.state.seen) {
				data.state.seen = {};
			}
			if(!data.state.max) {
				data.state.max = 2;
			}
			if(!data.state.options) {
				data.state.options = {};
			}
			if(data.state.options.hide_names === undefined) {
				data.state.options.hide_names = true;
			}
			
			data.entities = [];
			data.active = {};
			return data;
		},
		"mounted": function() {
			this.universe.$on("entity:rolled", this.receiveRoll);
			rsSystem.register(this);
			this.load();
		},
		"methods": {
			"receiveRoll": function(roll) {
				if(roll && roll.id) {
					if(!this.active[roll.id]) {
						Vue.set(this.active, roll.id, this.universe.indexes.entity.index[roll.id]);
						this.entities.push(this.active[roll.id]);
						Vue.set(this.state.seen, roll.id, []);
					}
					if(this.active[roll.id]) {
						this.state.seen[roll.id].unshift(roll);
						if(this.state.seen[roll.id].length > this.state.max) {
							this.state.seen[roll.id].splice(this.state.max);
						}
					} else {
						rsSystem.log.warn("Roll indicator received for unknown entity", roll);
					}
				} else {
					rsSystem.log.warn("Unknown roll indicator received", roll);
				}
			},
			
			"dismissEntity": function(entity, index) {
				if(entity && index !== undefined) {
					Vue.delete(this.state.seen, entity.id);
					Vue.delete(this.active, entity.id);
					this.entities.splice(index, 1);
				}
			},
			
			"selectRoll": function(roll) {
				Vue.set(this.state, "active_roll", roll.echo);
				this.$emit("selecting", roll);
			},
			
			"dismissRoll": function(entity, index) {
				if(entity && this.state.seen[entity.id] && index !== undefined) {
					this.state.seen[entity.id].splice(index, 1);
				}
			},
			
			"load": function() {
				var keys = Object.keys(this.state.seen),
					buffer,
					x;
				
				for(x=0; x<keys.length; x++) {
					buffer = this.universe.indexes.entity.index[keys[x]];
					if(buffer) {
						this.active[keys[x]] = buffer;
						this.entities.push(buffer);
					}
				}
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("entity:rolled", this.receiveRoll);
		},
		"template": Vue.templified("components/rssw/master/results.html")
	});
})();