
/**
 * 
 * 
 * @class RSSWPartyPage
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWPartyPage", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};
		
		data.linked = null;
		data.parties = [];
		
		return data;
	},
	"computed": {
		"record": function() {
			return this.universe.nouns.entity[this.$route.params.oid];
		}
	},
	"watch": {
		"record": function(incoming) {
			console.warn("Party record Changed");
			if(this.linked && (!incoming || incoming.id !== this.linked.id)) {
				this.linked.$off(this.update);
			}
			if(incoming) {
				incoming.$on("modified", this.update);
				Vue.set(this, "linked", incoming);
			}
		}
	},
	"mounted": function() {
		rsSystem.register(this);
		
		if(this.record && !this.linked) {
			this.record.$on("modified", this.update);
			Vue.set(this, "linked", this.record);
		}

		this.update();
	},
	"methods": {
		/**
		 * 
		 * @method update
		 */
		"update": function(event) {
			console.warn("Party Updated: ", event);
			var party,
				x;
			
			for(x=0; x<this.parties.length; x++) {
				this.parties[x].$off("modified", this.update);
			}
			
			this.parties.splice(0);
			for(x=0; x<this.universe.indexes.party.listing.length; x++) {
				party = this.universe.indexes.party.listing[x];
				party.$on("modified", this.update);
				this.parties.push(party);
			}
			this.parties.sort(this.sortData);
		}
	},
	"beforeDestroy": function() {
		for(var x=0; x<this.parties.length; x++) {
			this.parties[x].$off("modified", this.update);
		}
		
		if(this.linked) {
			this.linked.$off("modified", this.update);
		}
	},
	"template": Vue.templified("pages/rssw/party.html")
});
