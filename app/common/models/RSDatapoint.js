/**
 *
 * @class RSDatapoint
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSDatapoint extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}

	get name() {
		return this._coreData.property;
	}

	recalculateProperties() {
		var keys = Object.keys(this._coreData),
			x;

		for(x=0; x<keys.length; x++) {
			if(keys[x] !== "name" && keys[x] !== "description" && keys[x][0] !== "_" && typeof(this[keys[x]]) !== "function") {
				this[keys[x]] = this._coreData[keys[x]];
			}
		}

		if(!this.raw &&this.option_index) {
			if(this.universe.indexes[this.option_index]) {
				switch(this.type) {
					case "select":
						this.options = this.universe.indexes[this.option_index].listing;
						break;
					case "multireference":
						this.source_index = this.universe.indexes[this.option_index];
						break;
					default:
						rsSystem.log.warn("Unknown index usage type[" + this.type + "]", {"type": this.type});
				}
			} else {
				console.warn("Datapoint references invalid index", this);
			}
		}
	}
}
