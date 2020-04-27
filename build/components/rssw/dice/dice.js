
/**
 * 
 * 
 * @class rsswDiceBin
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
	}];
	
	
	rsSystem.component("rsswDiceBin", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"type": Object
			},
			"state": {
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.rollProperties = rollProperties;
			data.bound = false;
			
			if(!this.state.expression) {
				Vue.set(this.state, "expression", "");
			}
			if(!this.state.history) {
				Vue.set(this.state, "history", []);
			}
			
			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			
			if(this.entity) {
				this.entity.$on("modified", this.update);
				Vue.set(this, "bound", true);
				this.update();
			}
		},
		"methods": {
			"roll": function(expression) {
				var rolled = Dice.calculateDiceRoll(expression || this.state.expression);
				rolled._expression = expression;
				this.state.history.unshift(rolled);
			},
			"dismiss": function(index) {
				this.state.history.splice(index, 1);
			},
			"toggleExpressions": function() {
				Vue.set(this.state, "hideExpressions", !this.state.hideExpressions);
			},
			"toggleLabels": function() {
				Vue.set(this.state, "hideLabels", !this.state.hideLabels);
			},
			"clear": function() {
				this.state.history.splice(0);
			},
			"info": function() {
				rsSystem.EventBus.$emit("display-info", this.state.knowledge || "knowledge:dice:playerbin");
			},
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			if(this.bound) {
				this.entity.$off("model:modified", this.update);
			}
		},
		"template": Vue.templified("components/rssw/dice.html")
	});
})();