
(function() {
	
	var dataSource;

	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Name",
		"property": "label",
		"type": "text"
	}, {
		"label": "Icon",
		"property": "icon",
		"knowledge": "knowledge:system:icons",
		"type": "text"
	}, {
		"label": "Type",
		"property": "type",
		"type": "select",
		"raw": true,
		"options": [
			"checkbox",
			"number",
			"text"
		]
	}];
	
	rsSystem.component("NounFieldsWidgetConfiguration", {
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
			data.fields.widgetconfiguration = dataSource;
			
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
