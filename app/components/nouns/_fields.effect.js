
(function() {
	
	var alterationIndex,
		dataSource,
		attrs,
		stats,
		notes;
	
	alterationIndex = new SearchIndex([{
	        "name": "area",
	        "id": "area"
	    }, {
	        "name": "building",
	        "id": "building"
	    }, {
	        "name": "character",
	        "id": "character"
	    }, {
	        "name": "ship",
	        "id": "ship"
	    }, {
	        "name": "station",
	        "id": "station"
	    }]);
	
	attrs = {
		"label": "Attributes",
		"property": "modifierattrs",
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
	
	notes = {
		"label": "Notes",
		"property": "note",
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
	}, {
		"label": "Activation",
		"property": "activation",
		"type": "select",
		"raw": true,
		"options": [
			"automatic",
			"passive",
			"active"
		]
	}, {
		"label": "Hidden",
		"property": "hidden",
		"type": "checkbox"
	}, {
		"label": "Obscured",
		"property": "obscured",
		"type": "checkbox"
	}, {
		"label": "Alters",
		"property": "alters",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"source_index": alterationIndex,
		"noinfo": true
	},
	attrs,
	stats,
	{
		"label": "Indicators",
		"property": "indicators",
		"type": "textarea"
	}, {
		"label": "Description",
		"property": "description",
		"type": "textarea"
	},
	notes,
	{
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsEffect", {
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
			data.fields.effect = dataSource;
			return data;
		},
		"mounted": function() {
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			notes.source_index = this.universe.indexes.note;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
