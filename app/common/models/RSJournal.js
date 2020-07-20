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
}
