
/**
 * 
 * 
 * @class rsswDiceResult
 * @constructor
 * @module Components
 */
(function() {

	var rollProperties = [{
		"icon": "ra ra-bomb-explosion",
		"property": "success",
		"label": "Success"
	}, {
		"icon": "fad fa-jedi",
		"property": "advantage",
		"label": "Advantage"
	}, {
		"icon": "xwm xwing-miniatures-font-epic",
		"property": "triumph",
		"label": "Triumph"
	}, {
		"icon": "fal fa-triangle rot180",
		"property": "failure",
		"label": "Failure"
	}, {
		"icon": "rsswx rsswx-threat",
		"property": "threat",
		"label": "Threat"
	}, {
		"icon": "rsswx rsswx-despair",
		"property": "despair",
		"label": "Despair"
	}, {
		"icon": "fad fa-circle rs-white rs-secondary-black",
		"property": "light",
		"label": "Light"
	}, {
		"icon": "fad fa-circle rs-black rs-secondary-white",
		"property": "dark",
		"label": "Dark"
	}];
	
	rsSystem.component("rsswDiceResult", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility
		],
		"props": {
			"universe": {
				"type": Object
			},
			"state": {
				"type": Object,
				"default": function() {
					return {};
				}
			},
			"roll": {
				"type": Object,
				"default": function() {
					return {};
				}
			}
		},
		"data": function() {
			var data = {};
			
			data.rollProperties = rollProperties;
			
			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"update": function() {
			}
		},
		"beforeDestroy": function() {
		},
		"template": Vue.templified("components/rssw/diceview/result.html")
	});
})();
