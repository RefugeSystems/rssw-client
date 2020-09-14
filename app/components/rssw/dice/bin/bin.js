
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
	}, {
		"icon": "fad fa-circle rs-white rs-secondary-black",
		"property": "light",
		"label": "Light"
	}, {
		"icon": "fad fa-circle rs-black rs-secondary-white",
		"property": "dark",
		"label": "Dark"
	}];
	
	
	rsSystem.component("rsswDiceBin", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSCore
		],
		"props": {
			"fullDisplay": {
				"type": Boolean
			},
			"entity": {
				"type": Object
			},
			"emitter": {
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
				this.entity.$on("roll-expression", this.roll);
				this.entity.$on("roll-skill", this.rollSkill);
				Vue.set(this, "bound", true);
			}
			if(this.emitter) {
				this.emitter.$on("roll-expression", this.roll);
				Vue.set(this, "bound", true);
			}
		},
		"methods": {
			"rollSkill": function(skill, entity) {
//				console.log("Rolling Skill: ", this.entity, skill);
				if(this.state.entityRollListener) {
					this.roll(this.getSkillDiceExpression(skill, entity), skill.name);
				}
			},
			"roll": function(expression, name) {
				var rolled;
				
				if(expression) {
					if(expression.skill && expression.entity) {
						this.roll(this.getSkillDiceExpression(expression.skill, expression.entity), expression.skill.name);
					} else {
						if(typeof(expression) === "object") {
							name = name || expression._label || expression.label || expression._name || expression.name;
							expression = expression.expression;
						}
						rolled = Dice.calculateDiceRoll(expression || this.state.expression, this.entity);
						rolled._expression = expression;
						rolled._label = name;
						this.state.history.unshift(rolled);
						
						if(this.emitter) {
							this.$forceUpdate();
						}
						
						if(this.entity) {
							rolled.id = this.entity.id;
							this.universe.send("entity:rolled", rolled);
						}
					}
				}
			},
			"addExpression": function(expression) {
				var current = this.state.history[0],
					roll,
					keys,
					x;
				
				if(!current) {
					current = {};
					current._expression = "";
					this.state.history.unshift(current);
				}
				
				roll = Dice.calculateDiceRoll(expression);
				keys = Object.keys(roll);
				if(current._label) {
					if(current._suffix) {
						Vue.set(current, "_suffix", Dice.reduceDiceRoll(current._suffix + " + " + expression));
					} else {
						Vue.set(current, "_suffix", expression);
					}
				}
				Vue.set(current, "_expression", Dice.reduceDiceRoll(current._expression + " + " + expression));
				for(x=0; x<keys.length; x++) {
					Vue.set(current, keys[x], (current[keys[x]] || 0) + roll[keys[x]]);
				}
				
				if(this.emitter) {
					this.$forceUpdate();
				}
				
				if(this.entity) {
					roll.id = this.entity.id;
					this.universe.send("entity:rolled", current);
				}
			},
			"getSkillDiceExpression": function(skill, entity) {
				if(entity = entity || this.entity) {
					var roll = {},
						s,
						x;
					
					s = entity[skill.propertyKey] || 0;
					roll.b = entity[skill.bonusKey] || 0;
					if(entity[skill.base] < s) {
						roll.a = s - entity[skill.base];
						roll.p = entity[skill.base];
					} else {
						roll.a = entity[skill.base] - s;
						roll.p = s;
					}
	
					return roll.a + "a + " + roll.b + "b + " + roll.p + "p";
				}
				
				return "";
			},
			"dismiss": function(index) {
				this.state.history.splice(index, 1);
				if(this.emitter) {
					this.$forceUpdate();
				}
			},
			"toggleExpressions": function() {
				Vue.set(this.state, "hideExpressions", !this.state.hideExpressions);
			},
			"toggleLabels": function() {
				Vue.set(this.state, "hideLabels", !this.state.hideLabels);
			},
			"clear": function() {
				if(this.state.history.length) {
					this.state.history.splice(0);
				} else {
					Vue.set(this.state, "expression", "");
				}
				
				if(this.emitter) {
					this.$forceUpdate();
				}
			},
			"info": function() {
				rsSystem.EventBus.$emit("display-info", this.state.knowledge || "knowledge:dice:playerbin");
			},
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			if(this.bound) {
				if(this.entity) {
					this.entity.$off("roll-skill", this.rollSkill);
					this.entity.$off("roll-expression", this.roll);
				}
				if(this.emitter) {
					this.emitter.$off("roll-expression", this.roll);
				}
			}
		},
		"template": Vue.templified("components/rssw/dice/bin.html")
	});
})();