
(function() {
	
	var dataSource,
		location,
		entities,
		inside,
		notes;
	
	entities = {
		"label": "Members",
		"property": "entity",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	location = {
		"label": "Location",
		"property": "location",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	inside = {
		"label": "Inside",
		"property": "inside",
		"type": "select",
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
		"label": "Label",
		"property": "label",
		"type": "text"
	}, {
		"label": "Icon",
		"property": "icon",
		"knowledge": "knowledge:system:icons",
		"type": "text"
	}, {
		"label": "Description",
		"property": "description",
		"type": "textarea"
	},
	location,
	inside,
	{
		"label": "Order",
		"property": "order",
		"type": "select",
		"raw": true,
		"options": [
			20,
			19,
			18,
			17,
			16,
			15,
			14,
			13,
			12,
			11,
			10,
			9,
			8,
			7,
			6,
			5,
			4,
			3,
			2,
			1,
			0
		]
	}, {
		"label": "Hide Stats",
		"property": "hide_stats",
		"knowledge": "knowledge:system:hide:stats",
		"type": "checkbox"
	}, {
		"label": "Hide Relations",
		"property": "hide_relations",
		"knowledge": "knowledge:system:hide:relations",
		"type": "checkbox",
		"condition": {
			"hide_stats": {
				"operation": "test",
				"value": false
			}
		}
	}, {
		"label": "Hide Properties",
		"property": "hide_properties",
		"knowledge": "knowledge:system:hide:properties",
		"type": "checkbox",
		"condition": {
			"hide_stats": {
				"operation": "test",
				"value": false
			}
		}
	}, {
		"label": "Suppressed",
		"property": "suppressed",
		"knowledge": "knowledge:system:suppressed",
		"type": "checkbox"
	}, {
		"label": "Active",
		"property": "active",
		"type": "checkbox"
	}, {
		"label": "Hidden",
		"property": "hidden",
		"knowledge": "knowledge:system:hidden",
		"type": "checkbox"
	}, {
		"label": "Obscured",
		"property": "obscured",
		"knowledge": "knowledge:system:obscured",
		"type": "checkbox"
	},
	entities,
	{
		"label": "X Coordinate",
		"property": "x",
		"type": "number",
		"condition": {
			"location": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Y Coordinate",
		"property": "y",
		"type": "number",
		"condition": {
			"location": {
				"operation": "exists"
			}
		}
	},
	notes,
	{
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsParty", {
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
			data.fields.party = dataSource;
			
			return data;
		},
		"mounted": function() {
			var x;
			
			location.options = this.universe.indexes.location.listing;
			location.options.sortBy("name");
			inside.options = [];
			for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
				if(!this.universe.indexes.entity.listing[x].template) {
					inside.options.push(this.universe.indexes.entity.listing[x]);
				}
			}
			inside.options.sortBy("name");
			
			entities.source_index = this.universe.indexes.entity;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
