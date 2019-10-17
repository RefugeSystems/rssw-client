
/**
 * 
 * 
 * @class RSSWUniverse
 * @constructor
 * @module Pages
 */
(function() {
	var storageKey = "_rssw_universeComponentKey";
	
	rsSystem.component("RSSWUniverse", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCorePage
		],
		"mounted": function() {
			this.universe.$on("universe:modified", this.updateEntities);
			rsSystem.register(this);
		},
		"data": function() {
			var data = {},
				entities,
				entity,
				x;
			
			data.storageKeyID = storageKey;
			data.state = this.loadStorage(data.storageKeyID, {
				"search": ""
			});
			if(data.state.search === undefined) {
				data.state.search = "";
			}
			
			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					if(this.state.search !== this.state.search.toLowerCase()) {
						Vue.set(this.state, "filter", this.state.search.toLowerCase());
					}
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"methods": {
			"filtered": function(entity) {
				if(entity.template || entity.inactive) {
					return false;
				}
				
				return !this.state.search ||
					(entity._search && entity._search.indexOf(this.state.search) !== -1) ||
					entity.id.indexOf(this.state.search) !== -1 ||
					entity.name.indexOf(this.state.search) !== -1 ||
					(entity.description && entity.description.indexOf(this.state.search) !== -1);
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.updateEntities);
		},
		"template": Vue.templified("pages/rssw/universe.html")
	});
})();
