
(function() {
	
	var dataSource,
		abilities,
		profiles,
		skill,
		attrs,
		stats,
		notes;
	
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
		"label": "Encumberance",
		"property": "encumberance",
		"type": "number"
	}, {
		"label": "Rarity",
		"property": "rarity",
		"type": "number"
	}, 
	profiles,
	skill,
	abilities,
	attrs,
	stats,
	{
		"label": "Template",
		"property": "template",
		"type": "checkbox"
	},
	notes,
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
			
			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			abilities.source_index = this.universe.indexes.ability;
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
