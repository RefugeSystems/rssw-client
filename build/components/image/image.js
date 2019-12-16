
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
			
			data.link = null;
			data.uri = null;
			
			return data;
		},
		"watch": {
			"image": {
				"deep": true,
				"handler": function() {
					console.warn("Re-Render Image: ", this.image);
					this.update();
				}
			},
			"linked": function() {
				console.warn("Re-Link Image: ", this.linked);
				this.update();
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"update": function() {
				Vue.set(this, "uri", this.image.data || this.image.url);
				if(this.linked) {
					this.link = "/" + this.linked.linked + "/" + this.linked.id;
				} else {
					this.link = false;
				}
				
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