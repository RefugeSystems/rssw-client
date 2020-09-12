
(function() {
	
	var dataSource,
		itemtypes,
		accepts,
		attrs,
		stats,
		types,
		notes;
	
	accepts = {
		"label": "Accepts",
		"property": "accepts",
		"type": "select",
		"raw": true,
		"options": [
			"item",
			"room",
			"entity"
		]
	};
	
	itemtypes = {
		"label": "Item Types",
		"property": "itemtype",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"accepts": "item"
		}
	};
	
	types = {
		"label": "Accepted Types",
		"property": "type",
		"type": "multireference",
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
		"label": "Price",
		"property": "price",
		"type": "number"
	}, {
		"label": "Encumberance",
		"property": "encumberance",
		"type": "number"
	}, {
		"label": "Points",
		"property": "points",
		"type": "number"
	}, {
		"label": "Order",
		"property": "order",
		"type": "number"
	},
	accepts,
	itemtypes,
	types,
	attrs,
	stats,
	{
		"label": "Combat Slot",
		"property": "combat_slot",
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
	notes,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
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
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			itemtypes.source_index = this.universe.indexes.itemtype;
			notes.source_index = this.universe.indexes.note;
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
