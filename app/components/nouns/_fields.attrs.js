
(function() {
	
	var commonSource,
		dataSource;
	
	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Name",
		"property": "name",
		"type": "text"
	}, {
		"label": "Career Skill Flag",
		"property": "__enhanced",
		"type": "label"
	}];
	
	commonSource = [{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	}, {
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsModifierAttrs", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSSWStats
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {},
				x;
			
			data.fields = this.fields || {};
			data.fields.modifierattrs = [];
			data.fields.modifierattrs.push.apply(data.fields.modifierattrs, dataSource);
			/*
			for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
				data.fields.modifierattrs.push({
					"label": this.universe.indexes.skill.listing[x].name,
					"property": "skill_enhanced_" + this.universe.indexes.skill.listing[x].property,
					"type": "checkbox"
				});
			}
			
			data.fields.modifierattrs.push.apply(data.fields.modifierattrs, commonSource);
			*/
			
			return data;
		},
		"mounted": function() {
			var x;
			
			for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
				this.fields.modifierattrs.push({
					"label": this.universe.indexes.skill.listing[x].name,
					"property": "skill_enhanced_" + this.universe.indexes.skill.listing[x].property,
					"type": "checkbox"
				});
			}
			
			this.fields.modifierattrs.push.apply(this.fields.modifierattrs, commonSource);
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
