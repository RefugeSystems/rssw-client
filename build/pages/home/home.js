
/**
 * 
 * 
 * @class RSHome
 * @constructor
 * @module Pages
 */
rsSystem.component("RSHome", {
	"inherit": true,
	"mixins": [
	],
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		
		data.message = "";
		data.state = 0;
		
		// Track Connection Information
		data.universe = null;
		data.user = null;
		
		return data;
	},
	"methods": {
		"connect": function(event) {
			if(this.universe && this.universe.loggedOut) {
				console.warn("Logged out, blocking reconnection and clearing");
				this.universe.loggedOut = false;
			} else {
				Vue.set(this, "state", 1);
				Vue.set(this, "universe", new RSUniverse({}));
				Vue.set(this, "user", event.user);
				
				this.universe.$on("disconnected", () => {
					Vue.set(this, "message", "Disconnected");
					Vue.set(this, "state", 0);
				});
				this.universe.$on("initializing", () => {
					Vue.set(this, "state", 2);
				});
				this.universe.$on("initialized", () => {
					Vue.set(this, "state", 10);
				});
				this.universe.connect(event.user, event.address);
			}
		}
	},
	"template": Vue.templified("pages/home.html")
});
