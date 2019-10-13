
/**
 * 
 * 
 * @class RSCorePage
 * @constructor
 * @module Components
 */
rsSystem.component("RSCorePage", {
	"inherit": true,
	"mixins": [
	],
	"props": {
		"universe": {
			"required": true,
			"type": Object
		},
		"user": {
			"required": true,
			"type": Object
		}
	},
	"computed": {
		"player": function() {
			return this.universe.nouns.player[this.user.id];
		}
	},
	"watch": {
	},
	"methods": {
	}
});
