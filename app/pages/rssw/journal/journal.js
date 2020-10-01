
/**
 *
 *
 * @class RSSWJournal
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWJournal", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};

		return data;
	},
	"computed": {

	},
	"mounted": function() {
		rsSystem.register(this);
	},
	"methods": {


		/**
		 *
		 * @method update
		 */
		"update": function() {

		}
	},
	"template": Vue.templified("pages/rssw/journal.html")
});
