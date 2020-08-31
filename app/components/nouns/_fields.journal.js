
(function() {
	
	var dataSource,
		related,
		session,
		editor;
		
	editor = {
		"label": "Editor",
		"property": "editor",
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
	
	session = {
		"label": "Session",
		"property": "session",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Title",
		"property": "name",
		"type": "text"
	},
	session,
	editor,
	{
		"label": "Created",
		"property": "created",
		"type": "number"
	}, {
		"label": "Updated",
		"property": "updated",
		"type": "number"
	},
	related,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsJournal", {
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
			data.fields.journal = dataSource;

			return data;
		},
		"mounted": function() {
			editor.options = this.universe.indexes.entity.listing;
			editor.options.sortBy("name");
			session.options = this.universe.indexes.session.listing;
			session.options.sortBy("name");
			
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
