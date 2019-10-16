
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
		"mounted": function() {
			this.character.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"data": function() {
			var data = {},
				x;
			
			for(x=0; x<keys.length; x++) {
				data[keys[x]] = 0;
			}
			
			return data;
		},
		"methods": {
			"setStat": function() {
				
			},
			"update": function() {
				var buffer,
					x;
				
				for(x=0; x<keys.length; x++) {
					Vue.set(this, keys[x], this.character[keys[x]]);
				}
			}
		},
		"beforeDestroy": function() {
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/board.html")
	});
})();