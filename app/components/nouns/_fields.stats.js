
(function() {
	
	var commonSource,
		listSource,
		dataSource,
		abilities,
		effects,
		skills,
		ranges,
		dice;
	
	ranges = [
		"general",
		"engaged",
		"short",
		"medium",
		"long",
		"extreme"
	];
	
	dice = [
		"proficiency",
		"ability",
		"boost",
		"challenge",
		"difficulty",
		"setback",
		"setforward"
	];
	
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
	
	skills = {
		"label": "Skills",
		"property": "skill",
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
		"label": "Critical",
		"property": "critical",
		"type": "text"
	}, {
		"label": "Soak",
		"property": "soak",
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
		"label": "Damage",
		"property": "damage",
		"type": "text"
	}, {
		"label": "Crit. Bonus",
		"property": "critical_damage_bonus",
		"type": "text"
	}, {
		"label": "Pierce",
		"property": "pierce_damage",
		"type": "text"
	}, {
		"label": "General Defense",
		"property": "defense_general",
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
		"label": "XP Cost",
		"property": "xp_cost",
		"type": "text"
	}, {
		"label": "Slots Used",
		"property": "slots_used",
		"type": "number"
	}, {
		"label": "Required Crew",
		"property": "required_crew",
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
		"label": "Mass",
		"property": "mass",
		"type": "text"
	}, {
		"label": "Cumbersome",
		"property": "cumbersome",
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
	}, {
		"label": "Charges and Recharging",
		"property": "__charges",
		"type": "label"
	}, {
		"label": "Max Charges",
		"property": "charges_max",
		"type": "text"
	}, {
		"label": "Session Gain",
		"property": "charges_gain_session",
		"type": "text"
	}, {
		"label": "Session Rate",
		"property": "charges_rate_session",
		"type": "text"
	}, {
		"label": "Long Gain",
		"property": "charges_gain_long",
		"type": "text"
	}, {
		"label": "Long Rate",
		"property": "charges_rate_long",
		"type": "text"
	}, {
		"label": "Short Gain",
		"property": "charges_gain_short",
		"type": "text"
	}, {
		"label": "Short Rate",
		"property": "charges_rate_short",
		"type": "text"
	}];
	
	listSource = [
		abilities,
		effects,
		skills
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
			rsSystem.components.RSComponentUtility,
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
				x,
				y;
			
			data.fields = this.fields || {};
			data.fields.modifierstats = [];
			data.fields.modifierstats.push.apply(data.fields.modifierstats, dataSource);

			
			// TODO: Build Fields for Skills and Stats Dynamically
			data.fields.modifierstats.push({
				"label": "Combat Range Bonuses",
				"property": "__crb",
				"type": "label"
			});
			data.fields.modifierstats.push({
				"label": "Attack Range",
				"property": "range",
				"type": "text"
			});
			for(x=0; x<ranges.length; x++) {
				for(y=0; y<dice.length; y++) {
					data.fields.modifierstats.push({
						"label": ranges[x].capitalize() + " " + dice[y],
						"property": "range_" + ranges[x] + "_" + dice[y],
						"type": "text"
					});
				}
			}
			
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
			this.universe.indexes.skill.listing.sort(this.sortData);
			for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
				data.fields.modifierstats.push({
					"label": this.universe.indexes.skill.listing[x].name,
					"property": this.universe.indexes.skill.listing[x].propertyKey,
					"type": "text"
				});
			}
			
			data.fields.modifierstats.push({
				"label": "Skill Boosts",
				"property": "__skillboosts",
				"type": "label"
			});
			for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
				data.fields.modifierstats.push({
					"label": this.universe.indexes.skill.listing[x].name + " (B)",
					"property": "skill_bonuses_" + this.universe.indexes.skill.listing[x].property,
					"type": "text"
				});
			}
			
			data.fields.modifierstats.push.apply(data.fields.modifierstats, listSource);
			data.fields.modifierstats.push.apply(data.fields.modifierstats, commonSource);

			abilities.source_index = this.universe.indexes.ability;
			effects.source_index = this.universe.indexes.effect;
			skills.source_index = this.universe.indexes.skill;
			
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
