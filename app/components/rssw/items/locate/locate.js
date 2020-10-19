
/**
 *
 *
 * @class rsswItemsLocate
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_itemslocateviewComponentKey:";

	var defaultHeaders = [{
		"title": "",
		"field": "icon",
		"nosort": true,
		"formatter": function(icon) {
			return "<span class='" + icon + "'></span>";
		},
		"recordAction": function(record) {
			rsSystem.EventBus.$emit("display-info", record._item);
		}
	}, {
		"title": "Item",
		"field": "name",
		"recordAction": function(record) {
			rsSystem.EventBus.$emit("display-info", record._item);
		}
	}, {
		"title": "Held By",
		"field": "heldby",
		"recordAction": function(record) {
			rsSystem.EventBus.$emit("display-info", record._entity);
		}
	}, {
		"title": "Location",
		"field": "location",
		"recordAction": function(record) {
			rsSystem.EventBus.$emit("display-info", record._location);
		}
	}, {
		"title": "Inside",
		"field": "inside",
		"recordAction": function(record) {
			rsSystem.EventBus.$emit("display-info", record._inside);
		}
	}, {
		"title": "Container?",
		"field": "within",
		"recordAction": function(record) {
			rsSystem.EventBus.$emit("display-info", record._within);
		}
	}];

	rsSystem.component("rsswItemsLocate", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSShowdown,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"data": function() {
			var data = {};

			data.storageKeyID = storageKey;
			data.state = this.loadStorage(data.storageKeyID, {
				"search": ""
			});

			if(data.state.paging === undefined) {
				data.state.paging = {};
				data.state.paging.per = 20;
				data.state.paging.current = 0;
				data.state.paging.pages = 0;
				data.state.paging.spread = 10;
			}

			data.inventory = new SearchIndex();
			data.headers = defaultHeaders;
			data.entities = [];
			data.mapping = {};
			data.corpus = [];

			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("modified", this.update);
			this.update();
		},
		"methods": {
			"processAction": function(event) {
//				console.log("Action: ", event);
			},
			/**
			 *
			 * @method buildItem
			 * @param  {RSEntity} source That has the item
			 * @param  {String} item ID around which to create the new indexed object
			 * @return {Object}
			 */
			"buildItem": function(entity, item, within) {
//				console.log("Build Item: ", entity, item, within);
				var indexed = {};
				indexed._entity = entity;
				indexed._item = item;
				indexed._search = item.name + " | " + entity.name;
				if(within) {
					indexed._within = within;
					indexed._search += within.name;
				}
				if(entity.location) {
					indexed._location = this.universe.indexes.location.index[entity.location];
					if(indexed._location) {
						indexed._search += " | " + indexed._location.name;
					}
				}
				if(entity.inside) {
					indexed._inside = this.universe.indexes.entity.index[entity.inside];
					if(indexed._inside) {
						indexed._search += " | " + indexed._inside.name;
					}
				}
				indexed.name = item.name;
				indexed.id = item.id + "|" + entity.id;
				indexed.heldby = indexed._entity.name;
				indexed.location = indexed._location?indexed._location.name:"";
				indexed.inside = indexed._inside?indexed._inside.name:"";
				indexed.within = indexed._within?indexed._within.name:"";
				indexed._search = indexed._search.toLowerCase();
				indexed.icon = item.icon;
				return indexed;
			},
			"rebindEntity": function(entity) {
//				console.log("Rebind: ", entity);
				if(!this.mapping[entity.id]) {
					// entity.$on("modified", this.updateEntity);
					Vue.set(this.mapping, entity.id, []);
				}
				this.updateEntity(entity);
			},
			"updateEntity": function(entity) {
				if(entity && entity.id && entity._class === "entity" && entity.item) {
//					console.log("Updating: ", entity);
					var buffer,
						i;

					for(i=0; i<entity.item.length; i++) {
						buffer = this.universe.indexes.item.index[entity.item[i]];
						if(buffer) {
							this.indexItem(entity, buffer);
						}
					}
				}
			},
			"indexItem": function(entity, item, inside) {
				var buffer,
					i;

				var indexing = this.buildItem(entity, item, inside);
//				console.log("Indexing: ", indexing);
				this.inventory.indexItem(indexing);
				if(item.item && item.item.length) {
					for(i=0; i<item.item.length; i++) {
						buffer = this.universe.indexes.item.index[item.item[i]];
						if(buffer) {
							this.indexItem(entity, buffer, item);
						}
					}
				}
			},
			"unbindEntity": function(entity) {
//				console.log("Unbind: ", entity);
				if(this.mapping[entity.id]) {
					this.inventory.unindexItem(this.mapping[entity.id]);
					// entity.$off("modified", this.updateEntity);
					Vue.delete(this.mapping, entity.id);
				}
			},
			"update": function() {
				var incoming,
					outgoing,
					listing,
					buffer,
					hold,
					i,
					j,
					k;

				listing = [];
				for(i=0; i<this.universe.indexes.entity.listing.length; i++) {
					if(this.universe.indexes.entity.listing[i] && this.universe.indexes.entity.listing[i].isOwner && this.universe.indexes.entity.listing[i].isOwner(this.player.id)) {
						listing.push(this.universe.indexes.entity.listing[i]);
					}
				}

				incoming = listing.difference(this.entities);
				outgoing = this.entities.difference(listing);
				// console.log("Incoming: ", incoming);
				// console.log("Outgoing: ", outgoing);

				for(i=0; i<incoming.length; i++) {
					this.rebindEntity(incoming[i]);
				}
				for(i=0; i<outgoing.length; i++) {
					this.unbindEntity(outgoing[i]);
				}
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("modified", this.update);
			// for(var x=0; x<this.entities.length; x++) {
			// 	this.entities[x].$off(this.updateEntity);
			// }
		},
		"template": Vue.templified("components/rssw/items/locate.html")
	});
})();
