
/**
 * 
 * 
 * @class rsViewer
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_viewerComponentKey";

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

			data.storageKeyID = storageKey + this.location.id;
			data.state = this.loadStorage(data.storageKeyID, {
				"zoomStep": 1
			});
			
			if(!data.state.crosshairing) {
				data.state.crosshairing = {
					"icon": "fal fa-crosshairs",
					"event": "toggle-crosshair",
					"text": "Crosshairs On",
					"state": false
				};
			}

			data.state.viewed_at = data.state.viewed_at || 0;
			data.state.search = data.state.search || "";
			data.state.alter = data.state.alter || "";
			if(data.state.image) {
				data.image = data.state.image;
			} else {
				data.image = data.state.image = {};
			}
			if(data.state.markers === undefined) {
				data.state.markers = true;
			}
			if(data.state.follow === undefined) {
				data.state.follow = true;
			}
			if(data.state.master_view === undefined) {
				data.state.master_view = "";
			}
			
			data.original = {};
			data.sourceImage = null;
			data.parchment = null;
			data.element = null;
			data.ready = false;
			
			data.isDragging = false;
			data.dragX = null;
			data.dragY = null;

			data.pointsOfInterest = [];
			data.coordinates = [];
			data.pins = true;
			data.alter = "";
			
			data.menuOpen = false;
			data.menuItems = [{
				"action": "zoomin",
				"text": "Zoom",
				"icon": "fas fa-plus-square"
			}, {
				"action": "zoomout",
				"text": "Zoom",
				"icon": "fas fa-minus-square"
			}, {
				"action": "reset",
				"text": "Reset",
				"icon": "far fa-refresh"
			}];
			
			data.menuItems.followItem = {
				"action": "follow",
				"text": "Follow"
			};
			data.menuItems.markerItem = {
				"action": "markings",
				"text": "Markers"
			};
			data.menuItems.fullscreen = {
				"action": "fullscreen",
				"text": "Fill Page"
			};
			
			data.actions = {};
			data.actions.open = false;
			data.actions.header = "Location";
			data.actions.options = [];
			data.actions.menu = null;
			
			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					if(this.state.search !== this.state.search.toLowerCase()) {
						Vue.set(this.state, "search", this.state.search.toLowerCase());
					}
					this.saveStorage(this.storageKeyID, this.state);
				}
			},
			"location": {
				"handler": function(newValue, oldValue) {
					oldValue.$off("modified", this.update);
					newValue.$on("modified", this.update);
				}
			},
			"$route": {
				"deep": true,
				"handler": function() {
					this.update();
				}
			}
		},
		"mounted": function() {
			Vue.set(this, "element", $(this.$el));
			rsSystem.register(this);
			this.universe.$on("universe:modified", this.update);
			this.universe.$on("model:modified", this.update);
			this.location.$on("modified", this.update);
			this.update();
		},
		"methods": {
			"searchMap": function(search) {
				console.log("Search Map: ", search);
			},
			"toggleMenu": function() {
				Vue.set(this, "menuOpen", !this.menuOpen);
			},
			"processAction": function(item) {
//				console.log("Process Action: ", item);
				switch(item.action) {
					case "zoomin":
						this.image.zoom = this.image.zoom || 0;
						this.image.zoom += this.state.zoomStep;
						this.apply(this.image);
						break;
					case "zoomout":
						this.image.zoom = this.image.zoom || 0;
						this.image.zoom -= this.state.zoomStep;
						this.apply(this.image);
						break;
					case "markings":
						Vue.set(this.state, "markers", !this.state.markers);
						break;
					case "follow":
						Vue.set(this.state, "follow", !this.state.follow);
						break;
					case "reset":
						this.resetViewport();
						break;
					case "fullscreen":
						Vue.set(this.state, "fullscreen", !this.state.fullscreen);
						break;
				}
			},
			"openActions": function(event) {
//				console.log("Opening: " + event.offsetX + " x " + event.offsetY, event.x + " x " + event.y, event.pageX + " x " + event.pageY, event.layerX + " x " + event.layerY, event, event);
				Vue.set(this.actions, "x", event.offsetX);
				Vue.set(this.actions, "y", event.offsetY);
				Vue.set(this.actions, "open", true);
			},
			"closeActions": function() {
				Vue.set(this.actions, "open", false);
			},
			"fire": function(option, event) {
//				console.log("Fire Option: ", option);
				var buffer;
				
				switch(option.event) {
					case "set-crosshair":
						this.coordinates.push({
							"x": (this.actions.x/this.image.width*100),
							"y": (this.actions.y/this.image.height*100),
							"standalone": this.state.crosshairing.state,
							"color": option.color
						});
						this.location.commit({
							"coordinates": this.coordinates
						});
						break;
					case "toggle-crosshair":
						if(this.state.crosshairing.state) {
							Vue.set(this.state.crosshairing, "icon", "fal fa-crosshairs");
							Vue.set(this.state.crosshairing, "text", "Crosshairs On");
							Vue.set(this.state.crosshairing, "state", false);
						} else {
							Vue.set(this.state.crosshairing, "icon", "fal fa-slash");
							Vue.set(this.state.crosshairing, "text", "Crosshairs Off");
							Vue.set(this.state.crosshairing, "state", true);
						}
						break;
					case "set-map":
						this.location.commit({
							"shown_at": Date.now(),
							"showing": this.image
						});
						break;
					case "set-location":
						buffer = this.universe.index.index[this.state.alter];
						if(buffer && this.player.master) {
							buffer.commit({
								"location": this.location.id,
								"y": this.actions.y/this.image.height*100,
								"x": this.actions.x/this.image.width*100
							});
						}
						break;
					case "set-current":
						if(this.player.master) {
							this.universe.send("control", {
								"control": "page",
								"url": "/map/" + this.location.id,
								"condition": {
									"hash": "^#/map"
								}
							});
						}
						break;
				}
				
				this.closeActions();
			},
			"dismissCoordinate": function(coordinate) {
				var index = this.coordinates.indexOf(coordinate);
//				console.log("Dismiss[" + index + "]: ", coordinate, this.coordinates);
				if(index !== -1) {
					this.coordinates.splice(index, 1);
					this.location.commit({
						"coordinates": this.coordinates
					});
				}
			},
			"resetViewport": function() {
				Object.assign(this.image, this.original);
				var view = this.getViewport();
				
				this.image.zoom = 0;
				this.image.left = view.width/2 - this.image.width/2;
				this.image.top = view.height/2 - this.image.height/2;
				this.apply(this.image);
			},
			"getViewport": function() {
				return {
					"height": this.element.outerHeight(),
					"width": this.element.outerWidth()
				};
			},
			"getDimensions": function(path) {
//				console.log("Get Dimensions: " + path);
				var img = new Image;

				img.onload = () => {
					this.image.height = img.height;
					this.image.width = img.width;
					this.image.ratio = img.width / img.height;
					Object.assign(this.original, this.image);

					Vue.set(this, "ready", true);
					Vue.set(this, "parchment", this.element.find(".parchment"));
					this.apply(this.image);
				};

				img.src = path;
			},
			"clicking": function(event) {
//				console.log("click");

			},
			"down": function(event) {
//				console.log("down:" + event.button, event);
				switch(event.button) {
					case 0:
						this.isDragging = true;
						this.dragX = event.pageX;
						this.dragY = event.pageY;
						break;
				}
			},
			"up": function(event) {
//				console.log("up");
				this.isDragging = false;
			},
			"out": function(event) {
//				console.log("out");
				if(event.fromElement.attributes.onexit && event.fromElement.attributes.onexit.value === "true") {
					this.isDragging = false;
				}
			},
			"panning": function($event) {

			},
			"dragging": function(event) {
				if(this.isDragging) {
					var left = this.parchment.css("left") || "0px",
						top = this.parchment.css("top") || "0px",
						dX = this.dragX - event.pageX,
						dY = this.dragY - event.pageY;

					left = parseInt(left.replace("px", ""));
					top = parseInt(top.replace("px", ""));
					
					//console.log("drag: " + left + " x " + top + " - [" + this.dragX + ", " + this.dragY + "] d[" + dX + ", " + dY + "] @[" + event.pageX + ", " + event.pageY + "]");
										
					left -= dX;
					top -= dY;
					
					this.apply({
						"left": left,
						"top": top
					});

					this.dragX = event.pageX;
					this.dragY = event.pageY;
				}
			},
			"zoom": function(level) {
				if(10 > level && level > -10) {
					Vue.set(this.image, "zoom", level);
					this.apply(this.image);
				}
			},
			"pan": function(panned) {
				var left = this.parchment.css("left") || "0px",
					top = this.parchment.css("top") || "0px",
					dX,
					dY;

//				console.log("Panning[]: ", panned.velocityX, panned.velocityY);
				left = parseInt(left.replace("px", ""));
				top = parseInt(top.replace("px", ""));				

//				console.log("Panning: ", panned);
				if(this.isDragging) {
					dX = this.dragX - panned.deltaX;
					dY = this.dragY - panned.deltaY;
				} else {
					this.isDragging = true;
					dX = panned.deltaX;
					dY = panned.deltaY;
				}

//				console.warn("Pan[" + dX + ", " + dY + "]: " + left + ", " + top + " --> " + (left-dX) + ", " + (top-dY));
				left -= dX;
				top -= dY;

				if(panned.isFinal) {
					this.isDragging = false;
				} else {
					this.dragX = panned.deltaX;
					this.dragY = panned.deltaY;
				}
				
				this.apply({
					"left": left,
					"top": top
				});
			},
			"wheeling": function(event) {
				console.log("wheel");
				
			},
			"apply": function(applying) {
//				console.log("apply: ", applying, this.parchment);
				if(this.parchment && this.parchment.length) {
					if(applying.height === undefined) {
						applying.height = this.image.height;
					}
					if(applying.width === undefined) {
						applying.width = this.image.width;
					}
					if(applying.left === undefined) {
						applying.left = this.image.left;
					}
					if(applying.top === undefined) {
						applying.top = this.image.top;
					}
					
//					applying.height = applying.height || this.image.height || 0;
//					applying.width = applying.width || this.image.width || 0;
//					applying.left = applying.left || this.image.left || 0;
//					applying.top = applying.top || this.image.left || 0;

					if(10 > applying.zoom && applying.zoom > -10) {
						this.image.height = this.original.height * (1 + .1 * applying.zoom);
						this.image.width = this.original.width * (1 + .1 * applying.zoom);
					}
					
					this.parchment.css({
						"height": applying.height + "px",
						"width": applying.width + "px",
						"left": applying.left + "px",
						"top": applying.top + "px"
				    });
					
					Object.assign(this.image, applying);
					this.saveStorage(this.storageKeyID, this.state);
				}
			},
			"poiVisible": function(link) {
				if(link.template || link.x === undefined || link.y === undefined) {
					return false;
				}
				
				if(this.player.master && this.state.master_view === "master") {
					return true;
				}
				
				if(link.hidden || (link.obscured && !this.player.master)) {
					return false;
				}
				
				if(!link.required_knowledge) {
					return true;
				}
				
				var entity = this.universe.nouns.entity[this.player.entity];
				if(entity && (entity = this.universe.nouns.knowledge[entity.knowledge])) {
					return !!entity[link.knowledge];
				}
				
				return false;
			},
			"renderState": function() {
				var state = "";
				if(this.state.fullscreen) {
					state += " fullscreen";
				}
				return state;
			},
			"poiClass": function(link) {
				return link.class || link.icon;
			},
			"poiMenu": function(link) {
				rsSystem.EventBus.$emit("display-info", link);
			},
			"minorUpdate": function() {
				this.$forceUpdate();
			},
			"update": function() {
//				console.warn("Update");
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
						"text": "Mark: White",
						"color": "white"
					});
					
					this.actions.options.push(this.state.crosshairing);
					
					this.actions.options.push({
						"icon": "fas fa-chevron-double-right",
						"event": "set-location",
						"text": "Set Location"
					});
					this.actions.options.push({
						"icon": "fas fa-map",
						"event": "set-map",
						"text": "Set Location View"
					});
					this.actions.options.push({
						"icon": "fas fa-map-marked",
						"event": "set-current",
						"text": "Show Map"
					});
				}
				
				this.coordinates.splice(0);
				if(this.location.coordinates && this.location.coordinates.length) {
					this.coordinates.push.apply(this.coordinates, this.location.coordinates);
				}
				
				while(this.pointsOfInterest.length !== 0) {
					buffer = this.pointsOfInterest.pop();
					if(buffer.$off) {
						buffer.$off("modified", this.minorUpdate);
					}
				}
				for(x=0; x<this.universe.indexes.location.listing.length; x++) {
					buffer = this.universe.indexes.location.listing[x];
					if(buffer.location === this.location.id) {
						this.pointsOfInterest.push(buffer);
						buffer.$on("modified", this.minorUpdate);
					}
				}
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					buffer = this.universe.indexes.entity.listing[x];
					if(buffer.location === this.location.id) {
						this.pointsOfInterest.push(buffer);
						buffer.$on("modified", this.minorUpdate);
					}
				}
				for(x=0; x<this.universe.indexes.party.listing.length; x++) {
					buffer = this.universe.indexes.party.listing[x];
					if(buffer.location === this.location.id) {
						this.pointsOfInterest.push(buffer);
						buffer.$on("modified", this.minorUpdate);
					}
				}
				
				if(this.location.image && this.universe.nouns.image[this.location.image]) {
					Vue.set(this, "ready", false);
					Vue.set(this, "sourceImage", this.universe.nouns.image[this.location.image].data);
					this.getDimensions(this.universe.nouns.image[this.location.image].data);
				} else if(this.location.viewed !== this.sourceImage) {
					Vue.set(this, "ready", false);
					Vue.set(this, "sourceImage", this.location.viewed);
					this.getDimensions(this.location.viewed);
				}
				
				if(this.state.follow && this.location.showing && this.location.shown_at && this.state.viewed_at < this.location.shown_at) {
//					console.log("View State Sync: ", this.location, this.state);
					Vue.set(this.state, "viewed_at", this.location.shown_at);
					Object.assign(this.image, this.location.showing);
					this.apply(this.image);
				}
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
			this.universe.$off("model:modified", this.update);
			this.location.$off("modified", this.update);
		},
		"template": Vue.templified("components/viewer.html")
	});
})();