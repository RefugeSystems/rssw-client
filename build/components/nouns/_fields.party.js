
(function() {
	
	var dataSource,
		location,
		entities,
		notes;
	
	entities = {
		"label": "Entities",
		"property": "entity",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	location = {
		"label": "Location",
		"property": "location",
		"type": "select",
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
		"label": "Active",
		"property": "active",
		"type": "checkbox"
	}, {
		"label": "Hidden",
		"property": "hidden",
		"type": "checkbox"
	}, {
		"label": "Obscured",
		"property": "obscured",
		"type": "checkbox"
	},
	entities,
	location,
	{
		"label": "X Coordinate",
		"property": "x",
		"type": "number",
		"condition": {
			"location": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Y Coordinate",
		"property": "y",
		"type": "number",
		"condition": {
			"location": {
				"operation": "exists"
			}
		}
	},
	notes,
	{
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsParty", {
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
			data.fields.party = dataSource;
			
			return data;
		},
		"mounted": function() {
			location.options = this.universe.indexes.location.listing;
			location.options.sortBy("name");
			
			entities.source_index = this.universe.indexes.entity;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
