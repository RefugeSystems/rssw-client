
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
			
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"user": {
				"required": true,
				"type": Object
			}
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
				"highlight": "/dashboard"
			});
			data.navigationItems.push({
				"icon": "fas fa-fighter-jet",
				"action": "navigate",
				"label": "Hangar",
				"path": "/hangar",
				"highlight": "/hangar"
			});
			data.navigationItems.push({
				"icon": "fas fa-treasure-chest",
				"action": "navigate",
				"label": "Nouns",
				"path": "/nouns",
				"highlight": "/nouns"
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
			"evaluateConditional": function() {
				
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
