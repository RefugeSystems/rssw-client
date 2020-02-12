
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
		"data": function() {
			var data = {};
			
			data.storageID = storageKey + this.contents.id; 
			data.state = this.loadStorage(data.storageID, {
				"closed": false
			});
			
			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function(value) {
					this.saveStorage(this.storageID, this.state);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
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
				if(this.$el) {
					if(this.state.closed) {
						this.$el.classList.remove("collapsed");
					} else {
						this.$el.classList.add("collapsed");
					}
					Vue.set(this.state, "closed", !this.state.closed);
				} else {
					console.error("Can't Find Container");
				}
			},
			"editSettings": function() {

			},
			"closeSettings": function() {
			
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
				widget.props["storage-id"] = this.storageID;
				widget.props["universe"] = this.universe;
				widget.props["character"] = this.entity;
				widget.props["entity"] = this.entity;
				widget.props["sid"] = this.storageID;
				widget.props["state"] = this.state;
				widget.props["user"] = this.user;
				widget.class = {};
				widget.class["rs-containment"] = true;
				elements.push(createElement(this.contents.declaration, widget));

				widget = {};
				widget.props = {};
				widget.props["settings"] = this.contents.settings;
				widget.props["universe"] = this.universe;
				widget.props["state"] = this.state;
				widget.on = {};
				widget.on.toggle = this.toggle;
				elements.push(createElement("rs-widget-control", widget));
			} else {
				elements.push(createElement("div"));
			}
			
			classes["rs-component rs-container"] = true;
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
					"rs-component rs-widget": true
				}
			}, [contents]);
			/* */
		}
	});
})();
