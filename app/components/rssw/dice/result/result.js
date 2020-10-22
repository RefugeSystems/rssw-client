
/**
 * 
 * 
 * @class rsswDiceResult
 * @constructor
 * @module Components
 * @param {Object} roll Data to be rendered.
 * @param {Object} [options] Can map to a state object or a simple object to provide optional control flags.
 * @param {Boolean} [options.hide_expression] Hides the roll expression (ie. "3p + 2a").
 * @param {Boolean} [options.hide_label] Hides the roll label (ie. "Coordination + 3b").
 * @param {Boolean} [options.hide_names] Hides the roll result name (ie. "Advantage"). 
 */
(function() {

	/**
	 * 
	 * @property rollProperties
	 * @type Object
	 * @static
	 */
	var rollProperties = [{
		"icon": "ra ra-bomb-explosion",
		"property": "success",
		"name": "Success"
	}, {
		"icon": "fad fa-jedi",
		"property": "advantage",
		"name": "Advantage"
	}, {
		"icon": "xwm xwing-miniatures-font-epic",
		"property": "triumph",
		"name": "Triumph"
	}, {
		"icon": "fal fa-triangle rot180",
		"property": "failure",
		"name": "Failure"
	}, {
		"icon": "rsswx rsswx-threat",
		"property": "threat",
		"name": "Threat"
	}, {
		"icon": "rsswx rsswx-despair",
		"property": "despair",
		"name": "Despair"
	}, {
		"icon": "fad fa-circle rs-white rs-secondary-black",
		"property": "light",
		"name": "Light"
	}, {
		"icon": "fad fa-circle rs-black rs-secondary-white",
		"property": "dark",
		"name": "Dark"
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
			"options": {
				"type": Object,
				"default": function() {
					return {};
				}
			},
			"roll": {
				"required": true,
				"type": Object
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
			"dismiss": function() {
				this.$emit("dismiss", this.roll);
			},
			"menu": function() {
				this.$emit("menu", this.roll);
			},
			"update": function() {
			}
		},
		"beforeDestroy": function() {
		},
		"template": Vue.templified("components/rssw/dice/result.html")
	});
})();
