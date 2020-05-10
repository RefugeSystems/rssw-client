/**
 * 
 * 
 * @class rsswCharacterAbilities
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rssw_characterabilityComponentKey";
	
	var levelBars = [0,1,2,3,4];

	var instance = 0;
	
	rsSystem.component("rsswCharacterAbilities", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"character": {
				"required": true,
				"type": Object
			},
			"state": {
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.storageKeyID = storageKey + this.character.id;
			data.levelBars = levelBars;
			data.leveling = "";
//			data.state = this.loadStorage(data.storageKeyID, {
//				"hideNames": false,
//				"search": ""
//			});

			data.instance = instance++;
			data.customSkills = [];
			data.levelSkills = [];
			data.subSkills = [];

			// Build Data Set to Pass
			data.dependencies = [];
			data.archetypes = [];
			data.abilities = [];
			
			return data;
		},
		"watch": {
//			"state": {
//				"deep": true,
//				"handler": function() {
//					if(this.state.search !== this.state.search.toLowerCase()) {
//						Vue.set(this.state, "search", this.state.search.toLowerCase());
//					}
//					this.saveStorage(this.storageKeyID, this.state);
//				}
//			}
		},
		"mounted": function() {
			this.universe.$on("model:modified", this.update);
			this.character.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {
			this.universe.$off("model:modified", this.update);
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/abilities.html")
	});	
})();
