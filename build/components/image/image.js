
/**
 * 
 * 
 * @class rsRenderImage
 * @constructor
 * @module Components
 */
(function() {
	
	
	rsSystem.component("rsRenderImage", {
		"inherit": true,
		"mixins": [
			
		],
		"props": {
			"image": {
				"required": true,
				"type": Object
			},
			"linked": {
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.uri = null;
			if(this.linked) {
				data.link = "/" + this.linked.linked + "/" + this.linked.id;
			} else {
				data.link = false;
			}
			
			return data;
		},
		"watch": {
			"image": {
				"deep": true,
				"handler": function() {
					console.warn("Re-Render Image: ", this.image);
					this.update();
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"update": function() {
				Vue.set(this, "uri", this.image.data || this.image.url);
				this.$forceUpdate();
			},
			"classes": function() {
				var classes = "";
				
				classes += "general";
				if(this.linked) {
					classes += " linked";
				}
				
				return classes;
			}
		},
		"template": Vue.templified("components/image.html")
	});
})();