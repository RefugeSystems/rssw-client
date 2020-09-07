
(function() {
	
	var dataSource,
		shipAbilities,
		knowledges,
		archetypes,
		itemtypes,
		abilities,
		location,
		profiles,
		datasets,
		widgets,
		effects,
		entity,
		images,
		owners,
		parent,
		attrs,
		items,
		notes,
		pilot,
		races,
		rooms,
		slots,
		stats,
		sexes;
	
	datasets = {
		"label": "Name Dataset",
		"property": "randomize_name_dataset",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"randomize_name": {
				"operation": "exists"
			}
		}
	};
	
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
	
	parent = {
		"label": "Parent",
		"property": "parent", // Not "entity" as modifier inheritence is not wanted
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	shipAbilities = {
		"label": "Active Piloting Abilities",
		"property": "ship_active_abilities",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"classification": "ship"
		}
	};
	
	pilot = {
		"label": "Pilot",
		"property": "entity",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"classification": "ship"
		}
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
	
	sexes = {
		"label": "Sex",
		"property": "sex",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"classification": "character"
		}
	};
	
	archetypes = {
		"label": "Archetypes",
		"property": "archetype",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"classification": "character"
		}
	};
	
	effects = {
		"label": "Effects",
		"property": "effect",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	widgets = {
		"label": "Widgets",
		"property": "widget",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	rooms = {
		"label": "Rooms",
		"property": "room",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"classification": {
				"operation": "contains",
				"oneof": ["building", "ship", "station", "base"]
			}
		}
	};
	
	items = {
		"label": "Items",
		"property": "item",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	abilities = {
		"label": "Abilities",
		"property": "ability",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
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
	},
	parent,
	{
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
		"label": "Allegiance",
		"property": "allegiance",
		"knowledge": "knowledge:system:icons",
		"type": "text"
	}, {
		"label": "Age",
		"property": "age",
		"type": "number"
	}, {
		"label": "Height",
		"property": "height",
		"type": "number"
	}, {
		"label": "Mass",
		"property": "mass",
		"type": "text"
	}, {
		"label": "Experience",
		"property": "xp",
		"type": "number"
	}, {
		"label": "Credits",
		"property": "credits",
		"type": "number"
	}, {
		"label": "Cost",
		"property": "cost",
		"type": "number"
	}, {
		"label": "Silhouette",
		"property": "silhouette",
		"type": "select",
		"raw": true,
		"options": [
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			25,
			30,
			35,
			40,
			45,
			50,
			60,
			70,
			80,
			90,
			100
		]
	}, {
		"label": "Classification",
		"property": "classification",
		"type": "select",
		"raw": true,
		"options": [
			"base",
			"building",
			"character",
			"ship",
			"station"
		]
	}, {
		"label": "Pilot Skill",
		"property": "pilot_skill",
		"type": "number",
		"condition": {
			"classification": "character"
		}
	}, {
		"label": "Model",
		"property": "model",
		"type": "text",
		"condition": {
			"classification": {
				"operation": "contains",
				"oneof": ["station", "ship", "building", "base"]
			}
		}
	}, {
		"label": "Required Crew",
		"property": "required_crew",
		"type": "number",
		"condition": {
			"classification": {
				"operation": "contains",
				"oneof": ["station", "ship", "building", "base"]
			}
		}
	}, {
		"label": "Maximum Crew",
		"property": "maximum_crew",
		"type": "number",
		"condition": {
			"classification": {
				"operation": "contains",
				"oneof": ["station", "ship", "building", "base"]
			}
		}
	},
	shipAbilities,
	pilot,
	races,
	sexes,
	{
		"label": "Template",
		"property": "template",
		"type": "checkbox"
	}, {
		"label": "Name Prefix",
		"property": "randomize_name_prefix",
		"type": "text",
		"raw": true,
		"condition": {
			"template": true
		}
	}, {
		"label": "Name Suffix",
		"property": "randomize_name_suffix",
		"type": "text",
		"raw": true,
		"condition": {
			"template": true
		}
	},
	datasets,
	{
		"label": "Random Name",
		"property": "randomize_name",
		"type": "select",
		"raw": true,
		"condition": {
			"template": true
		},
		"options": [0,1,2,3,4,5,6]
	}, {
		"label": "Name Spacing",
		"property": "randomize_name_spacing",
		"type": "checkbox"
	}, {
		"label": "No Map Border",
		"property": "no_border",
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
	},
	entity,
	{
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
			"city",
			"mountainous",
			"enormouos",
			"planetary",
			"star_system",
			"galactic"
		]
	},
	profiles,
//	images,
	{
		"label": "Inactivated",
		"property": "inactive",
		"type": "checkbox"
	},
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
	effects,
	knowledges,
	archetypes,
	abilities,
	items,
	widgets,
	rooms,
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
			datasets.options = this.universe.indexes.dataset.listing;
			datasets.options.sortBy("name");
			profiles.options = this.universe.indexes.image.listing;
			profiles.options.sortBy("name");
			entity.options = this.universe.indexes.entity.listing;
			parent.options = entity.options;
			entity.options.sortBy("name");
			images.options = this.universe.indexes.image.listing;
			images.options.sortBy("name");
			pilot.options = this.universe.indexes.entity.listing;
			pilot.options.sortBy("name");
			races.options = this.universe.indexes.race.listing;
			races.options.sortBy("name");
			sexes.options = this.universe.indexes.sex.listing;
			sexes.options.sortBy("name");

			shipAbilities.source_index = this.universe.indexes.ability;
			knowledges.source_index = this.universe.indexes.knowledge;
			archetypes.source_index = this.universe.indexes.archetype;
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			itemtypes.source_index = this.universe.indexes.itemtype;
			abilities.source_index = this.universe.indexes.ability;
			effects.source_index = this.universe.indexes.effect;
			widgets.source_index = this.universe.indexes.widget;
			owners.source_index = this.universe.indexes.player;
			notes.source_index = this.universe.indexes.note;
			rooms.source_index = this.universe.indexes.room;
			slots.source_index = this.universe.indexes.slot;
			items.source_index = this.universe.indexes.item;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
