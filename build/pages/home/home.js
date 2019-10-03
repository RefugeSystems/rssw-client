
/**
 * 
 * 
 * @class RSHome
 * @constructor
 * @module Pages
 */
rsSystem.component("RSHome", {
	"inherit": true,
	"mixins": [],
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		
		data.message = "";
		data.state = 0;
		
		// Track Connection Information
		data.universe = null;
		data.player = null;
		
		return data;
	},
	"methods": {
		"connect": function(event) {
			Vue.set(this, "state", 1);
			Vue.set(this, "universe", new RSUniverse({}));
			Vue.set(this, "player", event.user);
			
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
	},
	"template": Vue.templified("pages/home.html")
});
