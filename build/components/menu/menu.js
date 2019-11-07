
/**
 * 
 * 
 * @class systemMenu
 * @constructor
 * @module Components
 * @zindex 10
 */
(function() {
	var storageKey = "_rs_menuComponentKey";
	
	rsSystem.component("systemMenu", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCore
		],
		"props": {
		},
		"mounted": function() {
			rsSystem.register(this);
		},
		"data": function() {
			var data = {};
			
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
				"icon": "fas fa-hurricane",
				"action": "navigate",
				"label": "Universe",
				"path": "/universe",
				"highlight": "/universe",
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
			
			data.generalItems = [];
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
					console.log("hi");
					this.$forceUpdate();
				}
			}
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
				return "full standard undocked";
			},
			"processNavigation": function(navItem) {
				console.log("Nav: " , navItem);
				switch(navItem.action) {
					case "navigate":
						break;
					case "logout":
						this.universe.logout();
						break;
					default:
						this.universe.log.warn({"message":"Unknown action[" + navItem.action + "] in menu navigation", "item": navItem});
				}
			}
		},
		"template": Vue.templified("components/menu.html")
	});
})();
