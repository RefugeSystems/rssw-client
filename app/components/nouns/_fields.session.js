
(function() {
	
	var dataSource,
		related;

	related = {
		"label": "Related",
		"property": "related",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Number",
		"property": "name",
		"type": "text"
	}, {
		"label": "Title",
		"property": "title",
		"type": "text"
	}, {
		"label": "Real Date",
		"property": "date",
		"type": "number"
	}, {
		"label": "Game Time",
		"property": "time",
		"type": "number"
	},
	related,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsSession", {
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
			data.fields.session = dataSource;

			return data;
		},
		"mounted": function() {
			related.source_index = this.universe.index;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
