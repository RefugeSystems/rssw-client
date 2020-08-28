
(function() {
	
	var dataSource,
		location,
		pathing;
	
	location = {
		"label": "Parent",
		"property": "parent",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	pathing = {
		"label": "Pathing",
		"property": "pathing",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"pathed": {
				"operation": "exists"
			}
		}
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
		"label": "Color",
		"property": "color",
		"type": "text"
	}, {
		"label": "Opacity",
		"property": "opacity",
		"type": "number"
	}, {
		"label": "Thickness",
		"property": "thickness",
		"type": "number"
	},
	location,
	{
		"label": "Pathed",
		"property": "pathed",
		"type": "checkbox"
	}, {
		"label": "Contained",
		"property": "contained",
		"type": "checkbox"
	}, {
		"label": "Curved",
		"property": "curved",
		"type": "checkbox",
		"condition": {
			"contained": {
				"operation": "!"
			}
		}
	}, {
		"label": "Show Name",
		"property": "showName",
		"type": "checkbox"
	}, {
		"label": "Clickable",
		"property": "clickable",
		"type": "checkbox"
	},
	pathing,
	{
		"label": "Path",
		"property": "path",
		"type": "textarea",
		"condition": {
			"pathed": {
				"operation": "!"
			}
		}
	}, {
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsLocale", {
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
			data.fields.locale = dataSource;

			return data;
		},
		"mounted": function() {
			location.options = this.universe.indexes.location.listing;
			location.options.sortBy("name");
			
			pathing.source_index = this.universe.indexes.location;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
