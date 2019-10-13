
/**
 * 
 * 
 * @class RSCore
 * @constructor
 * @module Components
 */
rsSystem.component("RSCore", {
	"inherit": true,
	"mixins": [
		rsSystem.components.StorageManager
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
