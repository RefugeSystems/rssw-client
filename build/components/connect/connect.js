
/**
 * 
 * 
 * @class rsConnect
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_connectComponentKey";
	
	rsSystem.component("rsConnect", {
		"inherit": true,
		"mixins": [
			rsSystem.components.StorageManager
		],
		"mounted": function() {
			rsSystem.register(this);
			if(this.$route.fullPath !== "/") {
				this.connect();
			}
		},
		"data": function() {
			var data = {};
			
			data.store = this.loadStorage(storageKey, {
				"secure": false,
				"username": "",
				"address": ""
			});
			
			return data;
		},
		"methods": {
			"connect": function() {
				this.saveStorage(storageKey, this.store);
				var event = {};
				event.user = new UserInformation(this.store.username, this.store.username);
				event.address = "://" + this.store.address + "/connect";
				if(this.store.secure) {
					event.address = "wss" + event.address;
				} else {
					event.address = "ws" + event.address;
				}
				this.$emit("connect", event);
			},
			"test": function(e) {
				console.warn("Test: ", e);
			}
		},
		"template": Vue.templified("components/connect.html")
	});
})();
