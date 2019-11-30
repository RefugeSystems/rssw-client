
/**
 * Handles rendering the record's information display.
 * 
 * This defaults to the rs-object-info-basic component if the record doesn't specify
 * a "information_renderer" property to point to a different component to handle
 * rending its information.
 * 
 * @class rsObjectInfo
 * @constructor
 * @module Components
 */
(function() {
	
	var invisibleKeys = {};
	invisibleKeys.id = true;
	invisibleKeys.name = true;
	invisibleKeys.universe = true;
	invisibleKeys.icon = true;
	invisibleKeys.modifierstats = true;
	invisibleKeys.modifierattrs = true;
	invisibleKeys.invisibleProperties = true;
	invisibleKeys.description = true;
	invisibleKeys.echo = true;
	
	rsSystem.component("rsObjectInfo", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSShowdown
		],
		"props": {
			"record": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.holdDescription = null;
			data.description = null;
			data.keys = [];
			data.id = null;
			
			return data;
		},
		"watch": {
			/*
			"record": {
				"deep": true,
				"handler": function() {
					console.warn("Record Shift: ", this.record);
					this.update();
				}
			}
			*/
		},
		"mounted": function() {
			/*
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value])) {
					console.log("2Follow: ", follow);
					rsSystem.EventBus.$emit("display-info", follow);
				}
			};

			if(this.record.$on) {
				this.record.$on("modified", this.update);
			} else {
				console.warn("Record is not listenable? ", this.record);
			}
			rsSystem.register(this);
			this.update();
			*/
		},
		"methods": {
			"visible": function(key) {
				return key && key[0] !== "_" && !invisibleKeys[key] && (!this.record.invisibleProperties || this.record.invisibleProperties.indexOf(key) === -1);
			},
			"update": function() {
				/*
//				console.log("Check: " + this.id + " | " + this.record.id);
				if(this.id && this.id !== this.record.id) {
//					console.log("Shifting");
					if(this.universe.index.index[this.id].$off) {
						this.universe.index.index[this.id].$off("modified", this.update);
					}
					if(this.record.$on) {
						this.record.$on("modified", this.update);
					} else {
						console.warn("Record is not listenable? ", this.record);
					}
					Vue.set(this, "id", this.record.id);
				} else {
//					console.log("Setting");
					Vue.set(this, "id", this.record.id);
				}

				if(this.record.description) {
					if(this.holdDescription !== this.record.description) {
						Vue.set(this, "holdDescription", this.record.description);
						Vue.set(this, "description", this.rsshowdown(this.holdDescription));
					}
				} else {
					Vue.set(this, "holdDescription", null);
					Vue.set(this, "description", null);
				}
				
				this.keys.splice(0);
				this.keys.push.apply(this.keys, Object.keys(this.record));
				
				this.$forceUpdate();
				*/
			}
		},
		"beforeDestroy": function() {
			this.record.$off("modified", this.update);
		},
		"render": function(createElement) {
			var elements = false,
				classes = {},
				contents,
				widget;
			
			elements = [createElement(this.record.information_renderer || "rs-object-info-basic", {
				"props": {
					"universe": this.universe,
					"record": this.record
				}
			})];
			
			if(!elements) {
				elements = [createElement("div")];
			}
			
			classes["object-info"] = true;
			if(this.record.information_classes) {
				classes[this.record.information_classes] = true;
			}
			
			return createElement("div", {
				"class": classes
			}, elements);
		}
	});
})();