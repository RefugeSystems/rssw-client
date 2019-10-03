
/**
 * General event bus for the system
 * @class rsSystem.EventBus
 * @constructor
 * @extends EventEmitter
 * @static
 */
(function() {
	
	class EventBus extends EventEmitter {
		constructor() {
			super();
		}
	}
	
	rsSystem.EventBus = new EventBus();
})();
