
/**
 * 
 * 
 * @class RSSWMasterCombatPage
 * @constructor
 * @module Pages
 */
(function() {
	var storageKey = "_rssw_combatscreenComponentKey";

	var rollProperties = [{
	}];

	rsSystem.component("RSSWMasterCombatPage", {
		"inherit": true,
		"mixins": [
			// TOFIX: This causes missing prop errors due to player coming from computed.
			// This will be resolved by moving this page to a "proper" instance of assembled components rather than it acting like a component
			rsSystem.components.RSCore
		],
//		"computed": {
//			"event": function() {
//				return this.universe.indexes.event.index[this.$route.params.oid];
//			}
//		},
		"watch": {
			"$route.params.oid": function() {
				console.log("New Event?");
				Vue.set(this, "event", this.universe.indexes.event.index[this.$route.params.oid]);
			}
		},
		"data": function() {
			var data = {},
				x;

			data.storageKeyID = storageKey;
			data.state = this.loadStorage(data.storageKeyID, {
				
			});
			if(!data.state.searching) {
				data.state.searching = {};
			}
			
			data.event = this.universe.indexes.event.index[this.$route.params.oid];
			data.events = [];
			
			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("universe:modified", this.update);
			this.update();
		},
		"methods": {
			"openEvent": function(event) {
				var hash = "#/combat/" + event.id;
				if(location.hash !== hash) {
					window.location = location.pathname.replace("?", "") + hash;
				}
			},
			"isVisible": function(record, search) {
				
			},
			/**
			 * 
			 * @method update
			 */
			"update": function() {
				var next = 0,
					session,
					buffer,
					x;
				
				this.events.splice(0);
				for(x=0; x<this.universe.indexes.event.listing.length; x++) {
					if(this.universe.indexes.event.listing[x].active && this.universe.indexes.event.listing[x].category === "combat") {
						this.events.push(this.universe.indexes.event.listing[x]);
					}
				}
				this.events.sort(this.sortData);
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
		},
		"template": Vue.templified("pages/rssw/combat.html")
	});
})();
