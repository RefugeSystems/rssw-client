
(function() {
	
	var dataSource,
		bases;
	
	
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
		"label": "Section",
		"property": "section",
		"type": "select",
		"raw": true,
		"options": [
			"general",
			"combat",
			"piloting",
			"knowledge",
			"custom"
		]
	},
	bases,
	{
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
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
