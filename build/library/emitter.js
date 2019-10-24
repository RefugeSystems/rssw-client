
/**
 * General class for replicating event emission properties to have classes
 * act as emitters.
 * @class EventEmitter
 * @constructor
 * @module Library
 */
class EventEmitter {
	constructor() {
		this._listeners = {};
		this._bindedListeners = {};
		this._onceListeners = {};
		this._bound = [];
	}
	
	get _events() {
		return Object.keys(this._listeners);
	}

	/**
	 * 
	 * @method $bounded
	 * @param {Object} [anchor]
	 * @param {Function} [anchor.$emit]
	 */
	$bounded(anchor) {
		if(this._bound.indexOf(anchor) === -1) {
			this._bound.push(anchor);
		}
	};

	/**
	 * Remove the anchor from the event emission
	 * @method $unbounded
	 * @param {Object} [anchor]
	 */
	$unbounded(anchor) {
		var index = this._bound.indexOf(anchor);
		if(index !== -1) {
			this._bound.splice(index, 1);
		}
	}
	
	/**
	 * 
	 * @method $on
	 * @param {String} [event]
	 * @param {Function} listener
	 */
	$on(event, listener) {
//		console.warn("Listening[" + this.id + "] on " + event + ": " + listener._owningID);
		if(typeof listener !== "function") {
			rsSystem.log.error("Listener is not a function: ", listener);
		}
		
		if(listener === undefined) {
			listener = event;
			event = undefined;
		}
		this._listeners[event] = this._listeners[event] || [];
		if(this._listeners[event].indexOf(listener) === -1) {
			this._listeners[event].push(listener);
		}
	}
	
	
	$bindedOn(event, listener, bindTo) {
		if(typeof listener !== "function") {
			rsSystem.log.error("Listener is not a function: ", listener);
		}
		
		if(listener === undefined) {
			listener = event;
			event = undefined;
		}
		this._bindedListeners[event] = this._bindedListeners[event] || [];
		this._bindedListeners[event].push({
			"listener": listener,
			"binding": bindTo
		});
		return this._bindedListeners[event].length - 1;
	}

	/**
	 * 
	 * @method $once
	 * @param {String} [event]
	 * @param {Function} listener
	 */
	$once(event, listener) {
		if(listener === undefined) {
			listener = event;
			event = undefined;
		}
		this._onceListeners[event] = this._onceListeners[event] || [];
		if(this._onceListeners[event].indexOf(listener) === -1) {
			this._onceListeners[event].push(listener);
		}
	}

	/**
	 * 
	 * @method $off
	 * @param {String} [event]
	 * @param {Function} listener
	 */
	$off(event, listener) {
		var x;
		
		if(listener === undefined) {
			listener = event;
			event = undefined;
		}
		this._onceListeners[event] = this._onceListeners[event] || [];
		if( (x = this._onceListeners[event].indexOf(listener)) === -1) {
			this._onceListeners[event].splice(x, 1);
		}
	}
	
	$bindedOff(event, index) {
		if(!this._bindedListeners[event]) {
			return false;
		}
		
		switch(typeof(index)) {
			case "function":
				for(var x=0; x<this._bindedListeners[event].length; x++) {
					if(this._bindedListeners[event][x].listener === index) {
						this._bindedListeners[event].splice(x, 1);
						return true;
					}
				}
				break;
			case "number":
				if(index < this._bindedListeners[event].length) {
					this._bindedListeners[event].splice(index, 1);
					return true;
				}
				break;
		}
		
		return false;
	}

	/**
	 * 
	 * @method $emit
	 * @param {String} [event]
	 * @param {Object | String | Number | Boolean} ...data
	 */
	$emit(event, ...data) {
		var x, listeners;
		listeners = this._listeners[event];
		data = data || [];
//		console.log("Emitting[" + event + "]: ", listeners, data);
		if(listeners && listeners.length) {
			for(x=0; x<listeners.length; x++) {
				try {
					listeners[x](data[0]);
				} catch(exception) {
					console.log("Emit Failed[" + event + "]: ", listeners[x], exception);
					rsSystem.log.warn(exception);
				}
			}
		}
		
		listeners = this._bindedListeners[event];
		if(listeners && listeners.length) {
			for(x=0; x<listeners.length; x++) {
				try {
					listeners[x].listener.bind(listeners[x].binding)(data);
				} catch(exception) {
					rsSystem.log.warn(exception);
				}
			}
		}
		
		listeners = this._onceListeners[event];
		if(listeners && listeners.length) {
			for(x=0; x<listeners.length; x++) {
				try {
					listeners[x](data);
				} catch(exception) {
					rsSystem.log.warn(exception);
				}
			}
			listeners.splice(0, listeners.length);
		}

		data.unshift(event);
		if(this._bound && this._bound.length) {
			for(x=0; x<this._bound.length; x++) {
				try {
					this._bound[x].$emit.bind(this._bound[x]).apply(this._bound[x].$emit, data);
				} catch(exception) {
					rsSystem.log.warn(exception);
					try {
						this._bound[x].$emit(event, data[1]);
					} catch(exception) {
						rsSystem.log.warn(exception);
					}
				}
			}
		}
	}
};
