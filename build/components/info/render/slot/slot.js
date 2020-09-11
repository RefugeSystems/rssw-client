
/**
 * 
 * 
 * @class rsObjectInfoSlot
 * @constructor
 * @module Components
 */
(function() {
	
	rsSystem.component("rsObjectInfoSlot", {
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
			
			
			return data;
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
			}
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"update": function() {

				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			if(this.record && this.record.$off) {
				this.record.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/info/render/slot.html")
	}, "display");
})();