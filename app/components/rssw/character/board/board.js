
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
			"update": function() {
				var buffer,
					x;
				
				for(x=0; x<keys.length; x++) {
					Vue.set(this, keys[x], this.character[keys[x]] || 0);
				}
				
				Vue.set(this, "soak", this.soak + this.character.brawn);
				if(this.defense_general > this.defense_range) {
					Vue.set(this, "defense_range", this.defense_general);
				}
				if(this.defense_general > this.defense_melee) {
					Vue.set(this, "defense_melee", this.defense_general);
				}
			}
		},
		"beforeDestroy": function() {
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/board.html")
	});
})();