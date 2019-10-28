
/**
 * 
 * 
 * @class rsField
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_fieldComponentKey";
	
	rsSystem.component("rsField", {
		"inherit": true,
		"mixins": [
			
		],
		"props": {
			"root": {
				"required": true,
				"type": Object
			},
			"field": {
				"required": true,
				"type": Object
			},
			"id": {
				"required": true,
				"type": String
			}
		},
		"mounted": function() {
			rsSystem.register(this);
		},
		"data": function() {
			var data = {};
			
			return data;
		},
		"watch": {
		},
		"methods": {
			
		},
		"template": Vue.templified("components/field.html")
	});
})();
