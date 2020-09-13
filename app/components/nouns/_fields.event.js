
(function() {
	
	var dataSource,
		categories,
		involved,
		inside,
		place,
		notes;

	categories = [
		"combat",
		"news",
		"story"
	];
	categories.sort();
	categories.push("custom");
	
	involved = {
		"label": "Involved",
		"property": "involved",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	inside = {
		"label": "Inside",
		"property": "inside",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	place = {
		"label": "Place",
		"property": "place",
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
		"type": "text"
	}, {
		"label": "Date",
		"property": "date",
		"type": "date"
	}, {
		"label": "Category",
		"property": "category",
		"type": "select",
		"raw": true,
		"options": categories
	}, {
		"label": "Active",
		"property": "active",
		"type": "checkbox"
	}, {
		"label": "Master Screen",
		"property": "screen",
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
	involved,
	place,
	inside,
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
	
	rsSystem.component("NounFieldsEvent", {
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
			data.fields.event = dataSource;
			
			return data;
		},
		"mounted": function() {
			involved.source_index = this.universe.indexes.entity;
			inside.source_index = this.universe.indexes.entity;
			place.source_index = this.universe.indexes.location;
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
