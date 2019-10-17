
/**
 * 
 * 
 * @class rsViewer
 * @constructor
 * @module Components
 */
rsSystem.component("rsViewer", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"props": {
		"location": {
			"required": true,
			"type": Object
		}
	},
	"data": function() {
		var data = {};

		data.image = {};
		data.sourceImage = null;
		data.parchment = null;
		data.element = null;
		data.ready = false;
		
		data.isDragging = false;
		data.dragX = null;
		data.dragY = null;
		
		data.pointsOfInterest = [];
		data.pins = true;
		data.alter = "";
		
		data.menuOpen = false;
		data.menuItems = [{
			"action": "back",
			"text": "Back",
			"icon": "fas fa-arrow-left"
		}, {
			"action": "reset",
			"text": "Reset",
			"icon": "far fa-refresh"
		}];
		

		data.actions = {};
		data.actions.open = false;
		data.actions.header = "Location";
		data.actions.options = [];
		data.actions.menu = null;
		
		return data;
	},
	"mounted": function() {
		Vue.set(this, "element", $(this.$el));
		rsSystem.register(this);
		this.location.$on("modified", this.update);
		this.update();
	},
	"methods": {
		"toggleMenu": function() {
			Vue.set(this, "menuOpen", !this.menuOpen);
		},
		"processAction": function(item) {
			console.log("Process Action: ", item);
		},
		"openActions": function(event) {
			console.log("Opening: " + event.offsetX + " x " + event.offsetY, event.x + " x " + event.y, event.pageX + " x " + event.pageY, event.layerX + " x " + event.layerY, event, event);
			Vue.set(this.actions, "x", event.offsetX);
			Vue.set(this.actions, "y", event.offsetY);
			Vue.set(this.actions, "open", true);
		},
		"closeActions": function() {
			Vue.set(this.actions, "open", false);
		},
		"fire": function(option, event) {
			console.log("Fire Option: ", option);
			event.actionMenu = true;
			if(this.player.master) {
				
			} else {
				
			}
			this.closeActions();
		},
		"dismissCoordinate": function(coordinate) {
			
		},
		"getViewport": function() {

		},
		"getDimensions": function(path) {
			console.log("Get Dimensions: " + path);
			var img = new Image;

			img.onload = () => {
				this.image.height = img.height;
				this.image.width = img.width;
				this.image.ratio = img.width / img.height;

				Vue.set(this, "ready", true);
				Vue.set(this, "parchment", this.element.find(".parchment"));
				this.apply(this.image);
			};

			img.src = path;
		},
		"clicking": function(event) {
//			console.log("click");

		},
		"down": function(event) {
//			console.log("down:" + event.button, event);
			switch(event.button) {
				case 0:
					this.isDragging = true;
					this.dragX = event.pageX;
					this.dragY = event.pageY;
					break;
			}
		},
		"up": function(event) {
//			console.log("up");
			this.isDragging = false;
		},
		"out": function(event) {
//			console.log("out");
			if(event.fromElement.attributes.onexit && event.fromElement.attributes.onexit.value === "true") {
				this.isDragging = false;
			}
		},
		"panning": function($event) {

		},
		"dragging": function(event) {
			if(this.isDragging) {
//				console.log("drag");
				var left = this.parchment.css("left") || "0px",
					top = this.parchment.css("top") || "0px",
					dX = this.dragX - event.pageX,
					dY = this.dragY - event.pageY;
				
				left = parseInt(left.replace("px", ""));
				left -= dX;
				
				top = parseInt(top.replace("px", ""));
				top -= dY;
				
				this.apply({
					"left": left,
					"top": top
				});

				this.dragX = event.pageX;
				this.dragY = event.pageY;
			}
		},
		"pan": function(x, y) {
			console.log("pan");
			
		},
		"wheeling": function(event) {
			console.log("wheel");
			
		},
		"apply": function(applying) {
//			console.log("apply: ", applying, this.parchment);
			if(this.parchment && this.parchment.length) {
				applying.height = applying.height || this.image.height || 0;
				applying.width = applying.width || this.image.width || 0;
				applying.left = applying.left || this.image.left || 0;
				applying.top = applying.top || this.image.left || 0;
				
				this.parchment.css({
					"height": applying.height + "px",
					"width": applying.width + "px",
					"left": applying.left + "px",
					"top": applying.top + "px"
			    });
				
				Object.assign(this.image, applying);
			}
		},
		"update": function() {
			var buffer,
				x;
			
			this.actions.options.splice(0);
			if(this.player.master) {
				this.actions.options.push({
					"icon": "fas fa-chevron-double-right",
					"event": "set-crosshair",
					"text": "Mark: Red",
					"color": "red"
				});
				this.actions.options.push({
					"icon": "fas fa-chevron-double-right",
					"event": "set-crosshair",
					"text": "Mark: Green",
					"color": "green"
				});
				this.actions.options.push({
					"icon": "fas fa-chevron-double-right",
					"event": "set-crosshair",
					"text": "Mark: Blue",
					"color": "blue"
				});
				this.actions.options.push({
					"icon": "fas fa-chevron-double-right",
					"event": "set-crosshair",
					"text": "Mark: Black",
					"color": "black"
				});
				this.actions.options.push({
					"icon": "fas fa-chevron-double-right",
					"event": "set-location",
					"text": "Set Location"
				});
				this.actions.options.push({
					"icon": "fas fa-map",
					"event": "set-map",
					"text": "Set Map"
				});
			}
			
			this.coordinates.splice(0);
			if(this.location.coordinates && this.location.coordinates.length) {
				this.coordinates.push.apply(this.coordinates, this.location.coordinates);
			}
			
			if(this.location.viewed !== this.sourceImage) {
				Vue.set(this, "ready", false);
				Vue.set(this, "sourceImage", this.location.viewed);
				this.getDimensions(this.location.viewed);
			}
			
			this.$forceUpdate();
		}
	},
	"beforeDestroy": function() {
		this.location.$off("modified", this.update);
	},
	"template": Vue.templified("components/viewer.html")
});
