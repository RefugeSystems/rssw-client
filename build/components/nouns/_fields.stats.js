
(function() {
	
	var commonSource,
		listSource,
		dataSource,
		
		abilities;
	
	abilities = {
		"label": "Abilities",
		"property": "ability",
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
		"type": "number"
	}, {
		"label": "Max Wound",
		"property": "wounds_max",
		"type": "number"
	}, {
		"label": "Max Strain",
		"property": "strain_max",
		"type": "number"
	}, {
		"label": "Range",
		"property": "range",
		"type": "number"
	}, {
		"label": "Damage",
		"property": "damage",
		"type": "number"
	}, {
		"label": "Melee Defense",
		"property": "defense_melee",
		"type": "number"
	}, {
		"label": "Range Defense",
		"property": "defense_range",
		"type": "number"
	}, {
		"label": "Ship Shield",
		"property": "shield",
		"type": "number"
	}, {
		"label": "Ship Attack",
		"property": "attack",
		"type": "number"
	}, {
		"label": "Ship Evasion",
		"property": "evasion",
		"type": "number"
	}, {
		"label": "Ship Hull",
		"property": "hull",
		"type": "number"
	}, {
		"label": "Energy Output",
		"property": "energy_out",
		"type": "number"
	}, {
		"label": "Energy Consumption",
		"property": "energy_consume",
		"type": "number"
	}, {
		"label": "Energy Potential",
		"property": "energy_potential",
		"type": "number"
	}];
	
	listSource = [
		abilities
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
				"property": "",
				"type": "label"
			});
			data.fields.modifierstats.push({
				"property": "brawn",
				"label": "Brawn",
				"type": "number"
			});
			data.fields.modifierstats.push({
				"property": "agility",
				"label": "Agility",
				"type": "number"
			});
			data.fields.modifierstats.push({
				"property": "intellect",
				"label": "Intellect",
				"type": "number"
			});
			data.fields.modifierstats.push({
				"property": "cunning",
				"label": "Cunning",
				"type": "number"
			});
			data.fields.modifierstats.push({
				"property": "willpower",
				"label": "Willpower",
				"type": "number"
			});
			data.fields.modifierstats.push({
				"property": "pressence",
				"label": "Pressence",
				"type": "number"
			});
			
			data.fields.modifierstats.push({
				"label": "Skills",
				"property": "",
				"type": "label"
			});
			for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
				data.fields.modifierstats.push({
					"label": this.universe.indexes.skill.listing[x].name,
					"property": this.universe.indexes.skill.listing[x].property_key,
					"type": "number"
				});
			}
			
			data.fields.modifierstats.push.apply(data.fields.modifierstats, listSource);
			data.fields.modifierstats.push.apply(data.fields.modifierstats, commonSource);

			return data;
		},
		"mounted": function() {
			abilities.source_index = this.universe.indexes.ability;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
