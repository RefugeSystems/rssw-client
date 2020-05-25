/**
 * 
 * 
 * @class rsswSkillSection
 * @constructor
 * @module Components
 */
(function() {
	var levelBars = [0,1,2,3,4];
	var instance = 0;

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
	
	rsSystem.component("rsswSkillSection", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"character": {
				"required": true,
				"type": Object
			},
			"existing": {
				"type": Array
			},
			"debug": {
				"type": Boolean
			},
			"named": {
				"type": String
			},
			"state": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.rollProperties = rollProperties;
			data.instance = instance++;
			data.levelBars = levelBars;
			data.skills = [];

			return data;
		},
		"mounted": function() {
			this.character.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"clearRoll": function(skill) {
				Vue.delete(this.state.rolls, skill);
			},
			"skillNameTouched": function(skill) {
				this.$emit("nametouched", skill);
			},
			"skillRollTouched": function(skill) {
				this.$emit("rolltouched", skill);
			},
			"skillTouched": function(skill) {
				this.$emit("touched", skill);
			},
			"isVisible": function(skill) {
				return !this.state.search || skill._search.indexOf(this.state.search) !== -1;
			},
			"getDice": function(skill) {
				var roll = [], x;

				for (x = 0; x < this.character[skill.base] ||  x < this.character[skill.propertyKey]; x++) {
					if (x < this.character[skill.base] && x < this.character[skill.propertyKey]) {
						roll.push("fas fa-dice-d12 rs-yellow");
					} else {
						roll.push("fas fa-dice-d8 rs-green");
					}
				}
				for (x = 0; x < this.character[skill.bonusKey]; x++) {
					roll.push("fas fa-dice-d6 rs-lightblue");
				}
				return roll;
			},
			"enhancedSkill": function(skill) {
				return !!this.character[skill.enhancementKey];
			},
			"update": function() {
				var buffer,
					x;

				this.skills.splice(0);
				
				if(this.named) {
					for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
						if(!this.universe.indexes.skill.listing[x].hidden && !this.universe.indexes.skill.listing[x].obscured && this.universe.indexes.skill.listing[x].section === this.named) {
							this.skills.push(this.universe.indexes.skill.listing[x]);
						}
					}
				}
				
				if(this.existing) {
					for(x=0; x<this.existing.length; x++) {
						this.skills.push(this.existing[x]);
					}
				}
				
				this.uniqueByID(this.skills);
				this.skills.sort(this.sortData);
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/skills/section.html")
	});	
})();
