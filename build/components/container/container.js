
/**
 * 
 * 
 * @class rsContainer
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_containerComponentKey";
	
	rsSystem.component("rsContainer", {
		"inherit": true,
		"mixins": [
			rsSystem.components.StorageManager
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"entity": {
				"required": false,
				"type": Object
			},
			"user": {
				"required": false,
				"type": Object
			},
			"contents": {
				"required": true,
				"type": Object
			}
		},
		"mounted": function() {
			rsSystem.register(this);
		},
		"data": function() {
			var data = {};
			
			data.storageID = storageKey + this.contents.id; 
			data.store = this.loadStorage(data.storageID, {
				"closed": false
			});
			
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
				Vue.set(this.state, "closed", !this.state.closed);
			}
		},
		"render": function(createElement) {
			var elements = [],
				classes = {},
				contents,
				widget;
			
			if(this.contents.enabled && this.contents.declaration && rsSystem.components[this.contents.declaration]) {
				widget = {};
				widget.props = {};
				widget.props["universe"] = this.universe;
				widget.props["character"] = this.entity;
				widget.props["entity"] = this.entity;
				widget.props["storage-id"] = this.sid;
				widget.props["user"] = this.user;
				widget.props["sid"] = this.sid;
				elements.push(createElement(this.contents.declaration, widget));
			} else {
				elements.push(createElement("div"));
			}
			
			classes["rs-container"] = true;
			classes[this.getClasses()] = true;
			/*
			return createElement("div", {
				"class": classes
			}, elements);
			/* */
			contents = [createElement("div", {
				"class": classes
			}, elements)];
			
			return createElement("div", {
				"class": {
					"rs-widget": true
				}
			}, [contents]);
			/* */
		}
	});
})();
