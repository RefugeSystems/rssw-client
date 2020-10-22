
(function() {

	var dataSource,
		provided,
		types;

	provided = {
		"label": "Provided Items",
		"property": "provided",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"autocomplete": true,
		"condition": {
			"medium": {
				"operation": "contains",
				"oneof": ["cards", "board"]
			}
		}
	};
	
	types = {
		"label": "Used Types",
		"property": "used_types",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"medium": {
				"operation": "contains",
				"oneof": ["cards", "board"]
			},
			"inventory_additions": {
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
	}, {
		"label": "Inner Unified",
		"property": "radial_unified",
		"type": "number",
		"condition": {
			"radial": {
				"operation": "exists"
			}
		}

	// Entity Carried Items Used

	// Game Provided Items Used

	},{
		"label": "Uses Inventory",
		"property": "inventory_additions",
		"type": "checkbox"
	},{
		"label": "Player Selected",
		"property": "inventory_additions_selected",
		"type": "checkbox"
	}, 
	provided,
	types,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Notes",
		"property": "master_note",
		"type": "textarea"
	}];

	rsSystem.component("NounFieldsMinigame", {
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
			data.fields.minigame = dataSource;

			return data;
		},
		"mounted": function() {
			provided.source_index = this.universe.indexes.item;
			types.source_index = this.universe.indexes.type;
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {

		}
	});
})();
