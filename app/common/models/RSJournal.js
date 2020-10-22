/**
 * 
 * Ties Sessions to notes for a player or players. Also used by the Game Master
 * for note storage against sessions as well using a similar UI and data.
 * @class RSJournal
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSJournal extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		this._alterationLookup = {};
	}
	
	get name() {
		if(this.hidden) {
			if(this.hiddenName) {
				return this.hiddenName;
			} else {
				return "Unknown";
			}
		} else {
			if(this._coreData.name) {
				return this._coreData.name;
			} else if(this._coreData.session && this.universe.indexes.session && this.universe.indexes.session.index && this.universe.indexes.session.index[this._coreData.session]) {
				return this.universe.indexes.session.index[this._coreData.session].name;
			} else {
				return this.id;
			}
		}
	}
	
	recalculateHook() {
		var buffer,
			x;
		
		if(!this._search) {
			this._search = "";
		}
		
		buffer = this.universe.indexes.entity.index[this.editor];
		if(buffer) {
			this._search += " ||| " + buffer.name.toLowerCase();
		}
	}
}
