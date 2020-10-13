
/**
 * 
 * 
 * @class messagePanel
 * @constructor
 * @module common
 * @zindex 50
 */
(function() {
	
	rsSystem.component("messagePanel", {
		"inherit": true,
		"mixins": [
			
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"user": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			/**
			 * 
			 * @property messages
			 * @type Array
			 */
			data.messages = [];
			
			
			data.tracking = {};
			
			return data;
		},
		"watch": {
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("track-progress", this.trackProgress);
			this.universe.$on("error", this.receiveMessage);
		},
		"methods": {
			/**
			 * Emits an event on the universe matching the received tracker.id value with the message tracking
			 * object as its parameter so that Vue.set controls can be used to update the message display with
			 * progress.
			 * 
			 * Once retrieved, send a parameterless event with the tracker.id to mark the progress message as
			 * dismissable.
			 * 
			 * @event track-progress
			 * @param {Object} tracker
			 * @param {String} tracker.message To display in the message (keep short)
			 * @param {Number} tracker.processing Total number of "steps"
			 * @param {String} tracker.id Basic identified, should generally match the exchange event
			 */
			"trackProgress": function(tracker) {
				this.tracking[tracker.id] = {};
				tracker.active = true;
				tracker.type = "progress";
				tracker.processed = 0;
				this.messages.push(tracker);
				
				this.universe.$emit(tracker.id, tracker);
				this.universe.$once(tracker.id, () => {
					Vue.delete(this.tracking, tracker.id);
				});
			},
			
			/**
			 * 
			 * @method receiveMessage
			 * @param {Object} event
			 */
			"receiveMessage": function(event) {
				event._display_time = new Date(event.time);
				if(!event._display_time.getTime()) {
					event._display_time = new Date();
				}
				
				event.type = "notification";
				if(!event.message) {
					if(event.data) {
						if(event.data.message) {
							event.message = event.data.message;
						} else if(event.data.description) {
							event.message = event.data.description;
						}
					} else if(event.error) {
						if(event.error.message) {
							event.message = event.error.message;
						} else if(event.error.description) {
							event.message = event.error.description;
						}
					} else {
						event.message = "Unidentified Error - See Logs: " + JSON.stringify(event);
					}
				}
				
				this.messages.unshift(event);
				if(this.messages.length > 5) {
					this.messages.pop();
				}
			},
			/**
			 * 
			 * @method dismissMessage
			 * @param {Object} event
			 */
			"dismissMessage": function(event) {
				var index = this.messages.indexOf(event);
				if(event.active) {
					Vue.set(event, "active", false);
				}
				if(index !== -1) {
					this.messages.splice(index, 1);
				}
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("error", this.update);
		},
		"template": Vue.templified("common/panels/message.html")
	});
})();
