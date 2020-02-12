/**
 * Handles what would commonly be considered Players or other such beings, structures, or vehicles.
 * @class RSEntity
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSEntity extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		if(this._coreData.equipped) {
			this._equipBuffer = JSON.parse(JSON.stringify(this._coreData.equipped));
		} else {
			this._equipBuffer = {};
		}
		if(!details.location) {
			details.location = "location:universe";
		}
//		this._tracking = {};
//		if(!this.history) {
//			this.history = [];
//		}
//		
//		this._tracked = [
//			"location",
//			"credits",
//			"brawn",
//			"agility",
//			"intellect",
//			"cunning",
//			"willpower",
//			"pressence",
//			"xp"
//		];
//		
//		this._trackedDiff = [
//			"archetype",
//			"knowledge",
//			"ability",
//			"item"
//		];
	}
	
	recalculateHook() {
		var pilot,
			stats,
			x;
		
		if(this.pilot && (pilot = this.universe.indexes.entity.index[this.pilot])) {
			stats = [
				"evasion",
				"attack",
				"shield",
				"hull"
			];
			
			for(x=0; x<stats.length; x++) {
				if(pilot["bonus_" + stats[x]]) {
					this[stats[x]] += pilot["bonus_" + stats[x]];
				}
			}
		}
	}
	
	/**
	 * 
	 * @method setPilot
	 * @param {RSEntity} pilot
	 */
	setPilot(pilot) {
		
	}
	
	/**
	 * 
	 * @method equipSlot
	 * @param {RSSlot} slot
	 * @param {RSEntity | RSItem | RSRoom} equip
	 */
	equipSlot(slot, equip) {
		if(typeof(slot) === "string") {
			slot = this.universe.index.lookup[slot];
		}

		if(typeof(equip) === "string") {
			equip = this.universe.index.lookup[equip];
		}
		
		if(slot.accepts && equip._type === slot.accepts) {
			if(!this._equipBuffer[slot.accepts]) {
				this._equipBuffer[slot.accepts] = {};
			}
			if(!this._equipBuffer[slot.accepts][slot.id]) {
				this._equipBuffer[slot.accepts][slot.id] = [];
			}
			this._equipBuffer[slot.accepts][slot.id].push(equip.id);
			
			this.commit({
				"equipped": this._equipBuffer
			});
		} else if(!slot.accepts) {
			console.warn("Slot[" + slot.id + "] accepts no records");
		} else if(slot.accepts !== equip._type) {
			console.warn("Slot[" + slot.id + "] does not accept that equipment type[" + equip._type + "@" + equip.id + "]");
		}
	}
	
	/**
	 * 
	 * @method unequipSlot
	 * @param {RSSlot} slot
	 * @param {RSEntity | RSItem | RSRoom} equip
	 */
	unequipSlot(slot, equip) {
		var index;
		
		if(typeof(slot) === "string") {
			slot = this.universe.index.lookup[slot];
		}

		if(typeof(equip) === "string") {
			equip = this.universe.index.lookup[equip];
		}
		
		if(slot.accepts && this._equipBuffer[slot.accepts] && this._equipBuffer[slot.accepts][slot.id] && (index = this._equipBuffer[slot.accepts][slot.id].indexOf(equip.id)) !== -1) {
			this._equipBuffer[slot.accepts][slot.id].splice(index, 1);
			
			this.commit({
				"equipped": this._equipBuffer
			});
		} else if(!slot.accepts) {
			console.warn("Slot[" + slot.id + "] accepts no records");
		} else if(index === -1) {
			console.warn("Slot[" + slot.id + "] does not have that equipment[" + equip.id + "] equipped");
		}
	}
	
//	addHistory(event, delay) {
//		this.history.unshift(event);
//		if(this.history.length > 300) {
//			this.history.pop();
//		}
//		if(!delay) {
//			this.commit({
//				"history": this.history
//			});
//		}
//	}
	
//	loadDeltaHook(event) {
//		if(this._trackHistory) {
//			var commit = false,
//				diffNew,
//				diffOld,
//				tests,
//				x,
//				y;
//			
//			for(x=0; x<this._tracked.length; x++) {
//				if(this._tracking[this._tracked[x]] === undefined || this._tracking[this._tracked[x]] === null) {
//					this._tracking[this._tracked[x]] = this[this._tracked[x]];
//				} else if(this._tracking[this._tracked[x]] !== this[this._tracked[x]]) {
//					commit = true;
//					this.addHistory({
//						"type": this._tracked[x],
//						"previous": this._tracking[this._tracked[x]],
//						"current": this[this._tracked[x]],
//						"time": Date.now()
//						// TODO: Session & Universe Time support
//					}, true);
//				}
//			}
//			
//			for(x=0; x<this._trackedDiff.length; x++) {
//				if(this._tracking[this._trackedDiff[x]] === undefined || this._tracking[this._trackedDiff[x]] === null) {
//					this._tracking[this._trackedDiff[x]] = this[this._trackedDiff[x]];
//				} else if(this._tracking[this._trackedDiff[x]] && this[this._trackedDiff[x]] && this._tracking[this._trackedDiff[x]].length !== this[this._trackedDiff[x]].length) {
//					diffNew = {};
//					diffOld = {};
//					// TODO: Finish adding up IDs and then computing difference
//					
//					for(y=0; y<this._trackedDiff[this._tracked].length; y++) {
//						if(!diffOld[this._trackedDiff[this._tracked][y]]) {
//							diffOld[this._trackedDiff[this._tracked][y]] = 1;
//						} else {
//							diffOld[this._trackedDiff[this._tracked][y]]++;
//						}
//					}
//					
//					commit = true;
//					this.addHistory({
//						"type": this._tracked,
//						"previous": this._tracking[this._tracked],
//						"current": this[this._tracked],
//						"time": Date.now()
//						// TODO: Session & Universe Time support
//					}, true);
//				}
//			}
//			
//			if(commit) {
//				this.commit({
//					"history": this.history
//				});
//			}
//		}
//	}
}
