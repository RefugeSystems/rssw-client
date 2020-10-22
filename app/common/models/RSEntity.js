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
		if(this._coreData.effect) {
			this._effectBuffer = JSON.parse(JSON.stringify(this._coreData.effect));
		} else {
			this._effectBuffer = [];
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

	/**
	 *
	 * @method assignEffect
	 * @param {RSEffect} effect
	 * @param {Object} [details]
	 */
	assignEffect(effect, details) {
		effect = effect.id || effect;
		details = details || {};
		details.id = effect + ":" + this._effectBuffer.length + ":" + Date.now();
		details._sourced = effect;
		details.time = this.universe.time_game || this.universe.time || Date.now();
		this._effectBuffer.push(details);
		this.commit({
			"effect": this._effectBuffer
		});
	}


	assignEffectIndicator(detail_id, indicator) {
		detail_id = detail_id.id || detail_id;

		if(detail_id && this._effectBuffer.length) {
			var index = -1,
				x;

			if(!indicator) {
				indicator = null;
			}

			for(x=0; index === -1 && x<this._effectBuffer.length; x++) {
				if(this._effectBuffer[x].id === detail_id) {
					index = x;
				}
			}

			if(index !== -1) {
				this._effectBuffer[index].indicator = indicator;
				this.commit({
					"effect": this._effectBuffer
				});
				return true;
			}
		}

		return false;
	}


	editEffect(detail_id, details) {
		detail_id = detail_id.id || detail_id;

		if(detail_id && this._effectBuffer.length && details) {
			var index = -1,
				x;

			for(x=0; index === -1 && x<this._effectBuffer.length; x++) {
				if(this._effectBuffer[x].id === detail_id) {
					index = x;
				}
			}

			if(index !== -1) {
				Object.assign(this._effectBuffer[index],  details);
				this.commit({
					"effect": this._effectBuffer
				});
				return true;
			}
		}
	}

	dismissEffect(detail_id) {
		detail_id = detail_id.id || detail_id;

		if(detail_id && this._effectBuffer.length) {
			var index = -1,
				x;

			for(x=0; index === -1 && x<this._effectBuffer.length; x++) {
				if(this._effectBuffer[x].id === detail_id) {
					index = x;
				}
			}

			if(index !== -1) {
				this._effectBuffer.splice(index, 1);
				this.commit({
					"effect": this._effectBuffer
				});
				return true;
			}
		}

		return false;
	}

	recalculateHook() {
//		var pilot,
//			stats,
//			x;
//
//		if(this.pilot && (pilot = this.universe.indexes.entity.index[this.pilot])) {
//			stats = [
//				"evasion",
//				"attack",
//				"shield",
//				"hull"
//			];
//
//			for(x=0; x<stats.length; x++) {
//				if(pilot["bonus_" + stats[x]]) {
//					this[stats[x]] += pilot["bonus_" + stats[x]];
//				}
//			}
//		}
		var buffer,
			x;

		this.encumberance_max = 5 + (this.brawn || 0) + (this.encumberance_bonus || 0);
		this.encumberance = 0;
		buffer = this.universe.indexes.item.translate(this.item);
		for(x=0; x<buffer.length; x++) {
			if(buffer[x].encumberance) {
				this.encumberance += buffer[x].encumberance;
			}
		}
		
		if(this.is_shop) {
			this.rarity_max = this.rarity_max || 5;
			this.rarity_min = this.rarity_min || 0;
			this.rarity_mean = this.rarity_mean || ( (this.rarity_max - this.rarity_min)/2 + this.rarity_min);
			this.rarity_spread = this.rarity_spread || 1;
			this.rarity_inverted = 1/this.rarity_spread;
		}
		
		if(this.rarity_mean !== undefined && this.rarity_max < this.rarity_mean) {
			this.rarity_mean = this.rarity_max;
		} else if(this.rarity_mean !== undefined && this.rarity_mean < this.rarity_min) {
			this.rarity_mean = this.rarity_min;
		}
		
		if(this.linked_location && (buffer = this.universe.indexes.location.index[this.linked_location]) && buffer.image) {
			this.image = buffer.image;
		}
	}

	/**
	 *
	 * @method setPilot
	 * @param {RSEntity} pilot
	 */
	setPilot(pilot) {

	}
	
	restockFunction(rarity) {
		if(!this.is_shop || !this.restock_base) {
			return 0;
		}
		return -1 * Math.pow(this.rarity_inverted * rarity - this.rarity_inverted * this.rarity_mean, 2) + this.restock_base;
	}

	/**
	 *
	 * @method equipSlot
	 * @param {String | RSSlot} slot
	 * @param {String | RSEntity | RSItem | RSRoom} equip
	 */
	equipSlot(slot, equip) {
		if(typeof(slot) === "string") {
			slot = this.universe.index.lookup[slot];
		}

		if(typeof(equip) === "string") {
			equip = this.universe.index.lookup[equip];
		}

		// TODO: Implement item.entity property for stat inheritance (uses entity:equip event)

		if(slot.accepts && equip._type === slot.accepts) {
			if((slot.itemtype && slot.itemtype.hasCommon(equip.itemtype)) || (slot.type && slot.type.hasCommon(equip.type))) {
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
			} else {
				console.warn("Slot[" + slot.id + "] does not accept that equipment type");
			}
		} else if(!slot.accepts) {
			console.warn("Slot[" + slot.id + "] accepts no records");
		} else if(slot.accepts !== equip._class) {
			console.warn("Slot[" + slot.id + "] does not accept that equipment class[" + equip._class + "@" + equip.id + "]");
		}
	}

	/**
	 *
	 * @method unequipSlot
	 * @param {String | RSSlot} slot
	 * @param {String | RSEntity | RSItem | RSRoom} equip
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
