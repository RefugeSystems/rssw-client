
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
		"label": "Order",
		"property": "order",
		"type": "number"
	}, {
		"label": "Speed",
		"property": "speed",
		"type": "select",
		"raw": true,
		"options": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	}, {
		"label": "Energy Cost",
		"property": "energy",
		"type": "select",
		"raw": true,
		"options": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	}, {
		"label": "Stress",
		"property": "stress",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name",
		"options": [{
			"name": "Red",
			"id": "red"
		}, {
			"name": "White",
			"id": "white"
		}, {
			"name": "Green",
			"id": "green"
		}]
	}, {
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];

	rsSystem.component("NounFieldsManeuver", {
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
			data.fields.maneuver = dataSource;

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
