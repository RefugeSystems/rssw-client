
(function() {

	var dataSource,
		bases,
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

	bases = {
		"label": "Base",
		"property": "base",
		"type": "select",
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
	}, {
		"label": "Order",
		"property": "order",
		"type": "number"
	}, {
		"label": "Section",
		"property": "section",
		"type": "select",
		"raw": true,
		"options": [
			"combat",
			"custom",
			"general",
			"knowledge",
			"piloting",
			"subskill"
		]
	},
	bases,
	{
		"label": "No Rank",
		"property": "no_rank",
		"type": "checkbox"
	}, {
		"label": "Hidden",
		"property": "hidden",
		"type": "checkbox"
	}, {
		"label": "Obscured",
		"property": "obscured",
		"type": "checkbox"
	}, {
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];

	rsSystem.component("NounFieldsSkill", {
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
			data.fields.skill = dataSource;

			return data;
		},
		"mounted": function() {
			bases.options = this.characterStatsListing;
			bases.options.sort(sort);
		},
		"methods": {
			"update": function() {

			}
		},
		"beforeDestroy": function() {

		}
	});
})();
