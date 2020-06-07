/**
 * Used to track various settings in the Universe such as date, drop locations,
 * or anything else the Game Master may want tracked.
 * @class RSSetting
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSSetting extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}
}