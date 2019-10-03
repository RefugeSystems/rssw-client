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
			"component": rsSystem.components.RSHome
		}, {
			"path": "/hangar",
			"component": rsSystem.components.RSSWHangar
		}, {
			"path": "/ship",
			"component": rsSystem.components.RSSWShip
		}, {
			"path": "/about",
			"component": rsSystem.components.RSAbout
		}]);
	},
	"router": rsSystem.Router,
	"props": {
	},
	"created": function() {
		var rssys = this;
		
	}
});
