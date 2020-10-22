
/**
 * 
 * 
 * @class rsswCharacterBoard
 * @constructor
 * @module Components
 */
(function() {
	var keys = [
		"damage",
		"soak",
	    "wounds",
	    "wounds_max",
	    "strain",
	    "strain_max",
	    "defense_general",
	    "defense_range",
	    "defense_melee",
	    "injury"
	    ];
	
	
	var highValues = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	var lowValues = [-2,-1,0,1,2,3,4,5,6,7,8,9,10];
	
	var injuryValues = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151];

	rsSystem.component("rsswCharacterBoard", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"character": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {},
				x;

			data.injuryValues = injuryValues;
			data.highValues = highValues;
			data.lowValues = lowValues;
			for(x=0; x<keys.length; x++) {
				data[keys[x]] = 0;
			}
			
			return data;
		},
		"mounted": function() {
			this.character.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"watch": {
			"wounds": function(nV, oV) {
				this.character.commit({
					"wounds": nV
				});
			},
			"strain": function(nV, oV) {
				this.character.commit({
					"strain": nV
				});
			},
			"injury": function(nV, oV) {
				this.character.commit({
					"injury": nV
				});
			}
		},
		"methods": {
			"infoStat": function(stat) {
				rsSystem.EventBus.$emit("display-info", {
					"source": this.character,
					"record": "knowledge:stat:" + stat
				});
			},
			"setStat": function() {
				
			},
			"getEquippedDefensiveStats": function(type, results) {
				var buffer,
					keys,
					x,
					y;
				
				if(!type) {
					throw new Error("No type specified for rsswCharacterBoard.getEquippedDefensiveStats");
				}
				
				results = results || {};
				results.general = results.general || 0;
				results.melee = results.melee || 0;
				results.range = results.range || 0;
				
				keys = Object.keys(this.character.equipped[type]);
				for(x=0; x<keys.length; x++) {
					for(y=0; y<this.character.equipped[type][keys[x]].length; y++) {
						buffer = this.universe.indexes[type].index[this.character.equipped[type][keys[x]][y]];
						if(buffer) {
							if(buffer.defense_general && buffer.defense_general > results.general) {
								results.general = buffer.defense_general;
							}
							if(buffer.defense_melee && buffer.defense_melee > results.melee) {
								results.melee = buffer.defense_melee;
							}
							if(buffer.defense_range && buffer.defense_range > results.range) {
								results.range = buffer.defense_range;
							}
						} else {
							console.warn("Unknown Object[" + type + "] Specified in Character[" + this.character.id + " Equipped: " + this.character.equipped[type][keys[x]][y]);
						}
					}
				}
				
				return results;
			},
			"update": function() {
				var defense = {},
					buffer,
					x;
				
				for(x=0; x<keys.length; x++) {
					Vue.set(this, keys[x], this.character[keys[x]] || 0);
				}
				
				Vue.set(this, "soak", this.soak + (this.character.brawn || 0));
				
				if(this.character.equipped) {
					if(this.character.equipped.item) {
						this.getEquippedDefensiveStats("item", defense);
					}
				}
				
				if(defense.general > defense.range) {
					Vue.set(this, "defense_range", defense.general);
				} else {
					Vue.set(this, "defense_range", defense.range);
				}
				if(defense.general > defense.melee) {
					Vue.set(this, "defense_melee", defense.general);
				} else {
					Vue.set(this, "defense_melee", defense.melee);
				}
			}
		},
		"beforeDestroy": function() {
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/board.html")
	});
})();