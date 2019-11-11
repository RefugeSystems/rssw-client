
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
		},
		"__info": function(value, record) {
			return "<span class=\"fas fa-info-circle\"></span>";
		},
		"__edit": function(value, record) {
			return "<span class=\"fas fa-edit\"></span>";
		},
		"__copy": function(value, record) {
			return "<span class=\"fas fa-copy\"></span>";
		},
		"__view": function(value, record) {
			if(record.classification && record._type === "entity") {
				return "<span class=\"fas fa-external-link\"></span>";
			}
		}
	};

	var recordActions = {
		"__info": function(record) {
			rsSystem.EventBus.$emit("display-info", record);
		},
		"__edit": function(record) {
			this.$router.push("/nouns/" + record._type + "/" + record.id);
		},
		"__copy": function(record) {
			this.$router.push("/nouns/" + record._type + "/" + record.id + "?copy=true");
		},
		"__view": function(record) {
			if(record.classification && record._type === "entity") {
				this.$router.push("/universe/" + record.classification + "/" + record.id);
			}
		}
	};

	var actions = {
	};

	var sorters = {
		"__view": function(a, b) {
			if(a._type === "entity" && b._type !== "entity") {
				return 1;
			} else if(b._type === "entity" && a._type !== "entity") {
				return -1;
			}
			return 0;
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
			if(data.state.paging === undefined) {
				data.state.paging = {};
				data.state.paging.per = 20;
				data.state.paging.current = 1;
				data.state.paging.pages = 0;
				data.state.paging.spread = 10;
			}
			
			data.corpus = [];
			
			
			for(x=0; x<data.state.headers.length; x++) {
				if(formatters[data.state.headers[x].field]) {
					data.state.headers[x].formatter = formatters[data.state.headers[x].field];
				}
				if(recordActions[data.state.headers[x].field]) {
					data.state.headers[x].recordAction = recordActions[data.state.headers[x].field].bind(this);
				}
				if(actions[data.state.headers[x].field]) {
					data.state.headers[x].action = actions[data.state.headers[x].field].bind(this);
				}
				if(sorters[data.state.headers[x].field]) {
					data.state.headers[x].sorter = sorters[data.state.headers[x].field].bind(this);
					if(data.state.sortKey === data.state.headers[x].field) {
						data.state.sorter = data.state.headers[x].sorter;
					}
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
					"formatter": formatters.icon
				}, {
					"title":"Name",
					"field": "name"
				}, {
					"title":"ID",
					"field": "id"
				}, {
					"field": "__info",
					"formatter": formatters.__info,
					"recordAction": recordActions.__info.bind(this),
					"hideBlock": true,
					"nosort": true
				}, {
					"field": "__edit",
					"formatter": formatters.__edit,
					"recordAction": recordActions.__edit.bind(this),
					"hideBlock": true,
					"nosort": true
				}, {
					"field": "__copy",
					"formatter": formatters.__copy,
					"recordAction": recordActions.__copy.bind(this),
					"hideBlock": true,
					"nosort": true
				}, {
					"field": "__view",
					"formatter": formatters.__view,
					"recordAction": recordActions.__view.bind(this),
					"sorter": sorters.__view
				}]);
			},
			"getSpread": function() {
				var possibles = [],
					start = Math.max(this.state.paging.spread-5, 2),
					end = this.state.paging.spread+5,
					x;
				
				for(x=start; x<end; x++) {
					possibles.push(x);
				}

				if(start > 10) {
					possibles.unshift(10);
				}
				if(start > 2) {
					possibles.unshift(2);
				}
				if(end < 50) {
					possibles.push(50);
				}
				if(end < 100) {
					possibles.push(100);
				}
				
				return possibles;
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
