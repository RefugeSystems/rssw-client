/**
 * 
 * @class RSAction
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSAction extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		
	}
	
}

setTimeout(function() {
	RSAction.response = new SearchIndex();
	
	RSAction.response.indexItem({
		"id": "Draw",
		"function": function(source, target) {
			
		}
	});
}, 0);
 