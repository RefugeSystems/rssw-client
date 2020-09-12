
(function() {
	
	var dataSource,
		configurations;
	
	configurations = {
		"label": "Configurations",
		"property": "configurations",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "label"
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
		"label": "Declaration",
		"property": "declaration",
		"type": "text"
	}, {
		"label": "Storage ID",
		"property": "sid",
		"type": "text"
	}, {
		"label": "Template",
		"property": "template",
		"type": "checkbox"
	}, {
		"label": "For Players",
		"property": "for_players",
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
	configurations,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsWidget", {
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
			data.fields.widget = dataSource;
			
			return data;
		},
		"mounted": function() {
			configurations.source_index = this.universe.indexes.widgetconfiguration;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
