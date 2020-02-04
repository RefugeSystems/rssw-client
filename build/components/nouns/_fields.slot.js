
(function() {
	
	var dataSource,
		itemtypes,
		notes;
	
	itemtypes = {
		"label": "Item Types",
		"property": "itemtype",
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
		"label": "Price",
		"property": "price",
		"type": "number"
	}, {
		"label": "Encumberance",
		"property": "encumberance",
		"type": "number"
	},
	itemtypes,
	notes,
	{
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsSlot", {
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
			data.fields.slot = dataSource;
			
			return data;
		},
		"mounted": function() {
			itemtypes.source_index = this.universe.indexes.itemtype;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
