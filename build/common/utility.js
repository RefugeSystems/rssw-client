
/**
 * 
 * 
 * @class RSComponentUtility
 * @constructor
 * @module Components
 */
rsSystem.component("RSComponentUtility", {
	"inherit": true,
	"mixins": [
	],
	"props": {
	},
	"computed": {
	},
	"watch": {
	},
	"methods": {
		"showInfo": function(view, base, target) {
			if(view && view.id && this.isOwner(view)) {
				rsSystem.EventBus.$emit("display-info", {
					"target": target,
					"record": view,
					"base": base
				});
			}
		},
		"isOwner": function(record, player) {
			player = this.player || player;
			
			if(player.master) {
				return true;
			}
			
			if(record.owner === this.player.id) {
				return true;
			} else if(record.owners && record.owners.indexOf(this.player.id) !== -1) {
				return true;
			} else if(!record.owner && (!record.owners || record.owners.length === 0)) {
				return true;
			} else {
				return false;
			}
		},
		/**
		 * Compare to lists and find the first matched occurrence. Used primarily for comparing
		 * itemtype lists for agreement. 
		 * @method sharesOne
		 * @param {Array} corpus The list of Strings with which to start.
		 * @param {Array} compare The list of Strings against which to compare.
		 * @return The first element found that occurs in both lists or null if
		 * 		no shared element is found.
		 */
		"sharesOne": function(corpus, compare) {
			var x, y;
			for(x=0; x<corpus.length; x++) {
				for(y=0; y<compare.length; y++) {
					if(corpus[x] === compare[y]) {
						return corpus[x];
					}
				}
			}
			
			return null;
		},
		/**
		 * 
		 * @method uniqueByID
		 * @param {Array} corpus The array to clean.
		 * @return {Array} The passed array that is now cleaned.
		 */
		"uniqueByID": function(corpus) {
			if(!corpus) {
				return corpus;
			}
			
			var track = {},
				x;
			
			for(x=corpus.length-1; 0<=x; x--) {
				if(track[corpus[x].id]) {
					corpus.splice(x, 1);
				} else {
					track[corpus[x].id] = true;
				}
			}
			
			return corpus;
		},
		"sortData": function(a, b) {
			var aName,
				bName;
			
			if(a.order !== undefined && b.order !== undefined && a.order !== null && b.order !== null) {
				if(a.order < b.order) {
					return -1;
				} else if(a.order > b.order) {
					return 1;
				}
			}
			if((a.order === undefined || a.order === null) && b.order !== undefined && b.order !== null) {
				return -1;
			}
			if((b.order === undefined || b.order === null) && a.order !== undefined && a.order !== null) {
				return 1;
			}

			if(a.name !== undefined && b.name !== undefined && a.name !== null && b.name !== null) {
				aName = a.name.toLowerCase();
				bName = b.name.toLowerCase();
				if(aName < bName) {
					return -1;
				} else if(aName > bName) {
					return 1;
				}
			}
			if((a.name === undefined || a.name === null) && b.name !== undefined && b.name !== null) {
				return -1;
			}
			if((b.name === undefined || b.name === null) && a.name !== undefined && a.name !== null) {
				return 1;
			}

			if(a.id < b.id) {
				return -1;
			} else if(a.id > b.id) {
				return 1;
			}
			
			return 0;
		}
	}
});
