
(function() {
	
	var dataSource,
		knowledges,
		itemtypes,
		location,
		profiles,
		entity,
		images,
		owners,
		attrs,
		notes,
		races,
		slots,
		stats;
	
	location = {
		"label": "Location",
		"property": "location",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	entity = {
		"label": "Inside",
		"property": "inside", // Not "entity" as modifier inheritence is not wanted
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	profiles = {
		"label": "Profile",
		"property": "profile",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	races = {
		"label": "Races",
		"property": "race",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"classification": "character"
		}
	};
	
	owners = {
		"label": "Owners",
		"property": "owners",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	slots = {
		"label": "Slots",
		"property": "slot",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	images = {
		"label": "Image",
		"property": "image",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};

	itemtypes = {
		"label": "Available Item Types",
		"property": "itemtype",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"is_shop": true
		}
	};
	
	knowledges = {
		"label": "Knowledge",
		"property": "knowledge",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	attrs = {
		"label": "Attribute Modifers",
		"property": "modifierattrs",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	stats = {
		"label": "Stat Modifers",
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
		"label": "Classification",
		"property": "classification",
		"type": "select",
		"raw": true,
		"options": [
			"building",
			"character",
			"ship",
			"station"
		]
	},
	races,
	{
		"label": "Link",
		"property": "linked",
		"type": "select",
		"raw": true,
		"options": [
			"map"
		]
	}, {
		"label": "Hidden",
		"property": "hidden",
		"type": "checkbox"
	}, {
		"label": "Obscured",
		"property": "obscured",
		"type": "checkbox"
	},
	slots,
	location,
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
	}, {
		"label": "Size",
		"property": "size",
		"type": "select",
		"raw": true,
		"options": [
			"tiny",
			"small",
			"medium",
			"large",
			"huge",
			"gigantic",
			"mountainous",
			"enormouos",
			"planetary",
			"galactic"
		]
	},
	entity,
	profiles,
	images,
	{
		"label": "Is Shop",
		"property": "is_shop",
		"type": "checkbox"
	},
	itemtypes,
	{
		"label": "Restock Base",
		"property": "restock_base",
		"type": "number",
		"condition": {
			"is_shop": true
		}
	}, {
		"label": "Restock Max",
		"property": "restock_max",
		"type": "number",
		"condition": {
			"is_shop": true
		}
	}, {
		"label": "Rarity Min",
		"property": "rarity_min",
		"type": "number",
		"condition": {
			"is_shop": true
		}
	}, {
		"label": "Rarity Max",
		"property": "rarity_max",
		"type": "number",
		"condition": {
			"is_shop": true
		}
	},
	attrs,
	stats,
	knowledges,
	owners,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	},
	notes,
	{
		"label": "Motivations",
		"property": "motivations",
		"type": "textarea"
	}, {
		"label": "Obligations",
		"property": "obligations",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsEntity", {
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
			data.fields.entity = dataSource;
			

			return data;
		},
		"mounted": function() {
			location.options = this.universe.indexes.location.listing;
			location.options.sortBy("name");
			profiles.options = this.universe.indexes.image.listing;
			profiles.options.sortBy("name");
			images.options = this.universe.indexes.image.listing;
			images.options.sortBy("name");
			entity.options = this.universe.indexes.entity.listing;
			entity.options.sortBy("name");
			races.options = this.universe.indexes.race.listing;
			races.options.sortBy("name");

			knowledges.source_index = this.universe.indexes.knowledge;
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			itemtypes.source_index = this.universe.indexes.itemtype;
			owners.source_index = this.universe.indexes.player;
			notes.source_index = this.universe.indexes.note;
			slots.source_index = this.universe.indexes.slot;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
