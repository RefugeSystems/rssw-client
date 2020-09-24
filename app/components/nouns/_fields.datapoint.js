
(function() {

	var dataSource,
		indexes;

	indexes = {
		"label": "Option Index",
		"property": "option_index",
		"type": "select",
		"raw": true,
		"condition": {
			"type": {
				"operation": "contains",
				"oneof": ["select", "multireference"]
			},
			"raw": {
				"operation": "!"
			}
		}
	};

	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Label",
		"property": "name",
		"type": "text"
	}, {
		"label": "Property",
		"property": "property",
		"type": "text"
	}, {
		"label": "Order",
		"property": "order",
		"type": "number"
	}, {
		"label": "Type",
		"property": "type",
		"type": "select",
		"raw": true,
		"options": [
			"text",
			"textarea",
			"checkbox",
			"number",
			"date",
			"select",
			"multireference"
		]
	}, {
		"label": "Raw Values",
		"property": "raw",
		"type": "checkbox",
		"condition": {
			"type": "select"
		}
	}, {
		"label": "Numeric Values",
		"property": "numeric_values",
		"type": "checkbox",
		"condition": {
			"type": {
				"operation": "contains",
				"oneof": ["multireference"]
			},
			"raw": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Option Value",
		"property": "optionValue",
		"type": "text",
		"condition": {
			"type": {
				"operation": "contains",
				"oneof": ["select", "multireference"]
			},
			"raw": {
				"operation": "!"
			}
		}
	}, {
		"label": "Option Label",
		"property": "optionLabel",
		"type": "text",
		"condition": {
			"type": {
				"operation": "contains",
				"oneof": ["select", "multireference"]
			},
			"raw": {
				"operation": "!"
			}
		}
	},
	indexes,
	{
		"label": "Available Options",
		"property": "options",
		"type": "multireference",
		"raw": true,
		"condition": {
			"type": {
				"operation": "contains",
				"oneof": ["select", "multireference"]
			},
			"raw": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Autocomplete",
		"property": "autocomplete",
		"type": "checkbox",
		"condition": {
			"type": {
				"operation": "contains",
				"oneof": ["multireference"]
			},
			"raw": {
				"operation": "!"
			}
		}
	}, {
		"label": "Primary Stat",
		"property": "primary",
		"type": "checkbox"
	}, {
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}];

	rsSystem.component("NounFieldsDatapoint", {
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
			data.fields.datapoint = dataSource;

			return data;
		},
		"mounted": function() {
			indexes.options = [""].concat(rsSystem.listingNouns);
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {

		}
	});
})();
