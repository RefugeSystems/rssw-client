
(function() {

	var dataSource,
		dataPoints,
		names;

	names = {
		"label": "Name",
		"property": "name",
		"type": "select",
		"raw": true
	};

	dataPoints = {
		"label": "Datapoints",
		"property": "datapoint",
		"type": "multireference",
		"autocomplete": true,
		"optionValue": "id",
		"optionLabel": "property"
	};

	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	},
	names,
	dataPoints,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}];

	rsSystem.component("NounFieldsDatausage", {
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
			data.fields.datausage = dataSource;

			return data;
		},
		"mounted": function() {
			dataPoints.source_index = this.universe.indexes.datapoint;
			names.options = rsSystem.listingNouns;
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {

		}
	});
})();
