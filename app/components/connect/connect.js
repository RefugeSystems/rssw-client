
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
		"mounted": function() {
			rsSystem.register(this);
			if(this.$route.path !== "/") {
				this.connect();
			}
			
			if(this.$route.query.address) {
				Vue.set(this.store, "address", this.$route.query.address);
				this.$emit("message", {
					"class": "rsbd-orange",
					"icon": "fas fa-exclamation-triangle",
					"heading": "Connection Address Set",
					"text": "The connection address has been updated to \"" + this.$route.query.address + "\" based on the received query information from the URL provided."
				});
				this.$router.push("/");
			}
		},
		"methods": {
			"toggleSecure": function() {
				Vue.set(this.store, "secure", !this.store.secure);
			},
			"clearSaved": function() {
				Vue.delete(this.store, "passcode");
			},
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
