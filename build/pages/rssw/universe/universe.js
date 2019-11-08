
/**
 * 
 * 
 * @class RSSWUniverse
 * @constructor
 * @module Pages
 */
(function() {
	var storageKey = "_rssw_universeComponentKey";
	
	var formatters = {
		"icon": function(icon) {
			return "<span class='" + icon + "'></span>";
		}
	};
	
	rsSystem.component("RSSWUniverse", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCorePage
		],
		"data": function() {
			var data = {},
				entities,
				entity,
				x;
			
			data.storageKeyID = storageKey;
			data.state = this.loadStorage(data.storageKeyID, {
				"search": ""
			});
			if(data.state.filter === undefined) {
				data.state.filter = {};
				data.state.filter.null = data.state.filter.null || "";
			}
			if(data.state.headers === undefined) {
				data.state.headers = [{
					"title":"",
					"field": "icon"
				}, {
					"title":"Name",
					"field": "name"
				}, {
					"title":"ID",
					"field": "id"
				}, {
					"title":"Template",
					"field": "template"
				}];
			}
			
			for(x=0; x<data.state.headers.length; x++) {
				if(formatters[data.state.headers[x].field]) {
					data.state.headers[x].formatter = formatters[data.state.headers[x].field];
				}
			}
			
			data.state.filter.template = false;
			
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
		"mounted": function() {
			this.universe.$on("universe:modified", this.updateEntities);
			rsSystem.register(this);
		},
		"methods": {
			"resetHeaders": function() {
				Vue.set(this.state, "headers", [{
					"title":"",
					"field": "icon",
					"formatter": (icon) => {
						return "<span class='" + icon + "'></span>";
					}
				}, {
					"title":"Name",
					"field": "name"
				}, {
					"title":"ID",
					"field": "id"
				}, {
					"title":"Template",
					"field": "template"
				}]);
			},
			"processAction": function(action) {
				console.warn("Table Action: ", action);
			},
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
