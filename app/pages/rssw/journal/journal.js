
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
		
		data.knowledge = [];
		
		return data;
	},
	"computed": {
		"entity": function() {
			return this.universe.nouns.entity[this.$route.params.oid];
		}
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
			var buffer,
				x;
			
			this.knowledge.splice(0);
			for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
				
			}
			
			
		}
	},
	"template": Vue.templified("pages/rssw/journal.html")
});
