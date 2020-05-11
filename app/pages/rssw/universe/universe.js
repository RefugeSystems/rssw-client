
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
		"template": function(state) {
			if(state) {
				return "<span class='fas fa-check'></span>";
			}
			return "";
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
	
	
	var templateValues = {
		"shown": undefined,
		"only": true,
		"out": false
	};
	
	rsSystem.component("RSSWUniverse", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
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
					"hideBlock": true,
					"nosort": true
				}];
			}
			if(data.state.paging === undefined) {
				data.state.paging = {};
				data.state.paging.per = 20;
				data.state.paging.current = 0;
				data.state.paging.pages = 0;
				data.state.paging.spread = 10;
			}
			
			data.availableIndexes = Object.keys(this.universe.indexes);
			data.availableIndexes.sort();
			
			data.listing = {};
			data.listing.entity = [];
			data.listing.player = [];
			data.listing.item = [];
			data.listing.room = [];
			data.listingKeys = Object.keys(data.listing);
			
			data.command = "";
			data.target = "";
			data.corpus = [];
			
			data.universeEntities = [];			
			
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
				"handler": function(nV, oV) {
//					if(this.state.search !== this.state.search.toLowerCase()) {
//						Vue.set(this.state.filter, "null", this.state.search.toLowerCase());
//					}
					if(templateValues[this.state.filterTemplate] !== undefined) {
						Vue.set(this.state.filter, "template", templateValues[this.state.filterTemplate]);
					} else {
						Vue.delete(this.state.filter, "template");
					}
					this.saveStorage(this.storageKeyID, nV);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);

			if(templateValues[this.state.filterTemplate] !== undefined) {
				Vue.set(this.state.filter, "template", templateValues[this.state.filterTemplate]);
			} else {
				Vue.delete(this.state.filter, "template");
			}
			
			this.universe.$on("universe:modified", this.updateListings);
			this.updateListings();
		},
		"methods": {
			"updateListings": function(event) {
				var mapped = {},
					buffer,
					x,
					y;
				
				this.universeEntities.splice(0);
				for(x=0; x<this.listingKeys.length; x++) {
					this.listing[this.listingKeys[x]].splice(0);
					for(y=0; y<this.universe.indexes[this.listingKeys[x]].listing.length; y++) {
						buffer = this.universe.indexes[this.listingKeys[x]].listing[y];
						if(buffer) {
							this.listing[this.listingKeys[x]].push(buffer);
							switch(this.listingKeys[x]) {
								case "entity":
									if(!mapped[buffer.id] && !buffer.hidden && !buffer.inactive) {
										mapped[buffer.id] = true;
										this.universeEntities.push(buffer);
									}
									break;
							}
						}
					}
					this.listing[this.listingKeys[x]].sort(this.sortData);
				}
				
				this.universeEntities.sort(this.sortData);
			},
			"showCommands": function() {
				return !!(this.state.activeIndex?this.universe.indexes[this.state.activeIndex]:this.universe.index).selection.length;
			},
			"resetHeaders": function() {
				Vue.set(this.state, "headers", [{
					"title":"",
					"field": "icon",
					"formatter": formatters.icon
				}, {
					"title":"Name",
					"field": "name",
					"tag": "id"
				}, {
					"title":"Location",
					"field": "location"
				}, {
					"title":"T",
					"field": "template",
					"formatter": formatters.template
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
			"processCommand": function(command) {
				var index = (this.state.activeIndex?this.universe.indexes[this.state.activeIndex]:this.universe.index),
					target = this.universe.index.lookup[this.target],
					loading,
					sending,
					item,
					keys,
					x;
				
//				command = command.split(",");
//				console.warn("Table Command: ", command, index);
				
				switch(command) {
					case "give":
//						console.warn("Giving Items");
						for(x=0; x<index.selection.length; x++) {
							console.warn("Sending " + index.selection[x] + "...");
							if(this.universe.nouns.item[index.selection[x]]) {
								sending = {};
								sending.item = index.selection[x];
								sending.target = this.target;
								this.universe.send("give:item", sending);
							} else if(this.universe.nouns.room[index.selection[x]]) {
								sending = {};
								sending.room = index.selection[x];
								sending.target = this.target;
								this.universe.send("give:room", sending);
							} else {
								console.warn("Can only give item & room objects");
							}
						}
						break;
					case "take":
//						console.warn("Taking Items");
						for(x=0; x<index.selection.length; x++) {
							console.warn("Sending " + index.selection[x] + "...");
							if(this.universe.nouns.item[index.selection[x]]) {
								sending = {};
								sending.item = index.selection[x];
								sending.target = this.target;
								this.universe.send("take:item", sending);
							} else if(this.universe.nouns.room[index.selection[x]]) {
								sending = {};
								sending.room = index.selection[x];
								sending.target = this.target;
								this.universe.send("take:room", sending);
							} else {
								console.warn("Can only take item & room objects");
							}
						}
						break;
					case "obscure":
//						console.warn("Taking Items");
						for(x=0; x<index.selection.length; x++) {
							if(this.universe.index.index[index.selection[x]]) {
								this.universe.index.index[index.selection[x]].commit({
									"obscured": true
								});
							}
						}
						break;
					case "unobscure":
//						console.warn("Taking Items");
						for(x=0; x<index.selection.length; x++) {
							if(this.universe.index.index[index.selection[x]]) {
								this.universe.index.index[index.selection[x]].commit({
									"obscured": false
								});
							}
						}
						break;
					case "drop":
						loading = index.selection.concat([]);
						for(x=0; x<loading.length; x++) {
							if(index.selected[loading[x]]._drop) {
								// Drop Item
								sending = {};
								sending._type = index.selected[loading[x]]._type;
								sending.id = index.selected[loading[x]].id;
								sending.time = Date.now();
								this.universe.send("delete:" + index.selected[loading[x]]._type, sending);
								index.unselect(index.selected[loading[x]]);
							} else {
								// Flag Item
								index.selected[loading[x]]._drop = true;
							}
						}
						break;
					case "spawn":
						for(x=0; x<index.selection.length; x++) {
							loading = index.selected[index.selection[x]];
							if(loading.template && loading._type === "entity") {
								keys = Object.keys(loading);
								sending = {};
								
								for(x=0; x<keys.length; x++) {
									if(keys[x] && keys[x][0] !== "_") {
										sending[keys[x]] = loading[keys[x]];
									}
								}
								
								sending.parent = loading.id;
								sending.name = loading.name + " (New)";
								sending.description = loading.description;
								sending.id += ":" + Date.now();
								sending.template = false;
								sending._type = "entity";
								if(this.target) {
									sending.owners = [this.target];
								}
	
								this.universe.send("modify:entity", sending);
							} else {
								console.warn("Skipping Selection: ", loading);
							}
						}
						break;
					case "dashboard-ships":
						var primary = index.selection[0],
							ships = index.selection.slice(1);
						
						window.open(location.pathname + "#/dashboard/ship/" + primary + "?ships=" + ships.join(","), "dashboard");
						break;
					case "grant-knowledge":
						if(target) {
							sending = [];
							for(x=0; x<index.selection.length; x++) {
								if(this.universe.indexes.knowledge.lookup[index.selection[x]]) {
									sending.push(index.selection[x]);
								}
							}
							target.learnKnowledge(sending);
						}
						break;
					case "forget-knowledge":
						if(target) {
							sending = [];
							for(x=0; x<index.selection.length; x++) {
								if(this.universe.indexes.knowledge.lookup[index.selection[x]]) {
									sending.push(index.selection[x]);
								}
							}
							target.forgetKnowledge(sending);
						}
						break;
				}
				
				
				Vue.set(this, "command", "");
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
