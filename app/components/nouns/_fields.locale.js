
(function() {
	
	var dataSource,
		location,
		pathing;
	
	location = {
		"label": "Residence",
		"property": "residence",
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
		"label": "Icon",
		"property": "icon",
		"type": "text"
	}, {
		"label": "Label Color",
		"property": "label_color",
		"type": "text"
	}, {
		"label": "Label Opacity",
		"property": "label_opacity",
		"type": "number"
	}, {
		"label": "X Coordinate",
		"property": "x",
		"type": "number"
	}, {
		"label": "Y Coordinate",
		"property": "y",
		"type": "number"
	}, {
		"label": "Order",
		"property": "order",
		"type": "number"
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
		"label": "Curved",
		"property": "curved",
		"type": "checkbox"
	}, {
		"label": "Contained",
		"property": "contained",
		"type": "checkbox"
	}, {
		"label": "Fill Color",
		"property": "fill_color",
		"type": "text",
		"condition": {
			"contained": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Fill Opacity",
		"property": "fill_opacity",
		"type": "number",
		"condition": {
			"contained": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Show Name",
		"property": "show_name",
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
