
(function() {
	
	var dataSource,
		dependencies,
		archetypes,
		knowledges,
		attrs,
		stats,
		notes;

	archetypes = {
		"label": "Archetypes",
		"property": "archetypes",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	knowledges = {
		"label": "Knowledges",
		"property": "knowledges",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	dependencies = {
		"label": "Dependencies",
		"property": "dependency",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	attrs = {
		"label": "Attributes",
		"property": "modifierattrs",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	stats = {
		"label": "Stats",
		"property": "modifierstats",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	notes = {
		"label": "Notes",
		"property": "note",
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
		"label": "Icon",
		"property": "icon",
		"knowledge": "knowledge:system:icons",
		"type": "text"
	}, {
		"label": "XP Cost",
		"property": "xp_cost",
		"type": "text"
	}, {
		"label": "Type",
		"property": "type",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name",
		"options": [{
			"name": "Building Ability",
			"id": "building"
		}, {
			"name": "Character Ability",
			"id": "character"
		}, {
			"name": "Piloting Ability",
			"id": "pilot"
		}, {
			"name": "Planet Ability",
			"id": "planet"
		}, {
			"name": "Room Ability",
			"id": "room"
		}, {
			"name": "Ship Ability",
			"id": "ship"
		}, {
			"name": "Star System Ability",
			"id": "system"
		}, {
			"name": "Station Ability",
			"id": "station"
		}]
	}, {
		"label": "Activation",
		"property": "activation",
		"type": "select",
		"raw": true,
		"options": [
			"automatic",
			"passive",
			"active"
		]
	}, {
		"label": "Hidden",
		"property": "hidden",
		"type": "checkbox"
	}, {
		"label": "Obscured",
		"property": "obscured",
		"type": "checkbox"
	}, {
		"label": "Dependency Type",
		"property": "dependency_type",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name",
		"options": [{
			"name": "Any",
			"id": undefined
		}, {
			"name": "All",
			"id": "all"
		}]
	},
	archetypes,
	dependencies,
	knowledges,
	attrs,
	stats,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	},
	notes,
	{
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsAbility", {
		"inherit": true,
		"props": {
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			data.fields = this.fields || {};
			data.fields.ability = dataSource;
			

			return data;
		},
		"mounted": function() {
			archetypes.source_index = this.universe.indexes.archetype;
			dependencies.source_index = this.universe.indexes.ability;
			knowledges.source_index = this.universe.indexes.knowledge;
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			notes.source_index = this.universe.indexes.note;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
