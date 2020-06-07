
/**
 * Handles retrieving login information from the user.
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
			
			data.passcode = "";
			data.store = this.loadStorage(storageKey, {
				"secure": false,
				"passcode": "",
				"username": "",
				"address": ""
			});
			
			return data;
		},
		"methods": {
			"getPasscodePlaceHolder": function() {
				if(this.store.passcode) {
					return " < Saved Passcode > ";
				} else {
					return " Enter a Passcode...";
				}
			},
			"connect": function() {
				if(this.passcode) {
					Vue.set(this.store, "passcode", this.passcode.sha256());
				}
				
				this.saveStorage(storageKey, this.store);
				var event = {};
				event.user = new UserInformation(this.store.username, this.store.username);
				event.user.setPasscode(this.store.passcode);
				event.address = "://" + this.store.address + "/connect";
				if(this.store.secure) {
					event.address = "wss" + event.address;
				} else {
					event.address = "ws" + event.address;
				}
				this.$emit("connect", event);
			}
		},
		"template": Vue.templified("components/connect.html")
	});
})();
