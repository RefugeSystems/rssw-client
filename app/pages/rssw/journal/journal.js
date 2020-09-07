
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
		
		data.entries = [];
		data.known = [];
		
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
			
			this.known.splice(0);
			for(x=0; x<this.entity._knownKeys.length; x++) {
				buffer = this.universe.index.index[this.entity._knownKeys[x]];
				if(buffer && !buffer.obscured) {
					this.known.push(buffer);
				}
			}
			
			this.entries.splice(0);
			for(x=0; x<this.universe.index.journal.listing.length; x++) {
				if(this.universe.index.journal.listing[x].editor === this.entity.id) {
					this.entries.push(this.universe.index.journal.listing[x]);
				}
			}
		}
	},
	"template": Vue.templified("pages/rssw/journal.html")
});
