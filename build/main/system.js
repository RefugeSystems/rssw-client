
/* Pulled after components are concatenated but before the lib folder */

var _p = function(x) {return JSON.parse(JSON.stringify(x));};

/**
 * 
 * @class Router
 * @constructor
 * @module Main
 * @static
 * @extends VueRouter
 */
rsSystem.Router = new VueRouter({
	mode: "hash"
});

/**
 * 
 * @class Device
 * @constructor
 * @module Main
 * @static
 */
rsSystem.device = {
	/**
	 * True if the device supports touch
	 * @property touch
	 * @type Boolean
	 */
	"touch": ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch
};

/**
 * 
 * @class App
 * @constructor
 * @module Main
 * @static
 * @module rsSystem
 */
rsSystem.App = new Vue({
	"el": "#game",
	"data": function() {
		return {
			"settings": {}
		};
	},
	"router": rsSystem.Router,
	"props": {
	},
	"created": function() {
		var rssys = this;
	}
});
