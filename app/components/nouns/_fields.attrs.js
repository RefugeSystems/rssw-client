
(function() {
	
	var commonSource,
		dataSource;
	
	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Engagement Flags",
		"property": "__engagement",
		"type": "label"
	}, {
		"label": "Name",
		"property": "name",
		"type": "text"
	}, {
		"label": "Weapon",
		"property": "is_weapon",
		"type": "checkbox"
	}, {
		"label": "Ranged",
		"property": "is_ranged",
		"type": "checkbox",
		"condition": {
			"is_weapon": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Melee",
		"property": "is_melee",
		"type": "checkbox",
		"condition": {
			"is_weapon": {
				"operation": "exists"
			}
		}
	}, {
		"label": "Charges and Recharging",
		"property": "__charges",
		"type": "label"
	}, {
		"label": "Max Charges",
		"property": "charges_max",
		"type": "number"
	}, {
		"label": "Session Gain",
		"property": "charges_gain_session",
		"type": "number"
	}, {
		"label": "Session Rate",
		"property": "charges_rate_session",
		"type": "number"
	}, {
		"label": "Long Gain",
		"property": "charges_gain_long",
		"type": "number"
	}, {
		"label": "Long Rate",
		"property": "charges_rate_long",
		"type": "number"
	}, {
		"label": "Short Gain",
		"property": "charges_gain_short",
		"type": "number"
	}, {
		"label": "Short Rate",
		"property": "charges_rate_short",
		"type": "number"
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
			this.fields.modifierattrs.push({
				"label": "Skill Adjustments",
				"property": "__skilladjustments",
				"type": "label"
			});
			for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
				this.fields.modifierattrs.push({
					"label": this.universe.indexes.skill.listing[x].name + " (Σ)",
					"property": "adjusts_skill_" + this.universe.indexes.skill.listing[x].property,
					"type": "text"
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
