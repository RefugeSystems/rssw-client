
(function() {
	
	var dataSource,
		categories,
		mentioned,
		profiles,
		related,
		attrs,
		stats,
		notes;

	var categories = [
		"quest",
		"quest:task",
		"quest:main",
		"quest:seconary",
		
		"ideas",
		"ideas:force",
		"ideas:electronics",
		"ideas:skill",
		"ideas:ability",
		"ideas:job",
		
		"things",
		"things:army",
		"things:ship",
		"things:fleet",
		"things:item",
		"things:market",
		"things:temple",
		
		"peoples",
		"peoples:ancestry",
		"peoples:character",
		"peoples:clan",
		"peoples:creature",
		"peoples:culture",
		"peoples:language",
		"peoples:empire",
		"peoples:race",
		"peoples:ruler",
		
		"locations",
		"locations:starsystem",
		"locations:planet",
		"locations:city",
		"locations:continent",
		"locations:expedition",
		"locations:forest",
		"locations:mountain",
		"locations:temple",
		"locations:sector"
	].sort();

	profiles = {
		"label": "Profile",
		"property": "profile",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	related = {
		"label": "Related",
		"property": "related",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	mentioned = {
		"label": "Mentioned",
		"property": "mentioned",
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
		"label": "Category",
		"property": "category",
		"type": "select",
		"raw": true,
		"options": categories
	}, {
		"label": "State",
		"property": "state",
		"type": "select",
		"raw": true,
		"options": [
			"undiscovered",
			"pending",
			"active",
			"completed"
		]
	}, {
		"label": "Master Screen",
		"property": "screen",
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
	profiles,
	related,
	mentioned,
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
	
	rsSystem.component("NounFieldsKnowledge", {
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
			data.fields.knowledge = dataSource;
			

			return data;
		},
		"mounted": function() {
			profiles.options = this.universe.indexes.image.listing;
			profiles.options.sortBy("name");

			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			notes.source_index = this.universe.indexes.note;
			mentioned.source_index = this.universe.index;
			related.source_index = this.universe.index;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
