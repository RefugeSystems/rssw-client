
(function() {

	var dataSource,
		postSoruce,
		classes,
		parent,
		buffer,
		i;

	parent = {
		"label": "Parent",
		"property": "parent",
		"type": "select",
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
		"label": "Conditional Flag Checks",
		"property": "__checks",
		"type": "label"
	}, {
		"label": "Is Equipped",
		"property": "is_equipped",
		"type": "checkbox"
	}, {
		"label": "Is Charged",
		"property": "is_charged",
		"type": "checkbox"
	}, {
		"label": "Has Charges",
		"property": "has_charges",
		"type": "checkbox"
	}, {
		"label": "Reference Requirements",
		"property": "__refreq",
		"type": "label"
	}];

	postSoruce = [{
		"label": "Documentation",
		"property": "__docs",
		"type": "label"
	}, {
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];

	rsSystem.component("NounFieldsCondition", {
		"inherit": true,
		"props": {
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			if(!classes) {
				classes = {};
				for(i=0; i<rsSystem.listingNouns.length; i++) {
					buffer = {
						"label": rsSystem.listingNouns[i],
						"property": rsSystem.listingNouns[i],
						"type": "multireference",
						"autocomplete": true,
						"optionValue": "id",
						"optionLabel": "name"
					};
					classes[rsSystem.listingNouns[i]] = buffer;
					dataSource.push(buffer);
				}
				dataSource = dataSource.concat(postSoruce);
			}

			data.fields = this.fields || {};
			data.fields.condition = dataSource;

			return data;
		},
		"mounted": function() {
			for(i=0; i<rsSystem.listingNouns.length; i++) {
				classes[rsSystem.listingNouns[i]].source_index = this.universe.indexes[rsSystem.listingNouns[i]];
			}
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {

		}
	});
})();
