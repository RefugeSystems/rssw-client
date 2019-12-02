
(function() {
	
	var dataSource;
	
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
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Note",
		"property": "note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsKnowledge", {
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
			data.fields.knowledge = dataSource;
			

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
