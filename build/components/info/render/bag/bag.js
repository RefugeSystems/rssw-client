
/**
 * 
 * 
 * @class rsObjectInfoBag
 * @constructor
 * @module Components
 */
(function() {
	
	rsSystem.component("rsObjectInfoBasic", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSShowdown
		],
		"props": {
			"record": {
				"required": true,
				"type": Object
			},
			"player": {
				"type": Object
			},
			"options": {
				"type": Object,
				"default": function() {
					return {};
				}
			}
		},
		"data": function() {
			var data = {};
			
			data.holdDescription = null;
			data.description = null;
			data.holdNote = null;
			data.note = null;
			data.profile = null;
			data.image = null;
			data.keys = [
				"encumberance",
				"content_type",
				"content_max",
				""
			];
			data.id = null;
			
			return data;
		},
		"watch": {
			"record": {
				"deep": true,
				"handler": function() {
//					console.warn("Record Shift: ", this.record);
					this.update();
				}
			}
		},
		"mounted": function() {
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value])) {
//					console.log("1Follow: ", follow);
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
		},
		"methods": {
			"update": function() {
//				console.log("Check: " + this.id + " | " + this.record.id);
				if(this.id && this.id !== this.record.id) {
//					console.log("Shifting");
					if(this.universe.index.index[this.id] && this.universe.index.index[this.id].$off) {
						this.universe.index.index[this.id].$off("modified", this.update);
					}
					if(this.record.$on) {
						this.record.$on("modified", this.update);
					}
					Vue.set(this, "id", this.record.id);
				} else {
//					console.log("Setting");
					Vue.set(this, "id", this.record.id);
				}
				
				if(this.record.description) {
					if(this.holdDescription !== this.record.description) {
						Vue.set(this, "holdDescription", this.record.description);
						Vue.set(this, "description", this.rsshowdown(this.record.description));
					}
				} else {
					Vue.set(this, "holdDescription", null);
					Vue.set(this, "description", null);
				}
				
				if(this.record.master_note) {
					if(this.holdNote !== this.record.master_note) {
						Vue.set(this, "holdNote", this.record.master_note);
						Vue.set(this, "note", this.rsshowdown(this.record.master_note));
					}
				} else {
					Vue.set(this, "holdNote", null);
					Vue.set(this, "note", null);
				}
				
				if(this.record.image && this.universe.nouns.image[this.record.image]) {
					Vue.set(this, "image", this.universe.nouns.image[this.record.image]);
				} else {
					Vue.set(this, "image", null);
				}
				
				if(this.record.profile && this.universe.nouns.image[this.record.profile]) {
					Vue.set(this, "profile", this.universe.nouns.image[this.record.profile]);
				} else {
					Vue.set(this, "profile", null);
				}
				
				this.keys.splice(0);
				this.keys.push.apply(this.keys, Object.keys(this.record));
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			if(this.record && this.record.$off) {
				this.record.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/info/render/bag.html")
	}, "display");
})();