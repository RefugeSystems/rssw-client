
/**
 * 
 * 
 * @class rsswDiceView
 * @constructor
 * @module Components
 */
(function() {
	rsSystem.component("rsswDiceView", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility
		],
		"props": {
			"universe": {
				"type": Object
			},
			"entity": {
			},
			"skill": {
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
			data.dice = [];
			return data;
		},
		"mounted": function() {
			if(this.entity) {
				this.entity.$on("modified", this.update);
			}
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"sendToDiceBin": function() {
				if(this.entity) {
					this.entity.$emit("roll-expression", this.getRollExpression());
				}
			},
			"getRollExpression": function() {
				var expression = "",
					x;
				
				for(x=0; x<this.diceTypes.length; x++) {
					if(this.roll[this.diceTypes[x]]) {
						if(expression) {
							expression = this.roll[this.diceTypes[x]] + this.diceTypes[x][0];
						} else {
							expression += " " + this.roll[this.diceTypes[x]] + this.diceTypes[x][0];
						}
					}
				}
				
				return expression;
			},
			"clearRoll": function() {
				for(var x=0; x<this.diceTypes.length; x++) {
					Vue.delete(this.roll, this.diceTypes[x]);
				}
			},
			"setRoll": function(roll) {
				for(var x=0; x<this.diceTypes.length; x++) {
					if(roll[this.diceTypes[x]]) {
						Vue.set(this.roll, this.diceTypes[x], roll[this.diceTypes[x]]);
					}
				}
			},
			"update": function() {
				this.dice.splice(0);
				
				if(this.entity && this.skill && this.universe) {
					this.setRoll(this.getSkillRoll(this.skill, this.entity));
				}
				
				this.renderRoll(this.roll, this.dice);
			}
		},
		"beforeDestroy": function() {
			if(this.entity) {
				this.entity.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/rssw/diceview.html")
	});
})();
