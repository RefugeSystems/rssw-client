
/**
 * 
 * 
 * @class rsWidgetControl
 * @constructor
 * @module Components
 */
rsSystem.component("rsWidgetControl", {
	"inherit": true,
	"props": {
		"universe": {
			"required": true,
			"type": Object
		},
		"settings": {
			"type": Object
		},
		"contents": {
			"type": Object
		},
		"state": {
			"required": false,
			"type": Object
		}
	},
	"mounted": function() {
		rsSystem.register(this);
	},
	"data": function() {
		var data = {};
		
		return data;
	},
	"methods": {
		"getClasses": function() {
			var classes = "";
			if(this.borderColor) {
				classes += " rs-border one rsbd-" + this.borderColor;
			}
			return classes.trim();
		},
		"toggle": function() {
			this.$emit("toggle");
		},
		"config": function() {
			this.$emit("config");
		}
	},
	"template": Vue.templified("components/widget.html")
});
