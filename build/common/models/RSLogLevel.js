
/**
 * Piggy-backing on the standard load process, these are loaded as common objects
 * but exist only to modify the universes active level.
 * 
 * While this class is registered, it shoould be ignored.
 * @class RSLogLevel
 * @constructor
 * @module Common
 * @param {RSUniverse} universe
 * @param {Object} details 
 * @param {Number} [details.level] The level to set such as "info", or "error"
 * @param {Number} [details.value] The value to set for the passed level
 * @param {Number} [details.setTracked] The number of entries the client universe should
 * 		track. 
 */
class RSLogLevel {
	constructor(details, universe) {
		if(details.level) {
			universe.log.levels[details.level] = details.value;
		}
		if(details.setTracked) {
			universe.log.tracked = details.setTracked;
		}
	}
}

RSLogLevel.ignore = true;
