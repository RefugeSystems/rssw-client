
(function() {
	
	var dataSource,
		dependency,
		attrs,
		stats,
		notes;

	dependency = {
		"label": "Dependency",
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
	},
	dependency,
	{
		"label": "Dependency Type",
		"property": "dependency_type",
		"type": "select",
		"raw": true,
		"options": [
			"any",
			"all"
		]
	},
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
			dependency.options = this.universe.indexes.ability.listing;
			dependency.options.sortBy("name");

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
