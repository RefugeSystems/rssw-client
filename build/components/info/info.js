
/**
 * 
 * 
 * @class systemInfo
 * @constructor
 * @module Components
 * @zindex 20
 */
(function() {
	var storageKey = "_rs_infoComponentKey";
	
	rsSystem.component("systemInfo", {
		"inherit": true,
		"mixins": [
			
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"player": {
				"required": true,
				"type": Object
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
		"template": Vue.templified("components/info.html")
	});
})();
