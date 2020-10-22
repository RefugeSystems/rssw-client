
(function() {

	var dataSource,
		responses,
		parent;

	parent = {
		"label": "Parent",
		"property": "parent",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};

	responses = {
		"label": "Responses",
		"property": "response",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	},
	parent,
	{
		"label": "Name",
		"property": "name",
		"type": "text"
	}, {
		"label": "Icon",
		"property": "icon",
		"knowledge": "knowledge:system:icons",
		"type": "text"
	},{
		"label": "Label",
		"property": "label",
		"type": "text"
	}, {
		"label": "Renderer",
		"property": "information_renderer",
		"type": "text"
	},
	responses,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];

	rsSystem.component("NounFieldsAction", {
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
			data.fields.action = dataSource;

			return data;
		},
		"mounted": function() {
			parent.options = this.universe.indexes.action.listing;
			parent.options.sortBy("name");

			responses.source_index = RSAction.response;
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {

		}
	});
})();
