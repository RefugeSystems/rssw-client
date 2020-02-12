
(function() {
	
	var commonSource,
		listSource,
		dataSource,
		abilities,
		effects;
	
	abilities = {
		"label": "Abilities",
		"property": "ability",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	effects = {
		"label": "Effects",
		"property": "effect",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Name",
		"property": "name",
		"type": "text"
	}, {
		"label": "Soak",
		"property": "soak",
		"type": "text"
	}, {
		"label": "Critical",
		"property": "critical",
		"type": "text"
	}, {
		"label": "Max Wound",
		"property": "wounds_max",
		"type": "text"
	}, {
		"label": "Max Strain",
		"property": "strain_max",
		"type": "text"
	}, {
		"label": "Range",
		"property": "range",
		"type": "text"
	}, {
		"label": "Damage",
		"property": "damage",
		"type": "text"
	}, {
		"label": "Pierce",
		"property": "pierce_damage",
		"type": "text"
	}, {
		"label": "Melee Defense",
		"property": "defense_melee",
		"type": "text"
	}, {
		"label": "Range Defense",
		"property": "defense_range",
		"type": "text"
	}, {
		"label": "Pilot Skill",
		"property": "pilot_skill",
		"type": "text"
	}, {
		"label": "Point Cost",
		"property": "point_cost",
		"type": "text"
	}, {
		"label": "Bonus: Boost",
		"property": "bonus_boost",
		"type": "text"
	}, {
		"label": "Ship Shield",
		"property": "shield",
		"type": "text"
	}, {
		"label": "Ship Attack",
		"property": "attack",
		"type": "text"
	}, {
		"label": "Ship Evasion",
		"property": "evasion",
		"type": "text"
	}, {
		"label": "Ship Hull",
		"property": "hull",
		"type": "text"
	}, {
		"label": "Energy Output",
		"property": "energy_out",
		"type": "text"
	}, {
		"label": "Energy Consumption",
		"property": "energy_consume",
		"type": "text"
	}, {
		"label": "Energy Potential",
		"property": "energy_potential",
		"type": "text"
	}, {
		"label": "Encumberance",
		"property": "encumberance",
		"type": "text"
	}, {
		"label": "Encumberance Bonus",
		"property": "encumberance_bonus",
		"type": "text"
	}, {
		"label": "Max Contents",
		"property": "contents_max",
		"type": "text"
	}, {
		"label": "Scaled Encumberance",
		"property": "scaled_encumberance",
		"type": "text"
	}, {
		"label": "Rarity",
		"property": "rarity",
		"type": "text"
	}, {
		"label": "Hardpoints",
		"property": "hardpoints",
		"type": "text"
	}];
	
	listSource = [
		abilities,
		effects
	];
	
	commonSource = [{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsModifierStats", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSSWStats
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {},
				x;
			
			data.fields = this.fields || {};
			data.fields.modifierstats = [];
			data.fields.modifierstats.push.apply(data.fields.modifierstats, dataSource);
			
			// TODO: Build Fields for Skills and Stats Dynamically
			data.fields.modifierstats.push({
				"label": "Attributes",
				"property": "__attr",
				"type": "label"
			});
			data.fields.modifierstats.push({
				"property": "brawn",
				"label": "Brawn",
				"type": "text"
			});
			data.fields.modifierstats.push({
				"property": "agility",
				"label": "Agility",
				"type": "text"
			});
			data.fields.modifierstats.push({
				"property": "intellect",
				"label": "Intellect",
				"type": "text"
			});
			data.fields.modifierstats.push({
				"property": "cunning",
				"label": "Cunning",
				"type": "text"
			});
			data.fields.modifierstats.push({
				"property": "willpower",
				"label": "Willpower",
				"type": "text"
			});
			data.fields.modifierstats.push({
				"property": "pressence",
				"label": "Pressence",
				"type": "text"
			});
			
			data.fields.modifierstats.push({
				"label": "Skills",
				"property": "__skills",
				"type": "label"
			});
			for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
				data.fields.modifierstats.push({
					"label": this.universe.indexes.skill.listing[x].name,
					"property": this.universe.indexes.skill.listing[x].propertyKey,
					"type": "text"
				});
			}
			
			data.fields.modifierstats.push.apply(data.fields.modifierstats, listSource);
			data.fields.modifierstats.push.apply(data.fields.modifierstats, commonSource);

			abilities.source_index = this.universe.indexes.ability;
			effects.source_index = this.universe.indexes.effect;
			
			return data;
		},
		"mounted": function() {
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
