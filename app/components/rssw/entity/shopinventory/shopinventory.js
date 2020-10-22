
/**
 *
 * @class RSSWShopInventory
 * @constructor
 * @module Pages
 */
(function() {

	var storageKey = "rsswxshopinv:";

	var defaultHeaders = [{
		"title": "",
		"field": "id"
	}, {
		"title": "",
		"field": "_info",
		"nosort": true,
		"recordAction": function(record) {
			rsSystem.EventBus.$emit("display-info", record);
		}
	}, {
		"title": "",
		"field": "icon",
		"nosort": true
	}, {
		"title": "Name",
		"field": "name"
	}, {
		"title": "Encumberance",
		"field": "encumberance"
	}, {
		"title": "Price",
		"field": "price"
	}];

	var stats = [{
		"label": "Price",
		"field": "price"
	}, {
		"label": "Encumberance",
		"field": "encumberance"
	}];

	var formatters = {
		"icon": function(icon) {
			return "<span class='" + icon + "'></span>";
		},
		"name": function(name) {
			return "<div class='align-left'>" + name + "</span>";
		},
		"__info": function(value, record) {
			return "<span class=\"fas fa-info-circle\"></span>";
		}
	};

	rsSystem.component("rsswShopInventory", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSShowdown,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": RSEntity
			},
			"customer": {
				"type": RSEntity
			}
		},
		"data": function() {
			var data = {};

			data.storageKeyID = storageKey + this.entity.id;
			data.state = this.loadStorage(data.storageKeyID, {});
			if(!data.state.cart) {
				data.state.cart = {
					"encumberance": 0,
					"cost": 0
				};
			}
			if(!data.state.selected) {
				data.state.selected = [];
			}
			if(data.state.paging === undefined) {
				data.state.paging = {};
				data.state.paging.per = 20;
				data.state.paging.current = 0;
				data.state.paging.pages = 0;
				data.state.paging.spread = 10;
			}

			data.headers = defaultHeaders;
			data.headers[1].formatter = formatters.__info;
			data.headers[2].formatter = formatters.icon;
			data.headers[3].formatter = formatters.name;
			data.headers[0].formatter = function(id) {
				if(data.state.selected.indexOf(id) === -1) {
					return "";
				}
				return "<span class=\"fas fa-shopping-cart\"></span>";
			};
			data.headers[0].sorter = function(a, b) {
				if(!a && b) {
					return -1;
				}
				if(a && !b) {
					return 1;
				}

				a = data.state.selected.indexOf(a.id);
				b = data.state.selected.indexOf(b.id);
				if(a === -1 && b !== -1) {
					return -1;
				}
				if(a !== -1 && b === -1) {
					return 1;
				}

				return 0;
			};

			data.inventory = new SearchIndex();
			data.corpus = [];
			data.stats = stats;
			data.cart = {
				"encumberance": 0,
				"price": 0
			};

			data.checkingOut = null;
			data.toExpensive = false;
			data.toHeavy = false;

			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.inventory.$on("selection", this.selected);
			this.universe.$on("echo:response", this.receive);
			this.universe.$on("echoing", this.receive);
			this.entity.$on("modified", this.update);
			this.update();
		},
		"methods": {
			"processAction": function(action) {
				console.log("Process: ", action);
			},
			"checkout": function() {
				console.log("Checkout: ", this.state.selected, "\nShop: ", this.entity, "\nCustomer: ", this.customer);
				if(this.customer) {
					Vue.set(this, "checkingOut", this.universe.send("shop:checkout", {
						"shop": this.entity.id,
						"customer": this.customer.id,
						"checkout": this.state.selected,
						"price": this.cart.price
					}));
				}
			},
			"receive": function(message) {
				console.log("Echo Receive: ", message);
				if(this.checkingOut && message.echo === this.checkingOut) {
					Vue.set(this.cart, "encumberance", 0);
					Vue.set(this.cart, "price", 0);
					Vue.set(this, "checkingOut", null);
				}
			},
			"selected": function() {
				var load = {},
					buffer,
					x,
					s;

				for(s=0; s<stats.length; s++) {
					load[stats[s].field] = 0;
				}

				this.state.selected.splice(0);
				for(x=0; x<this.inventory.selection.length; x++) {
					buffer = this.inventory.selected[this.inventory.selection[x]];
					if(buffer) {
						this.state.selected.push(this.inventory.selection[x]);
						for(s=0; s<stats.length; s++) {
							load[stats[s].field] += buffer[stats[s].field] || 0;
						}
					}
				}

				if(this.entity.no_cost) {
					load.price = 0;
				}

				for(s=0; s<stats.length; s++) {
					Vue.set(this.cart, stats[s].field, load[stats[s].field]);
				}

				if(this.customer) {
					Vue.set(this, "toHeavy", this.customer.encumberance_max < this.customer.encumberance + load.encumberance);
					Vue.set(this, "toExpensive", load.price > this.customer.credits);
				}
			},
			"update": function() {
				this.inventory.clearIndex();
				this.inventory.indexItem(this.universe.indexes.item.translate(this.entity.item));
				this.inventory.select(this.state.selected);
				this.selected();
			}
		},
		"beforeDestroy": function() {
			this.inventory.$off("selection", this.selected);
			this.universe.$off("echoing", this.receive);
			this.entity.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/entity/shopinventory.html")
	});
})();
