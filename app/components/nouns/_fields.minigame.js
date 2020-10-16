
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
		"label": "name",
		"property": "name",
		"type": "text"
	}, {
		"label": "Icon",
		"property": "icon",
		"type": "text"
	}, {
		"label": "Inactive",
		"property": "inactive",
		"type": "checkbox"
	}, {
		"label": "Game Medium",
		"property": "medium",
		"type": "select",
		"raw": true,
		"options": ["cards", "board", "words", "gestures"]
	}, {
		"label": "Board Shape",
		"property": "shape",
		"type": "select",
		"raw": true,
		"options": ["circle", "grid", "polygon"],
		"condition": {
			"medium": {
				"operation": "contains",
				"oneof": ["cards", "board"]
			}
		}
	}, {
		"label": "Dim: Width",
		"property": "width",
		"type": "number"
	}, {
		"label": "Dim: Length",
		"property": "length",
		"type": "number"
	}, {
		"label": "Is Radial?",
		"property": "radial",
		"type": "checkbox"

	// Entity Carried Items Used

	// Game Provided Items Used

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
