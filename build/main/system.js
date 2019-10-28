// Assist function for Reactive Component Printing
var _p = function(x) {return JSON.parse(JSON.stringify(x));};

/**
 * 
 * Specifically loaded last to trigger initialization.
 * @class App
 * @constructor
 * @module Main
 * @static
 */
rsSystem.App = new Vue({
	"el": "#game",
	"data": function() {
		return {
			"settings": {}
		};
	},
	"mounted": function() {
		rsSystem.Router.addRoutes([{
			"path": "/",
			"component": rsSystem.components.RSHome,
			"children": [{
				"path": "dashboard",
				"component": rsSystem.components.RSSWDashboard,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWDashboard
				}]
			}, {
				"path": "character",
				"component": rsSystem.components.RSSWCharacter,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWCharacter
				}]
			}, {
				"path": "base",
				"component": rsSystem.components.RSSWBase,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWBase
				}]
			}, {
				"path": "inventory",
				"component": rsSystem.components.RSSWInventory,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWInventory
				}]
			}, {
				"path": "hangar",
				"component": rsSystem.components.RSSWHangar,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWHangar
				}]
			}, {
				"path": "ship",
				"component": rsSystem.components.RSSWShip,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWShip
				}]
			}, {
				"path": "map",
				"component": rsSystem.components.RSSWMap,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWMap
				}]
			}, {
				"path": "universe",
				"component": rsSystem.components.RSSWUniverse
			}, {
				"path": "nouns",
				"component": rsSystem.components.RSNounControls
			}, {
				"path": "ship",
				"component": rsSystem.components.RSSWShip
			}, {
				"path": "about",
				"component": rsSystem.components.RSAbout
			}]
		}]);
	},
	"router": rsSystem.Router,
	"props": {
	},
	"created": function() {
		var rssys = this;
		
	}
});
