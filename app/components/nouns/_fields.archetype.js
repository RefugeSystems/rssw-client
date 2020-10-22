
(function() {

	var dataSource,
		conditions,
		parent,
		attrs,
		stats,
		sort;

	sort = function(a, b) {
		if(a && a.name) {
			a = a.name;
		}
		if(b && b.name) {
			b = b.name;
		}
		a = a || "";
		b = b || "";
		if(a < b) {
			return -1;
		} else if(a > b) {
			return 1;
		} else {
			return 0;
		}
	};

	parent = {
		"label": "Parent",
		"property": "parent",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};

	attrs = {
		"label": "Attributes",
		"property": "modifierattrs",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	conditions = {
		"label": "Conditions",
		"property": "condition",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	stats = {
		"label": "Stats",
		"property": "modifierstats",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
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
	},{
		"label": "Renderer",
		"property": "information_renderer",
		"type": "text"
	}, {
		"label": "Order",
		"property": "order",
		"type": "number"
	},
	parent,
	{
		"label": "Classifications",
		"property": "classification",
		"type": "select",
		"raw": true,
		"options": [
			"primary",
			"secondary",
			"tertiary",
			"custom"
		]
	},{
		"label": "Playable",
		"property": "playable",
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
	conditions,
	attrs,
	stats,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];

	rsSystem.component("NounFieldsArchetype", {
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
			data.fields.archetype = dataSource;

			return data;
		},
		"mounted": function() {
			parent.options = this.universe.indexes.archetype.listing;
			// parent.options.sort(this.sortDate);

			conditions.source_index = this.universe.indexes.condition;
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {

		}
	});
})();
