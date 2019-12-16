
/**
 * 
 * 
 * @class rsswCharacterBoard
 * @constructor
 * @module Components
 */
(function() {
	var keys = [
		"soak",
	    "wounds",
	    "wounds_max",
	    "strain",
	    "strain_max",
	    "defense_range",
	    "defense_melee"
	    ];
	
	
	var highValues = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	var lowValues = [-2,-1,0,1,2,3,4,5,6,7,8,9,10];

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
			}
		},
		"methods": {
			"setStat": function() {
				
			},
			"update": function() {
				var buffer,
					x;
				
				for(x=0; x<keys.length; x++) {
					Vue.set(this, keys[x], this.character[keys[x]] || 0);
				}
			}
		},
		"beforeDestroy": function() {
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/board.html")
	});
})();