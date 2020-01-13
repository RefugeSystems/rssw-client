
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
			
			return data;
		},
		"watch": {
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("error", this.receiveMessage);
		},
		"methods": {
			/**
			 * 
			 * @method receiveMessage
			 * @param {Object} event
			 */
			"receiveMessage": function(event) {
				event._display_time = new Date(event.time);
				if(!event._display_time.getTime()) {
					event._display_time = null;
				}
				
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
