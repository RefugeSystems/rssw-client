
/**
 * 
 * 
 * 
 * Cursor Positioning Note:  
 * https://stackoverflow.com/questions/7745867/how-do-you-get-the-cursor-position-in-a-textarea
 * @class syncedText
 * @constructor
 * @module Components
 * @zindex 1
 */
(function() {
	var storageKey = "_rs_syncedtextComponentKey:";
	
	rsSystem.component("syncedText", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCore
		],
		"props": {
			"id": {
				"type": String
			}
		},
		"data": function() {
			var data = {};

			if(this.id) {
				data.storageID = storageKey + this.id; 
				data.state = this.loadStorage(data.storageID, {});
			} else {
				data.state = {};
			}
			
			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function(value) {
					if(this.storageID) {
						this.saveStorage(this.storageID, this.state);
					}
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
		},
		"methods": {
		},
		"template": Vue.templified("components/syncedtext.html")
	});
})();
