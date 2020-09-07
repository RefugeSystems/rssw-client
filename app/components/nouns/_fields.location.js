
(function() {
	
	var dataSource,
		knowledges,
		playlists,
		location,
		profiles,
		pathing,
		images,
		notes,
		types;
	
	pathing = {
		"label": "Pathing",
		"property": "pathing",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"condition": {
			"has_path": true,
			"pathed": {
				"operation": "exists"
			}
		}
	};
	
	location = {
		"label": "Resides In",
		"property": "location",
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
	
	images = {
		"label": "Image",
		"property": "image",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	knowledges = {
		"label": "Knowledge",
		"property": "knowledge",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};

	playlists = {
		"label": "Playlists",
		"property": "playlist",
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
//		"label": "Type",
//		"property": "type",
//		"type": "select",
//		"raw": true,
//		"options": [
//			"astroid",
//			"astroid-belt",
//			"astroid-field",
//			"building",
//			"city",
//			"marker",
//			"moon",
//			"phenomenon",
//			"planet",
//			"sector",
//			"star",
//			"star-system",
//			"station"
//		]
//	}, {
		"label": "Hidden",
		"property": "hidden",
		"type": "checkbox"
	}, {
		"label": "Obscured",
		"property": "obscured",
		"type": "checkbox"
	}, {
		"label": "Must Know",
		"property": "must_know",
		"type": "checkbox"
	}, {
		"label": "X Coordinate",
		"property": "x",
		"type": "number"
	}, {
		"label": "Y Coordinate",
		"property": "y",
		"type": "number"
	}, {
		"label": "Order",
		"property": "order",
		"type": "number"
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
			"city",
			"mountainous",
			"enormouos",
			"planetary",
			"star_system",
			"inter-planetary",
			"galactic"
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
	profiles,
	images,
	{
		"label": "No Map Border",
		"property": "no_border",
		"type": "checkbox"
	}, {
		"label": "Has Path?",
		"property": "has_path",
		"type": "checkbox"
	}, {
		"label": "Label Color",
		"property": "label_color",
		"type": "text",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Label Opacity",
		"property": "label_opacity",
		"type": "number",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Label Shadow",
		"property": "label_shadow",
		"type": "checkbox",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Label Shadow Color",
		"property": "label_shadow_color",
		"type": "text",
		"condition": {
			"label_shadow": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Shadow Blur",
		"property": "label_shadow_blur",
		"type": "number",
		"condition": {
			"label_shadow": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Color",
		"property": "color",
		"type": "text",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Opacity",
		"property": "opacity",
		"type": "number",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Thickness",
		"property": "thickness",
		"type": "number",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Pathed",
		"property": "pathed",
		"type": "checkbox",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Curved",
		"property": "curved",
		"type": "checkbox",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Contained",
		"property": "contained",
		"type": "checkbox",
		"condition": {
			"has_path": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Fill Color",
		"property": "fill_color",
		"type": "text",
		"condition": {
			"contained": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Fill Opacity",
		"property": "fill_opacity",
		"type": "number",
		"condition": {
			"contained": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Show Name",
		"property": "show_name",
		"type": "checkbox",
		"condition": {
			"contained": {
				"operation": "exists"
			},
			"render_name": {
				"operation": "!"
			}
		}
	}, {
		"label": "Render Name",
		"property": "render_name",
		"type": "checkbox",
		"condition": {
			"contained": {
				"operation": "exists"
			},
			"show_name": {
				"operation": "!"
			}
		}
	},
	pathing,
	{
		"label": "Path",
		"property": "path",
		"type": "textarea",
		"condition": {
			"has_path": true,
			"pathed": {
				"operation": "!"
			}
		}
	},
	types,
	playlists,
	knowledges,
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
			profiles.options = this.universe.indexes.image.listing;
			profiles.options.sortBy("name");
			images.options = this.universe.indexes.image.listing;
			images.options.sortBy("name");

			knowledges.source_index = this.universe.indexes.knowledge;
			playlists.source_index = this.universe.indexes.playlist;
			pathing.source_index = this.universe.indexes.location;
			types.source_index = this.universe.indexes.type;
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
