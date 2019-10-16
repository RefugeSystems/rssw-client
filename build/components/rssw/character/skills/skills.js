/**
 * 
 * 
 * @class rsswCharacterSkills
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rssw_characterskillsComponentKey";

	rsSystem.component("rsswCharacterSkills", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSSWStats, rsSystem.components.RSCore
		],
		"props": {
			"character": {
				"required": true,
				"type": Object
			}
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					if(this.state.search !== this.state.search.toLowerCase()) {
						Vue.set(this.state, "search", this.state.search.toLowerCase());
					}
					this.saveStorage(storageKey, this.state);
				}
			}
		},
		"mounted": function() {
			this.character.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"data": function() {
			var data = {};

			data.state = this.loadStorage(storageKey, {
				"hideNames": false,
				"search": ""
			});
			console.log("Loaded Data[" + storageKey + "]: ", data.state);

			return data;
		},
		"methods": {
			"getDice": function(skill) {
				var roll = [], x;

				for (x = 0; x < this.character[skill.base]; x++) {
					if (x < this.character[skill.base] && x < this.character[skill.propertyKey]) {
						roll.push("fas fa-dice-d12 rs-yellow");
					} else {
						roll.push("fas fa-dice-d8 rs-green rot45");
					}
				}

				return roll;
			},
			"enhancedSkill": function(skill) {
				return !!this.character[skill.enhancementKey];
			},
			"update": function() {
				var buffer, x;

				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/skills.html")
	});	
})();
