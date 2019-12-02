
(function() {
	
	var dataSource,
		location,
		images;
	
	location = {
		"label": "Resides In",
		"property": "location",
		"type": "select",
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
		"label": "Type",
		"property": "type",
		"type": "select",
		"raw": true,
		"options": [
			"station",
			"planet",
			"moon",
			"city",
			"marker"
		]
	}, {
		"label": "Link",
		"property": "linked",
		"type": "select",
		"raw": true,
		"options": [
			"map"
		]
	},
	location,
	images,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsLocation", {
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
			data.fields.location = dataSource;
			

			return data;
		},
		"mounted": function() {
			location.options = this.universe.indexes.location.listing;
			location.options.sortBy("name");
			images.options = this.universe.indexes.image.listing;
			images.options.sortBy("name");
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
