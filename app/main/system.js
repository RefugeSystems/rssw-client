// Assist function for Reactive Component Printing
var _p = function(x) {
	if(x === undefined) {
		return undefined;
	} else if(x === null) {
		return null;
	} else if(typeof(x) === "object") {
		return JSON.parse(JSON.stringify(x));
	} else {
		return x;
	}
};


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
					"path": "ship",
					"component": rsSystem.components.RSSWShip,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWShip
					}]
				}, {
					"path": "item",
					"component": rsSystem.components.RSSWItem,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWItem
					}]
				}]
			}, {
				"path": "construct",
				"component": rsSystem.components.RSWindow,
				"children": [{
					"path": "character",
					"component": rsSystem.components.RSSWCharacterBuilder
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
				"path": "locality",
				"component": rsSystem.components.RSSWLocality,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWLocality
				}]
			}, {
				"path": "storage",
				"component": rsSystem.components.RSSWStorage,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWStorage
				}]
			}, {
				"path": "journal",
				"component": rsSystem.components.RSSWJournal,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWJournal
				}]
			}, {
				"path": "map",
				"component": rsSystem.components.RSSWMap,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWMap
				}]
			}, {
				"path": "galaxy",
				"component": rsSystem.components.RSSWUniverse,
				"children": [{
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
					"path": "ship",
					"component": rsSystem.components.RSSWShip,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWShip
					}]
				}, {
					"path": "item",
					"component": rsSystem.components.RSSWItem,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWItem
					}]
				}]
			}, {
				"path": "universe",
				"component": rsSystem.components.RSSWUniverse,
				"children": [{
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
					"path": "ship",
					"component": rsSystem.components.RSSWShip,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWShip
					}]
				}, {
					"path": "item",
					"component": rsSystem.components.RSSWItem,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWItem
					}]
				}]
			}, {
				"path": "master",
				"component": rsSystem.components.RSSWMasterPage
			}, {
				"path": "party",
				"component": rsSystem.components.RSSWPartyPage,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWPartyPage
				}]
			}, {
				"path": "nouns/:type?/:oid?",
				"component": rsSystem.components.RSNounControls
			}, {
				"path": "ship",
				"component": rsSystem.components.RSSWShip
			}, {
				"path": "about",
				"component": rsSystem.components.RSAbout
			}, {
				"path": "account",
				"component": rsSystem.components.RSAccount
			}, {
				"path": "system",
				"component": rsSystem.components.RSSystem
			}, {
				"path": "test",
				"component": rsSystem.components.RSTest
			}]
		}]);
	},
	"router": rsSystem.Router,
	"props": {
	},
	"created": function() {
		
	}
});
