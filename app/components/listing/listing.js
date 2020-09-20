
/**
 *
 *
 * @class rsListing
 * @constructor
 * @module Components
 */
(function() {
	/**
	 *
	 * @property storageKey
	 * @type String
	 * @private
	 * @static
	 */
	var storageKey = "_rs_listingComponentKey:";

	rsSystem.component("rsListing", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSCore
		],
		"props": {
			"id": {
				"default": "listcomp",
				"type": String
			},
			"checker": {
				"type": Function
			},
			"empty": {
				"type": String
			},
			"placeholder": {
				"default": "Filter List...",
				"type": String
			},
			"active": {
				"type": String
			},
			"emit": {
				"type": Boolean
			},
			"infobase": {
				"type": Object
			},
			"list": {
				"required": true,
				"type": Array
			}
		},
		"data": function() {
			var data = {};

			data.storageKeyID = storageKey + this.id;
			data.state = this.loadStorage(data.storageKeyID, {
				"search": ""
			});

			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			this.sync();
		},
		"methods": {
			"isVisible": function(record) {
				return !this.state.search || (record && record._search && record._search.indexOf(this.state.search.toLowerCase()) !== -1);
			},
			"entryStyleClass": function(record) {
				var classes = "";
				if(this.checker && this.player && !this.checker(record, this.player)) {
					classes += "disabled";
				}
				if(record.id === this.active) {
					classes += " active";
				}
				return classes;
			},
			"openListed": function(record) {
				if(this.emit) {
					this.$emit("open", record);
				} else {
					this.showInfo(record, this.infobase);
				}
			},
			"sync": function() {

			}
		},
		"template": Vue.templified("components/listing.html")
	});
})();
