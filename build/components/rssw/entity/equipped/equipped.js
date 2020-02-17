
/**
 * 
 * 
 * @class rsswEntityEquipment
 * @constructor
 * @module Components
 */
(function() {
	

	var emptyRef = {},
		emptySlotIndicator = {
			"id": "__emptyslot",
			"_type": "empty_slot",
			"name": "Empty Slot",
			"icon": "far fa-square",
			"description": "An empty ${~target.name,rs-blue}$ slot on ${~base.name,rs-blue}$"
		};

	var consumedRef = {},
		consumedSlotIndicator = {
			"id": "__consumedslot",
			"_type": "consumed_slot",
			"name": "Consumed Slot",
			"icon": "fas fa-square",
			"description": "This ${~target.name,rs-blue}$ slot on ${~base.name,rs-blue}$ is being used as space for another component"
		};


	rsSystem.component("rsswEntityEquipment", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": Object
			},
			"state": {
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.mode = this.state?this.state.mode:"short";
			
			data.slotMapping = {};
			data.slotCounts = {};
			data.slotKeys = [];
			data.slots = {};
			
			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			
			this.universe.$on("model:modified", this.updateFromUniverse);
			this.entity.$on("modified", this.update);
			
			this.updateFromUniverse();
			this.update();
		},
		"watch": {
			"entity": function() {
				this.update();
			}
		},
		"methods": {
			
			"getSlotClass": function(slot, equipment, index) {
				if(this.entity._relatedErrors[equipment.id]) {
					return "rs-red";
				}
				if(equipment._type === emptySlotIndicator._type) {
					return "rs-green";
				}
				if(equipment._type === consumedSlotIndicator._type) {
					return "rs-orange";
				}
				
				if( (this.entity[slot.accepts] && this.entity[slot.accepts].indexOf(equipment.id) === -1)
						|| !(slot.itemtype && slot.itemtype.length && equipment.itemtype && equipment.itemtype.length && this.sharesOne(slot.itemtype, equipment.itemtype))
						|| (slot.accepts !== equipment._type)) {
					return "rs-light-red";
				}
				
				return "rs-blue";
			},
			
			"getModeClassing": function() {
				var mode = this.mode,
					state;
				if(!mode && this.state) {
					mode = this.state.mode;
				}

				if(typeof(mode) === "string") {
					mode = mode.split(/[\s]+/);
				} else {
					mode = "short";
				}
				
				state = mode[0];
				
				switch(state) {
					case "long":
						return state;
					default:
						mode;
				}
				
				return "short";
			},
			/**
			 * 
			 * @method equipSlot
			 * @param {RSSlot} slot To receive the record
			 * @param {RSItem | RSRoom | RSEntity} record To place to the passed slot
			 */
			"equipSlot": function(slot, record) {
				this.entity.equipSlot(slot, record);
			},
			
			"recalculateSlots": function() {
				var buffer,
					hold,
					x;

				for(x=0; x<this.slotKeys.length; x++) {
					Vue.delete(this.slots, this.slotKeys[x]);
				}
				this.slotKeys.splice(0);
				if(this.entity.slot) {
					for(x=0; x<this.entity.slot.length; x++) {
						if(this.slots[this.entity.slot[x]]) {
							Vue.set(this.slotCounts, this.entity.slot[x], this.slotCounts[this.entity.slot[x]] + 1);
						} else {
							Vue.set(this.slots, this.entity.slot[x], this.universe.indexes.slot.lookup[this.entity.slot[x]]);
							Vue.set(this.slotCounts, this.entity.slot[x], 1);
							this.slotKeys.push(this.entity.slot[x]);
							if(!this.slotMapping[this.entity.slot[x]]) {
								Vue.set(this.slotMapping, this.entity.slot[x], []);
							}
						}
					}
				}
			},
			
			"getEmptyIndicator": function(slot) {
				if(!emptyRef[slot]) {
					emptyRef[slot] = Object.assign({}, emptySlotIndicator);
					emptyRef[slot].id += slot;
				}
				return emptyRef[slot];
			},
			
			"getConsumedIndicator": function(slot) {
				if(!consumedRef[slot]) {
					consumedRef[slot] = Object.assign({}, consumedSlotIndicator);
					consumedRef[slot].id += slot;
				}
				return consumedRef[slot];
			},
			"updateFromUniverse": function() {
				this.recalculateSlots();
				this.slotKeys.sort(this.sortData);
			},
			"update": function() {
				var buffer,
					count,
					hold,
					keys,
					sub,
					i,
					x,
					y,
					z;

				if(this.state) {
					Vue.set(this, "mode", this.state.mode || "short");
				}
				
				
				this.recalculateSlots();

				keys = Object.keys(this.slotMapping);
				for(x=0; x<keys.length; x++) {
					this.slotMapping[keys[x]].splice(0);
				}
				
				if(this.entity.equipped) {
					keys = Object.keys(this.entity.equipped);
					for(x=0; x<keys.length; x++) {
						if(this.entity.equipped[keys[x]]) {
							sub = Object.keys(this.entity.equipped[keys[x]]);
							for(y=0; y<sub.length; y++) {
								if(!this.slotMapping[sub[y]]) {
									Vue.set(this.slotMapping, sub[y], []);
								}
								for(z=0; z<this.entity.equipped[keys[x]][sub[y]].length; z++) {
									buffer = this.universe.index.lookup[this.entity.equipped[keys[x]][sub[y]][z]];
									if(buffer) {
										this.slotMapping[sub[y]].push(buffer);
										if(1 < buffer.slots_used) {
											for(i=1; i<buffer.slots_used; i++) {
												this.slotMapping[sub[y]].push(this.getConsumedIndicator(keys[x]));
											}
										}
									} else {
										console.warn("Unable to find equipped record[" + this.entity.equipped[keys[x]][sub[y]][z] + "] for entity[" + this.id + "]");
									}
								}
							}
						}
					}
				}

				keys = Object.keys(this.slotMapping);
				for(x=0; x<keys.length; x++) {
					count = this.slotCounts[keys[x]] - this.slotMapping[keys[x]].length;
					for(z=0; z<count; z++) {
						this.slotMapping[keys[x]].push(this.getEmptyIndicator(keys[x]));
					}
				}
				
				this.slotKeys.sort(this.sortData);
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("model:modified", this.updateFromUniverse);
			this.entity.$off("model:modified", this.update);
		},
		"template": Vue.templified("components/rssw/entity/equipped.html")
	});
})();