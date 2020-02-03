
(function() {
	
	var classifications,
		dataSource,
		abilities,
		profiles,
		attrs,
		items,
		notes,
		skill,
		stats;
	
	classifications = {
		"label": "Classifications",
		"property": "classification",
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
		"label": "Damage",
		"property": "damage",
		"type": "text"
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
	}, {
		"label": "Contents Type",
		"property": "contents_type",
		"type": "text"
	}, {
		"label": "Rarity",
		"property": "rarity",
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
		"label": "Is Attachment",
		"property": "is_attachment",
		"type": "checkbox"
	}, {
		"label": "Template",
		"property": "template",
		"type": "checkbox"
	},
	classifications,
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

			classifications.source_index = this.universe.indexes.classification;
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			abilities.source_index = this.universe.indexes.ability;
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
