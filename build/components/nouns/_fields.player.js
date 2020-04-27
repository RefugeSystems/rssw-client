
(function() {
	
	var dataSource;
	
	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Username",
		"property": "username",
		"type": "text"
	}, {
		"label": "Name",
		"property": "name",
		"type": "text"
	}, {
		"label": "E-Mail",
		"property": "email",
		"type": "text"
	}, {
		"label": "Entity",
		"property": "entity",
		"type": "text"
	}, {
		"label": "Master",
		"property": "master",
		"type": "checkbox"
	}, {
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsPlayer", {
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
			data.fields.player = dataSource;
			
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
