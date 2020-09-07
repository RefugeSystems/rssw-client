
(function() {
	
	var dataSource,
		cancontain,
		abilities,
		itemtypes,
		profiles,
		entities,
		parent,
		attrs,
		items,
		notes,
		skill,
		slots,
		stats,
		types;
	
	itemtypes = {
		"label": "Item Types",
		"property": "itemtype",
		"type": "multireference",
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
	
	cancontain = {
		"label": "Limited To Holding These Types",
		"property": "cancontain",
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
	
	entities = {
		"label": "Attunee",
		"property": "attuned_to",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	slots = {
		"label": "Slot Usage",
		"property": "slot_usage",
		"type": "multireference",
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
	
	items = {
		"label": "Attachments",
		"property": "item",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	skill = {
		"label": "Skill",
		"property": "skill_check",
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
	
	types = {
		"label": "Types",
		"property": "type",
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
		"label": "Icon",
		"property": "icon",
		"knowledge": "knowledge:system:icons",
		"type": "text"
	}, {
		"label": "Price",
		"property": "price",
		"type": "number"
	}, {
		"label": "Cumbersome",
		"property": "Cumbersome",
		"type": "number"
	}, {
		"label": "Encumberance",
		"property": "encumberance",
		"type": "number"
	}, {
		"label": "Critical",
		"property": "critical",
		"type": "number"
	}, {
		"label": "Max Contents",
		"property": "contents_max",
		"type": "number"
//	}, {
//		"label": "Contents Type",
//		"property": "contents_type",
//		"type": "text"
	}, {
		"label": "Rarity",
		"property": "rarity",
		"type": "number"
	}, {
		"label": "Slots Used",
		"property": "slots_used",
		"type": "number"
	},
	profiles,
	skill,
	{
		"label": "Info Render",
		"property": "information_renderer",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name",
		"options": [{
			"name": "Basic",
			"id": undefined
		}, {
			"name": "Bag",
			"id": "rssw-bag-render"
		}]
	}, {
		"label": "Attunement",
		"property": "attunement",
		"type": "checkbox"
	}, {
		"label": "Untradable",
		"property": "untradable",
		"type": "checkbox"
	}, {
		"label": "Locked Attunement",
		"property": "locked_attunement",
		"type": "checkbox"
	}, {
		"label": "No Modifiers",
		"property": "no_modifiers",
		"type": "checkbox"
	}, {
		"label": "Add Encumberance",
		"property": "adds_encumberance",
		"type": "checkbox",
		"condition": {
			"no_modifiers": true
		}
	}, {
		"label": "Scaled Encumberance",
		"property": "scaled_encumberance",
		"type": "number",
		"condition": {
			"adds_encumberance": true,
			"no_modifiers": true,
			"contents_max": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Needs Slot",
		"property": "needs_slot",
		"type": "checkbox"
	}, {
		"label": "Ranged",
		"property": "is_ranged",
		"type": "checkbox"
	}, {
		"label": "Melee",
		"property": "is_melee",
		"type": "checkbox"
	}, {
		"label": "Template",
		"property": "template",
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
		"label": "Screen",
		"property": "screen",
		"type": "checkbox"
	},
	slots,
	cancontain,
	itemtypes,
	types,
	abilities,
	items,
	attrs,
	stats,
	{
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
	
	rsSystem.component("NounFieldsItem", {
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
			data.fields.item = dataSource;
			

			return data;
		},
		"mounted": function() {
			profiles.options = this.universe.indexes.image.listing;
			profiles.options.sortBy("name");
			skill.options = this.universe.indexes.skill.listing;
			skill.options.sortBy("name");
			entities.options = this.universe.indexes.entity.listing;
			entities.options.sortBy("name");
			parent.options = this.universe.indexes.item.listing;
			parent.options.sortBy("name");

			cancontain.source_index = this.universe.indexes.itemtype;
			itemtypes.source_index = this.universe.indexes.itemtype;
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			abilities.source_index = this.universe.indexes.ability;
			slots.source_index = this.universe.indexes.slot;
			items.source_index = this.universe.indexes.item;
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
