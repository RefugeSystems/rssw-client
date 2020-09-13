
/**
 * 
 * 
 * @class rsswEntityBrief
 * @constructor
 * @module Components
 */
(function() {
	var injuryValues = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151];
	
	rsSystem.component("rsswEntityBrief", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.shield = {};
			data.shield.current = 0;
			data.shield.max = 0;

			data.wounds = {};
			data.wounds.current = 0;
			data.wounds.max = 0;

			data.strain = {};
			data.strain.current = 0;
			data.strain.max = 0;
			
			data.injuryValues = injuryValues;
			data.injury = 0;

			data.abilities = [];
			data.effects = [];
			data.lastRoll = null;
			data.rollSkill = "";
			
			data.location = null;
			data.piloting = null;
			data.inside = null;
			
			return data;
		},
		"mounted": function() {
			this.entity.$on("rolled", this.receiveRoll);
			this.entity.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"close": function() {
				this.$emit("close", this.entity);
			},
			"setStat": function(amount, stat) {
				var send = {};
				send[stat] = amount;
				this.entity.commit(send);
			},
			"rollEntitySkill": function(skill) {
				Vue.set(this, "rollSkill", "");
				this.entity.$emit("roll-expression", {
					"skill": this.universe.indexes.skill.index[skill],
					"entity": this.entity
				});
			},
			"receiveRoll": function(event) {
				console.log("Received Roll[" + this.entity.id + "]: ", event);
			},
			"update": function() {
				this.wounds.current = this.entity.wounds || 0;
				this.wounds.max = this.entity.wounds_max || 0;
				this.strain.current = this.entity.strain || 0;
				this.strain.max = this.entity.strain_max || 0;
				this.shield.max = this.entity.shield || 0;
				this.injury = this.entity.injury || 0;
				
				Vue.set(this, "location", this.universe.indexes.location.index[this.entity.location]);
				Vue.set(this, "piloting", this.universe.indexes.entity.index[this.entity.piloting]);
				Vue.set(this, "inside", this.universe.indexes.entity.index[this.entity.inside]);
				
				this.abilities.splice(0);
				this.universe.indexes.ability.translate(this.entity.ability, this.abilities);
				
				this.effects.splice(0);
				this.universe.indexes.effect.translate(this.entity.effect, this.effects);
			}
		},
		"beforeDestroy": function() {
			console.log("Entity Disengaging...");
			this.entity.$off("rolled", this.receiveRoll);
			this.entity.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/entity/brief.html")
	});
})();