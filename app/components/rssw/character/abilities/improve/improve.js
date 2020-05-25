/**
 * 
 * 
 * @class rsswCharacterImproveAbility
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rssw_characterabilityimproveComponentKey";
	
	var levelBars = [0,1,2,3,4];

	var instance = 0;
	
	var sortArchetypes = function(a, b) {
		if(a.classification == b.classification) {
			return 0;
		}
		
		switch(a.classification) {
			case "primary":
				return -1;
			case "secondary":
				return 1;
		}
	};
	
	rsSystem.component("rsswCharacterImproveAbility", {
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
			
			
			data.filters = {};
			data.filters.node = (node) => {
//				console.log("Node[" + node.data.id + "]: ", node);
//				console.log("Node: ", node);
				var styling = {};
				
				if(!node.requires_ability || node.requires_ability.length === 0) {
					styling["text-outline-color"] = "#000";
					styling["background-color"] = "#0e57ea";
				}
				
				if(this.character.ability && node && this.character.ability.indexOf(node.id) !== -1) {
					styling["text-outline-color"] = "#000";
					styling["background-color"] = "white";
					styling["color"] = "white";
				}
				
				if(node.activation === "active") {
					styling["background-color"] = "#670505";
				}
				
				return styling;
			};

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
			"closeDisplay": function() {
				this.$emit("close");
			},
			"selectArchetype": function(archetype) {
				Vue.set(this.state, "selected_archetype", archetype);
				this.update();
			},
			"appendAbilities": function(archetype) {
				var source,
					target,
					x,
					y;

				for(x=0; this.universe.indexes.ability && x<this.universe.indexes.ability.listing.length; x++) {
					target = this.universe.indexes.ability.listing[x];
					if(target && target.archetypes && target.archetypes.indexOf(archetype) !== -1) {
						this.abilities.push(target);
						for(y=0; target.requires_ability && y<target.requires_ability.length; y++) {
							source = this.universe.indexes.ability.index[target.requires_ability[y]];
							if(source) {
								this.dependencies.push({
									"id": target.id + source.id,
									"target": target.id,
									"source": source.id
								});
							}
						}
					}
				}
			},
			"update": function() {
				var buffer,
					x;

				this.dependencies.splice(0);
				this.archetypes.splice(0);
				this.abilities.splice(0);
				
				for(x=0; this.character.archetype && x<this.character.archetype.length; x++) {
					buffer = this.universe.indexes.archetype.index[this.character.archetype[x]];
					if(buffer) {
						this.archetypes.push(buffer);
					}
					if(!this.state.selected_archetype) {
						this.appendAbilities(buffer.id);
					}
				}
				
				if(this.state.selected_archetype) {
					this.appendAbilities(this.state.selected_archetype);
				}
				
				this.archetypes.sort(sortArchetypes);
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("model:modified", this.update);
			this.character.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/abilities/improve.html")
	});	
})();
