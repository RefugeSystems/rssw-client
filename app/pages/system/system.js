
/**
 * 
 * 
 * @class RSSystem
 * @constructor
 * @module Pages
 */
(function() {
	var getAdrress = new RegExp("/([a-zA-Z0-9.:_-]+)/");
	
	rsSystem.component("RSSystem", {
		"inherit": true,
		"mixins": [],
		"props": ["universe", "user"],
		"data": function() {
			var data = {};
			
			data.player = this.universe.indexes.player.index[this.user.id];
			data.navigator = rsSystem.getBrowserName();
			data.system = rsSystem;
			data.knownErrors = {};
			
			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("universe:modified", this.update);
			this.universe.$on("model:modified", this.update);
			this.universe.$on("connected", this.update);
			this.universe.$on("error", this.update);
			this.update();
		},
		"methods": {
			"showInfo": function(record) {
				rsSystem.EventBus.$emit("display-info", record);
			},
			"uncachedRefresh": function() {
				// TODO: Align ServiceWorker versioning for cache tracking
				caches.delete("rsswx_0.0.1")
				.then(function() {
					location.reload(true);
				});
			},
			"makeIssue": function() {
				var buffer = {};
				buffer.id = navigator.userAgent.sha256();
				buffer.name = "Problems: " + this.navigator.name + " " + this.navigator.version;
				buffer.icon = "rs-dark-red fas fa-exclamation-triangle";
				buffer.description = "There are known issues with this browser version";
				buffer._type = "note";
				this.universe.send("modify:note", buffer);
			},
			"getServerAddress": function() {
				return getAdrress.exec(this.universe.connection.address)[1];
			},
			"getDate": function(time) {
				var date = new Date(time);
				return date.toLocaleDateString() + " " + date.toLocaleTimeString();
			},
			"update": function() {
				Vue.set(this.knownErrors, "navigator", this.universe.indexes.note.index[navigator.userAgent.sha256()] || this.universe.indexes.note.index[navigator.userAgent.toLowerCase().sha256()]);
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
			this.universe.$off("model:modified", this.update);
			this.universe.$off("connected", this.update);
			this.universe.$off("error", this.update);
		},
		"template": Vue.templified("pages/system.html")
	});
})();
