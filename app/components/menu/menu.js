
/**
 * 
 * 
 * @class systemMenu
 * @constructor
 * @module Components
 * @zindex 10
 */
(function() {
	var storageKey = "_rs_menuComponentKey",
		bufferItem = {
			"icon": "",
			"class": "buffer",
			"label": ""
		};
	
	rsSystem.component("systemMenu", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCore
		],
		"props": {
		},
		"data": function() {
			var data = {};

			data.storageID = storageKey; 
			data.state = this.loadStorage(data.storageID, {
				"labels": true
			});
			if(data.state.labels === undefined) {
				data.state.labels = true;
			}
			
			data.navigationItems = [];
			data.navigationItems.push({
				"icon": "fas fa-jedi",
				"action": "navigate",
				"label": "Dashboard",
				"path": "/dashboard",
				"highlight": "/dashboard",
				"conditionals": [{
					"master": false
				}]
			});
			data.navigationItems.push({
				"icon": "fas fa-street-view",
				"action": "navigate",
				"label": "Locality",
				"path": "/locality",
				"highlight": "/locality",
				"conditionals": [{
					"master": false
				}]
			});
			data.navigationItems.push({
				"icon": "fas fa-warehouse-alt",
				"action": "navigate",
				"label": "Storage",
				"path": "/storage",
				"highlight": "/storage",
				"conditionals": [{
					"master": false
				}]
			});
			data.navigationItems.push({
				"icon": "fas fa-journal-whills",
				"action": "navigate",
				"label": "Journal",
				"path": "/journal",
				"highlight": "/journal",
				"conditionals": [{
					"master": false
				}]
			});
			data.navigationItems.push({
				"icon": "far fa-desktop",
				"action": "navigate",
				"label": "Screen",
				"path": "/master",
				"highlight": "/master",
				"conditionals": [{
					"master": true
				}]
			});
			data.navigationItems.push({
				"icon": "fad fa-galaxy",
				"action": "navigate",
				"label": "Galaxy",
				"path": "/galaxy",
				"highlight": "/galaxy",
				"conditionals": [{
					"master": true
				}]
			});
			data.navigationItems.push({
				"icon": "fas fa-treasure-chest",
				"action": "navigate",
				"label": "Nouns",
				"path": "/nouns",
				"highlight": "/nouns",
				"conditionals": [{
					"master": true
				}]
			});
			data.navigationItems.push({
				"icon": "fas fa-map",
				"action": "navigate",
				"label": "Map",
				"path": "/map",
				"highlight": "/map"
			});
			data.navigationItems.push({
				"icon": "fas fa-users",
				"action": "navigate",
				"label": "Party",
				"path": "/party",
				"highlight": "/party",
				"conditionals": [{
					"master": true
				}]
			});
			
			data.navigationItems.push(bufferItem);
			data.navigationItems.push({
				"icon": "far fa-user",
				"action": "navigate",
				"label": "Account",
				"path": "/account",
				"highlight": "/account"
			});
			data.navigationItems.push({
				"icon": "far fa-server",
				"action": "navigate",
				"label": "System",
				"path": "/system",
				"highlight": "/system"
			});
			
			data.generalItems = [];
			data.shrinkItem = {
				"icon": "far fa-text-width",
				"action": "toggle-labels",
				"label": "Shrink"
			};
			data.generalItems.push(data.shrinkItem);
			data.generalItems.push(bufferItem);
			data.generalItems.push({
				"icon": "far fa-sign-out",
				"action": "logout",
				"label": "Logout"
			});
			
			return data;
		},
		"watch": {
			"$route": {
				"deep": true,
				"handler": function() {
//					console.log("hi");
					this.$forceUpdate();
				}
			},
			"state": {
				"deep": true,
				"handler": function(value) {
					this.saveStorage(this.storageID, this.state);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
		},
		"methods": {
			"isActive": function(navItem) {
				if(navItem.conditionals) {
					for(var x=0; x<navItem.conditionals.length; x++) {
						if(this.evaluateConditional(navItem.conditionals[x])) {
							return true;
						}
					}
					return false;
				}
				return true;
			},
			"evaluateConditional": function(condition) {
				var keys = Object.keys(condition),
					x;
				
				for(x=0; x<keys.length; x++) {
					switch(keys[x]) {
						case "master":
							if(condition[keys[x]] === true) {
								return this.player.master;
							} else if(condition[keys[x]] === false) {
								return !this.player.master;
							}
							break;
					}
				}
			},
			"getClassSettings": function() {
				var classes = "full standard undocked";
				if(!this.state.labels) {
					classes += " collapsed";
				}
				return classes;
			},
			"processNavigation": function(navItem) {
//				console.log("Nav: " , navItem);
				switch(navItem.action) {
					case "navigate":
						break;
					case "toggle-labels":
						Vue.set(this.state, "labels", !this.state.labels);
						if(this.state.labels) {
							Vue.set(this.shrinkItem, "label", "Shrink");
						} else {
							Vue.set(this.shrinkItem, "label", "Expand");
						}
						break;
					case "logout":
						this.universe.logout();
						break;
					case "none":
						break;
					default:
						this.universe.log.warn({"message":"Unknown action[" + navItem.action + "] in menu navigation", "item": navItem});
				}
			}
		},
		"template": Vue.templified("components/menu.html")
	});
})();
