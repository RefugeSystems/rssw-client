
(function() {

	var commonSource,
		listSource,
		conditions,
		dataSource,
		abilities,
		effects,
		skills,
		ranges,
		slots,
		types,
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

	conditions = {
		"label": "Conditions",
		"property": "condition",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	types = {
		"label": "Types",
		"property": "type",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	abilities = {
		"label": "Abilities",
		"property": "ability",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	slots = {
		"label": "Slots",
		"property": "slot",
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
		"label": "Start Wound",
		"property": "wounds_start",
		"type": "text"
	}, {
		"label": "Start Strain",
		"property": "strain_start",
		"type": "text"
	}, {
		"label": "XP Start",
		"property": "xp_start",
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
		"label": "Speed",
		"property": "speed",
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
		"label": "Concealment",
		"property": "concealment",
		"type": "text"
	}, {
		"label": "Ship Specific Stats",
		"property": "__shipstats",
		"type": "label"
	}, {
		"label": "Required Crew",
		"property": "required_crew",
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
		"label": "Bonus: Boost",
		"property": "bonus_boost",
		"type": "text"
	}, {
		"label": "Bonus: Speed",
		"property": "bonus_ship_speed",
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
	}, {
		"label": "Item Qualities",
		"property": "__qualities",
		"type": "label"
	}, {
		"label": "Quality",
		"property": "quality",
		"type": "text"
	}, {
		"label": "Damage",
		"property": "damage",
		"type": "text"
	}, {
		"label": "Critical",
		"property": "critical",
		"type": "text"
	}, {
		"label": "Critical Bonus",
		"property": "critical_damage_bonus",
		"type": "text"
	}, {
		"label": "Accurate",
		"property": "accurate",
		"type": "text"
	}, {
		"label": "Inaccurate",
		"property": "inaccurate",
		"type": "text"
	}, {
		"label": "Auto-Fire",
		"property": "autofire",
		"type": "text"
	}, {
		"label": "Slow Fire",
		"property": "slowfire",
		"type": "text"
	}, {
		"label": "Breach",
		"property": "breach",
		"type": "text"
	}, {
		"label": "Blast",
		"property": "blast",
		"type": "text"
	}, {
		"label": "Concussive",
		"property": "concussive",
		"type": "text"
	}, {
		"label": "Cortosis",
		"property": "cortosis",
		"type": "text"
	}, {
		"label": "Burn",
		"property": "burn",
		"type": "text"
	}, {
		"label": "Cumbersome",
		"property": "cumbersome",
		"type": "text"
	}, {
		"label": "Defensive",
		"property": "defensive",
		"type": "text"
	}, {
		"label": "Deflection",
		"property": "deflection",
		"type": "text"
	}, {
		"label": "Disorient",
		"property": "disorient",
		"type": "text"
	}, {
		"label": "Knockdown",
		"property": "knockdown",
		"type": "text"
	}, {
		"label": "Ensnare",
		"property": "ensnare",
		"type": "text"
	}, {
		"label": "Inferior",
		"property": "inferior",
		"type": "text"
	}, {
		"label": "Ion",
		"property": "ion",
		"type": "text"
	}, {
		"label": "Guided",
		"property": "guided",
		"type": "text"
	}, {
		"label": "Limited Ammo",
		"property": "limitedammo",
		"type": "text"
	}, {
		"label": "Linked",
		"property": "linked",
		"type": "text"
	}, {
		"label": "Pierce",
		"property": "pierce",
		"type": "text"
	}, {
		"label": "Prepare",
		"property": "prepare",
		"type": "text"
	}, {
		"label": "Stun Damage",
		"property": "stundamage",
		"type": "text"
	}, {
		"label": "Sunder",
		"property": "sunder",
		"type": "text"
	}, {
		"label": "Superior",
		"property": "superior",
		"type": "text"
	}, {
		"label": "Tractor",
		"property": "tractor",
		"type": "text"
	}, {
		"label": "Stun",
		"property": "stun",
		"type": "text"
	}, {
		"label": "Vicious",
		"property": "vicious",
		"type": "text"
	}];

	listSource = [
		abilities,
		effects,
		skills,
		slots,
		conditions,
		types
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

			/*
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
			*/

			data.fields.modifierstats.push({
				"label": "Skill Amendments",
				"property": "__skillamendments",
				"type": "label"
			});
			data.fields.modifierstats.push({
				"label": "Specific Check (+)",
				"property": "skill_amend_direct_check",
				"type": "text"
			});
			for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
				data.fields.modifierstats.push({
					"label": this.universe.indexes.skill.listing[x].name + " (+)",
					"property": "skill_amend_" + this.universe.indexes.skill.listing[x].property,
					"type": "text"
				});
			}

			data.fields.modifierstats.push.apply(data.fields.modifierstats, listSource);
			data.fields.modifierstats.push.apply(data.fields.modifierstats, commonSource);

			return data;
		},
		"mounted": function() {
			conditions.source_index = this.universe.indexes.condition;
			abilities.source_index = this.universe.indexes.ability;
			effects.source_index = this.universe.indexes.effect;
			skills.source_index = this.universe.indexes.skill;
			types.source_index = this.universe.indexes.type;
			slots.source_index = this.universe.indexes.slot;
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {

		}
	});
})();
