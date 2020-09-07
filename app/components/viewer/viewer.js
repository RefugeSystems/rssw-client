
/**
 * 
 * 
 * @class rsViewer
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_viewerComponentKey";

	var generateLocationClassingMap = {
		"star-system": "far fa-solar-system rotX60",
		"planet": "fad fa-globe-europe",
		"station": "ra ra-satellite",
		"moon": "fas fa-moon",
		"city": "fas fa-city",
		"marker": "fas fa-map-marker"
	};
	
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
			
			data.generateLocationClassingMap = generateLocationClassingMap;
			if(!data.state.crosshairing) {
				data.state.crosshairing = {
					"icon": "fal fa-crosshairs",
					"event": "toggle-crosshair",
					"text": "Crosshairs On",
					"state": false
				};
			}

			data.viewingEntity = null;
			data.state.generate_location = data.state.generate_location || "";
			data.state.viewed_at = data.state.viewed_at || 0;
			data.state.search = data.state.search || "";
			data.state.alter = data.state.alter || "";
			if(data.state.labels === undefined) {
				data.state.labels = true;
			}
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
			if(data.state.hidden_legend === undefined) {
				data.state.hidden_legend = {};
			}
			if(data.state.path_fill === undefined) {
				data.state.path_fill = "";
			}
			
			if(data.state.search) {
				data.search_criteria = data.state.search.toLowerCase().split(" ");
			} else {
				data.search_criteria = [];
			}

			data.baseFontSize = 13;
			data.scaledSize = 0;
			
			data.searchPrevious = data.state.search;
			data.searchError = "";
			data.original = {};
			data.sourceImage = null;
			data.parchment = null;
			data.element = null;
			data.ready = false;
			
			data.isDragging = false;
			data.dragX = null;
			data.dragY = null;
			
			data.availableCanvases = {};
			data.availableLocales = {};
			data.pointsOfInterest = [];
			data.coordinates = [];
			data.locales = [];
			data.pins = true;
			data.alter = "";
			
			data.legendDisplayed = true;
			data.legendOpen = false;
			data.legendHidden = {};
			data.isMaster = null;
			
			data.localeInfo = {
				"event": "info-key",
				"icon": "fas fa-info-circle",
				"shown": false
			};
			
			data.menuOpen = false;
			data.menuItems = [[{
				"action": "zoomin",
				"text": "Zoom",
				"icon": "fas fa-plus-square"
			}, {
				"action": "zoomout",
				"text": "Zoom",
				"icon": "fas fa-minus-square"
			}], {
				"action": "up",
				"text": "Up",
				"conditional": () => {
					return !!this.location.location;
				},
				"icon": "far fa-arrow-alt-square-up"
			}, {
				"action": "reset",
				"text": "Reset",
				"icon": "far fa-expand-wide"
			}];
			
			data.menuItems.generateLocation = {
				"event": "generate-location"
			};
			data.menuItems.labelItem = {
				"action": "labels",
				"text": "Labels"
			};
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

			data.addPointOption = {
				"icon": "fas fa-code-commit",
				"event": "add-point",
				"text": "Add Point"
			};

			data.setNamePointOption = {
				"icon": "fal fa-code-commit",
				"event": "set-name-point",
				"text": "Set Name Point"
			};
			
			data.canvas = null;
			
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
			this.canvasElement = $("canvas.map-paths");
			Vue.set(this, "element", $(this.$el));

			if(this.state.master_view !== "master") {
				if(this.state.master_view) {
					Vue.set(this, "viewingEntity", this.universe.indexes.entity.index[this.state.master_view]);
				}
				if(!this.viewingEntity) {
					Vue.set(this, "viewingEntity", this.universe.indexes.entity.index[this.player.entity]);
				}
			}
			
			rsSystem.register(this);
			rsSystem.EventBus.$on("copied-id", this.setMenuID);
			this.universe.$on("universe:modified", this.update);
			this.universe.$on("model:modified", this.update);
			this.location.$on("modified", this.update);
			this.update();
		},
		"methods": {
			"setMenuID": function(id) {
				Vue.set(this.state, "alter", id);
			},
			"searchMap": function() {
				console.log("Search Map: ", this.search_criteria);
				var set = false,
					buffer,
					x;
				
				for(x=0; !set && x<this.pointsOfInterest.length; x++) {
					buffer = this.pointsOfInterest[x];
					console.log("Preview: " + this.testSearchCriteria(buffer._search, this.search_criteria));
					if(buffer.x && buffer.y && this.testSearchCriteria(buffer._search, this.search_criteria)) {
						console.log("Center");
						this.centerView(buffer);
						set = true;
					}
				}
				
				if(!set) {
					Vue.set(this, "searchError", "Not Found");
				} else {
					Vue.set(this, "searchError", "");
				}
			},
			"centerView": function(location) {
				var locX,
					locY,
					view,
					x;
				
				if(location) {
					locY = location.y/100 * this.image.height;
					locX = location.x/100 * this.image.width;
					view = this.getViewport();
					locY -= view.height/2;
					locX -= view.width/2;
					this.apply({
						"left": -1* locX,
						"top": -1* locY
					});
				}
			},
			"getGeneratedClass": function() {
				return generateLocationClassingMap[this.state.generate_location];
			},
			"idFromName": function(name) {
				return "location:" + this.state.generate_location + ":" + name.toLowerCase().replace(/[ \._-]+/g, "");
			},
			"generateLocationNoun": function(x, y) {
				var noun = {};
				noun._type = "location";
				noun.name = this.state.generate_location_name;
				noun.label = this.state.generate_location_name;
				noun.id = this.idFromName(noun.name);
				noun.icon = this.getGeneratedClass();
				noun.location = this.location.id;
				noun.type = [this.state.generate_location];
				noun.x = x;
				noun.y = y;
				noun.master_note = "Generated @" + (new Date()).toString();
				if(!this.universe.indexes.location.index[noun.id]) {
					this.universe.send("modify:location", noun);
				} else {
					console.warn("Noun Already Exists: " + noun.id);
				}
			},
			"clearSearch": function() {
				Vue.set(this.state, "search", "");
				Vue.set(this, "searchError", "");
				this.search_criteria.splice(0);
			},
			"togglePOIFiltering": function() {
				Vue.set(this.state, "poiFiltering", !this.state.poiFiltering);
			},
			"filterPOIs": function(text) {
//				console.log("Filter: " + text);
				var buffer;
				
				if(text !== this.searchPrevious) {
					Vue.set(this, "searchPrevious", text);
					this.search_criteria.splice(0);
					if(text) {
						text = text.toLowerCase().split(" ");
	
						if(this.searchError) {
							Vue.set(this, "searchError", "");
						}
						while(text.length) {
							buffer = text.pop().trim();
							if(buffer) {
								this.search_criteria.push(buffer);
							}
						}
					}
				}
			},
			"testSearchCriteria": function(string, criteria) {
				var x;
				
				if(criteria && criteria.length) {
					if(!string) {
						return false;
					}
					for(x=0; x<criteria.length; x++) {
						if(string.indexOf(criteria[x]) === -1) {
							return false;
						}
					}
				}

//				console.log("Match");
				return true;
			},
			"toggleLegend": function() {
				Vue.set(this, "legendOpen", !this.legendOpen);
			},
			"toggleMenu": function() {
				Vue.set(this, "menuOpen", !this.menuOpen);
			},
			"toggleLocale": function(locale) {
				Vue.set(this.state.hidden_legend, locale.id, !this.state.hidden_legend[locale.id]);
				this.redrawPaths();
			},
			"processAction": function(item) {
//				console.log("Process Action: ", item);
				switch(item.action) {
					case "zoomin":
						/*
						this.image.zoom = this.image.zoom || 0;
						this.image.zoom += this.state.zoomStep;
						this.apply(this.image);
						*/
						this.zoomInOne();
						break;
					case "zoomout":
						/*
						this.image.zoom = this.image.zoom || 0;
						this.image.zoom -= this.state.zoomStep;
						this.apply(this.image);
						*/
						this.zoomOutOne();
						break;
					case "markings":
						Vue.set(this.state, "markers", !this.state.markers);
						break;
					case "labels":
						Vue.set(this.state, "labels", !this.state.labels);
						break;
					case "follow":
						Vue.set(this.state, "follow", !this.state.follow);
						break;
					case "reset":
						this.resetViewport();
						break;
					case "up":
						if(this.location.location) {
							this.$router.push("/map/" + this.location.location);
						}
						break;
					case "fullscreen":
						Vue.set(this.state, "fullscreen", !this.state.fullscreen);
						break;
				}
				this.redrawPaths();
			},
			"openActions": function(event) {
				console.log("Opening: " + event.offsetX + " x " + event.offsetY, event.x + " x " + event.y, event.pageX + " x " + event.pageY, event.layerX + " x " + event.layerY, event);

				var xc = event.offsetX,
					yc = event.offsetY,
					buffer,
					locale,
					x;
				
				if(event.ctrlKey) {
					this.appendPath(xc/this.image.width*100, yc/this.image.height*100);
				} else if(event.shiftKey) {
					this.setNamePoint(xc/this.image.width*100, yc/this.image.height*100);
				} else {
					this.localeInfo.id = undefined;
					for(x=0; x<this.locales.length; x++) {
						locale = this.locales[x];
						if(locale.contained) {
							buffer = this.availableLocales[locale.id];
//							if(buffer) {
//								console.log("Point Check[" + locale.id + " - " + xc + ", " + yc + " @ " + buffer.isPointInPath(xc, yc) + "]: ", buffer);
//							}
							if(buffer && buffer.isPointInPath(xc, yc)) {
								Vue.set(this.actions, "header", locale.name);
								this.localeInfo.location = locale;
								this.localeInfo.text = locale.name;
								this.localeInfo.id = locale.id;
							}
						}
					}
//					console.log("Test: ", this.localeInfo.id);
					if(this.localeInfo.id && !this.localeInfo.shown) {
						this.actions.options.unshift(this.localeInfo);
						this.localeInfo.shown = true;
					} else if(!this.localeInfo.id && this.localeInfo.shown) {
						Vue.set(this.actions, "header", "Location");
						this.actions.options.shift();
						this.localeInfo.shown = false;
					}
					
					Vue.set(this.actions, "x", event.offsetX);
					Vue.set(this.actions, "y", event.offsetY);
					Vue.set(this.actions, "open", true);
				}
			},
			"closeActions": function() {
				Vue.set(this.actions, "open", false);
			},
			"getActionMenuStyle": function() {
				return "left: " + this.actions.x + "px; top: " + this.actions.y + "px;";
			},
			"fire": function(option, event) {
//				console.log("Fire Option: ", option);
				var buffer,
					path;
				
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
							Vue.set(this.state.crosshairing, "icon", "fal fa-location-slash");
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
					case "add-point":
						this.appendPath(this.actions.x/this.image.width*100, this.actions.y/this.image.height*100);
						break;
					case "set-name-point":
						this.setNamePoint(this.actions.x/this.image.width*100, this.actions.y/this.image.height*100);
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
					case "generate-location":
						if(this.player.master) {
							this.generateLocationNoun(this.actions.x/this.image.width*100, this.actions.y/this.image.height*100);
						}
						break;
					case "info-key":
//						console.log("Show Info: ", option);
						this.showInfo(option.location);
						break;
				}
				
				this.redrawPaths();
				this.closeActions();
			},
			"appendPath": function(x, y) {
				var buffer;
				if(this.state.path_fill) {
					buffer = this.universe.indexes.location.index[this.state.path_fill];
					if(buffer && this.player.master) {
						console.log("Update Path[" + buffer.id + "]: ", buffer);
						buffer.appendPath(x, y);
					}
				}
			},
			"setNamePoint": function(x, y) {
				var buffer;
				if(this.state.path_fill) {
					buffer = this.universe.indexes.location.index[this.state.path_fill];
					if(buffer && this.player.master) {
						buffer.commit({
							"x": x,
							"y": y
						});
					}
				}
			},
			"dismissCoordinate": function(coordinate) {
				if(this.player.master) {
					var index = this.coordinates.indexOf(coordinate);
					if(index !== -1) {
						this.coordinates.splice(index, 1);
						this.location.commit({
							"coordinates": this.coordinates
						});
					}
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
			"getCenter": function() {
				var view = this.getViewport(),
					vh = view.height/2,
					vw = view.width/2,
					left,
					top,
					x;
				
				left = this.image.left - vw;
				top = this.image.top - vh;
				
				return {
					"x": -1* ((left/this.image.width) * 100).toFixed(3),
					"y": -1* ((top/this.image.height) * 100).toFixed(3),
					"left": left,
					"top": top
				};
			},
			"zoom": function(level) {
				if(10 > level && level > -10) {
					var targetHeight = this.original.height * (1 + .1 * level),
						targetWidth = this.original.width * (1 + .1 * level),
						view = this.getViewport(),
						vh = view.height/2,
						vw = view.width/2,
						cenX,
						cenY;

					cenY = (this.image.top - vh) / this.image.height;
					cenX = (this.image.left - vw) / this.image.width;
					cenY *= targetHeight;
					cenX *= targetWidth;
					cenY += vh;
					cenX += vw;
					
					this.apply({
						"height": targetHeight,
						"width": targetWidth,
						"zoom": level,
						"left": cenX,
						"top": cenY
					});
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
//				console.log("wheel", event);
				if(event.deltaY < 0) {
					this.zoomInOne();
				} else if(event.deltaY > 0) {
					this.zoomOutOne();
				}
			},
			"zoomOutOne": function() {
//				console.log("Zoom -1");
				this.zoom(this.image.zoom - 1);
			},
			"zoomInOne": function() {
//				console.log("Zoom +1");
				this.zoom(this.image.zoom + 1);
			},
			"apply": function(applying) {
//				console.log("apply: ", applying, this.parchment);
//				console.log("apply");
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
						Vue.set(this, "scaledSize", this.baseFontSize + applying.zoom);
					}
					
					if(this.locales && this.locales.length && (this.image._lastzoom !== applying.zoom || this.image._lastlocation !== this.location.id)) {
//						console.log("Apply Redraw: ", JSON.stringify(this.image, null, 4), JSON.stringify(applying, null, 4));
//						console.log("Apply Redraw");
						this.image._lastlocation = this.location.id;
						this.image._lastzoom = applying.zoom;
						for(var x=0; x<this.locales.length; x++) {
							if(this.availableCanvases[this.locales[x].id]) {
								this.availableCanvases[this.locales[x].id].height = applying.height;
								this.availableCanvases[this.locales[x].id].width = applying.width;
							}
						}
						this.redrawPaths();
					} else {
						if(this.image._lastlocation !== this.location.id) {
							this.image._lastlocation = this.location.id;
						}
						if(this.image._lastzoom !== applying.zoom) {
							this.image._lastzoom = applying.zoom;
						}
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
			"redrawPaths": function() {
				var buffer,
					path,
					x;
				
				
				// Paint Grid
//				if(this.options && this.options.paintGrid) {
//					this.paintGrid();
//				}

//				console.log("Redraw");
				
				for(x=0; x<this.locales.length; x++) {
					path = this.locales[x];
					if(path.location === this.location.id && path.has_path) {
						if(!this.availableLocales[path.id] || !this.availableLocales[path.id].parentNode) {
							buffer = $("[data-id='locale:" + path.id + "']");
							if(buffer.length) {
								this.availableLocales[path.id] = buffer[0].getContext("2d");
								this.availableCanvases[path.id] = buffer[0];

								this.availableCanvases[path.id].height = this.image.height;
								this.availableCanvases[path.id].width = this.image.width;
							}
						}

						if(this.availableLocales[path.id]) {
							this.availableLocales[path.id].clearRect(0, 0, this.availableCanvases[path.id].width, this.availableCanvases[path.id].height);
							this.drawPath(this.availableLocales[path.id], path);
						}
					}
				}
			},
			"drawPath": function(canvas, path) {
				if(path && path.has_path && !this.state.hidden_legend[path.id]) {
					var points = [],
						buffer,
						point,
						x;
					
					if(path.pathed) {
						for(x=0; x<path.pathing.length; x++) {
							buffer = this.universe.indexes.location.index[path.pathing[x]];
							if(buffer && buffer.location === this.location.id) {
								point = [buffer.x/100 * this.image.width, buffer.y/100 * this.image.height];
								points.push(point);
							}
						}
					} else if(path.values && path.values.length) {
						for(x=0; x<path.values.length; x++) {
							point = [path.values[x][0] * this.image.width, path.values[x][1] * this.image.height];
							points.push(point);
						}
					}
					
					if(points.length) {
						this.renderPath(canvas, path, points);
						return canvas;
					}
				}
				
				return null;
			},
			"renderPath": function(canvas, path, points) {
//				console.log("Render Path[" + path.id + "]: ", points, path);
				var xc,
					yc,
					x;
				
				canvas.locationID = path.id;
				canvas.strokeStyle = path.color || "#FFFFFF";
				canvas.lineWidth = path.thickness;
				if(path.opacity !== undefined) {
					canvas.globalAlpha = path.opacity;
				}
				canvas.beginPath();
				canvas.moveTo(points[0][0], points[0][1]);
				for(x=1; x<points.length; x++) {
					if(path.curved) {
						//canvas.bezierCurveTo(path.values[x][0] * this.image.width, path.values[x][1] * this.image.height);
						xc = (points[x-1][0] + points[x][0]) / 2;
						yc = (points[x-1][1] + points[x][1]) / 2;
						canvas.quadraticCurveTo(xc, yc, points[x][0], points[x][1]);
//						canvas.quadraticCurveTo(
//							path.values[x-1][0] * this.image.width,
//							path.values[x-1][1] * this.image.height,
//							path.values[x][0] * this.image.width,
//							path.values[x][1] * this.image.height);
					} else {
						canvas.lineTo(points[x][0], points[x][1]);
					}
				}
				if(path.contained) {
					canvas.closePath();
					canvas.stroke();
					canvas.fillStyle = path.fill_color || path.color || "#FFFFFF";
					if(path.fill_opacity !== undefined) {
						canvas.globalAlpha = path.fill_opacity;
					}
					canvas.beginPath();
					canvas.moveTo(points[0][0], points[0][1]);
					for(x=1; x<points.length; x++) {
						if(path.curved) {
							//canvas.bezierCurveTo(path.values[x][0] * this.image.width, path.values[x][1] * this.image.height);
							xc = (points[x-1][0] + points[x][0]) / 2;
							yc = (points[x-1][1] + points[x][1]) / 2;
							canvas.quadraticCurveTo(xc, yc, points[x][0], points[x][1]);
//							canvas.quadraticCurveTo(
//								path.values[x-1][0] * this.image.width,
//								path.values[x-1][1] * this.image.height,
//								path.values[x][0] * this.image.width,
//								path.values[x][1] * this.image.height);
						} else {
							canvas.lineTo(points[x][0], points[x][1]);
						}
					}
					canvas.closePath();
					canvas.fill();
					
					if(this.state.labels && path.render_name && path._x !== undefined && path._y !== undefined) {
						canvas.fillStyle = path.label_color || path.color || "#FFFFFF";
						canvas.font = "bold " + (12 + this.state.image.zoom) + "px Arial";
						canvas.shadowColor = path.label_shadow_color || "rgba(0, 0, 0, .4)";
						canvas.shadowBlur = path.label_shadow_blur || 3;
						canvas.globalAlpha = path.label_opacity || 1;
						canvas.shadowOffsetX = 0;
						canvas.shadowOffsetY = 0;
						canvas.fillText(path.label, path._x * this.image.width, path._y * this.image.height);
					}
				} else {
					canvas.stroke();
				}
				
				return canvas;
			},
			"elementVisible": function(element, entity) {
				if(element.template || element.hidden || (element.obscured && !this.player.master)) {
					return false;
				}
				
				if(element.must_know && !this.player.master) {
					
				}
			},
			"localeVisible": function(locale) {
				if(!this.elementVisible(locale)) {
					return false;
				}
			},
			"poiStyling": function(link) {
				if(!link) {
					return "";
				}
				
				var classStyle = "",
					buffer,
					x;
				
				if(this.search_criteria.length) {
					if(!link._search) {
						classStyle += " search-hidden";
					} else {
						buffer = true;
						for(x=0; x<this.search_criteria.length; x++) {
							if(link._search.indexOf(this.search_criteria[x]) === -1) {
								classStyle += " search-hidden";
								buffer = false;
								break;
							}
						}
						if(buffer) {
							classStyle += " search-found";
						}
					}
				}
				
				if(link.no_border) {
					classStyle += " no-border";
				} else {
					classStyle += " map-border";
				}
				
				return classStyle;
			},
			"poiNamed": function(link) {
				if(link.has_path && !link.show_name) {
					return false;
				}
				
				return this.poiVisible(link);
			},
			"poiVisible": function(link) {
				var entity,
					x;
				
				if(link.template || link.x === undefined || link.y === undefined || link.x === null || link.y === null) {
					return false;
				}
				
				//console.log("Link[" + link.id + " | " + link.must_know + "]: " + ( (!this.player.master || this.state.master_view !== "master") && (!this.viewingEntity || !this.viewingEntity.knowsOf(link)) ), " | ", this.viewingEntity.knowsOf(link), "\n > ", this.viewingEntity);
				if(link.must_know && ( (!this.player.master || this.state.master_view !== "master") && (!this.viewingEntity || !this.viewingEntity.knowsOf(link)) )) {
					return false;
				}
				
				if(this.state.poiFiltering && this.search_criteria.length) {
					if(!link._search) {
						return false;
					}
					for(x=0; x<this.search_criteria.length; x++) {
						if(link._search.indexOf(this.search_criteria[x]) === -1) {
							return false;
						}
					}
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
				
				entity = this.universe.nouns.entity[this.player.entity];
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
//				console.log("Trigger View");
				rsSystem.EventBus.$emit("display-info", link);
			},
			"minorUpdate": function() {
				this.$forceUpdate();
			},
			"update": function() {
//				console.warn("Update");
				var buffer,
					x;
				
				if(this.isMaster !== this.player.master) {
					Vue.set(this, "isMaster", this.player.master);
					this.actions.options.splice(0);
					if(this.player.master) {
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
						
						this.actions.options.push({
							"icon": "fas fa-chevron-double-right",
							"event": "set-crosshair",
							"text": "Mark: Red",
							"color": "red"
						});
						this.actions.options.push({
							"icon": "fas fa-chevron-double-right",
							"event": "set-crosshair",
							"text": "Mark: Orange",
							"color": "orange"
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
							"text": "Mark: Yellow",
							"color": "yellow"
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
							"text": "Mark: Purple",
							"color": "purple"
						});
						this.actions.options.push({
							"icon": "fas fa-chevron-double-right",
							"event": "set-crosshair",
							"text": "Mark: Black",
							"color": "black"
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
					}
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
				this.locales.splice(0);
				for(x=0; x<this.universe.indexes.location.listing.length; x++) {
					buffer = this.universe.indexes.location.listing[x];
					if(buffer.location === this.location.id) {
						this.pointsOfInterest.push(buffer);
						buffer.$on("modified", this.minorUpdate);
						if(buffer.has_path) {
							this.locales.push(buffer);
						}
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
//				this.locales.splice(0);
//				for(x=0; x<this.universe.indexes.locale.listing.length; x++) {
//					buffer = this.universe.indexes.locale.listing[x];
//					if(buffer.residence === this.location.id) {
//						this.locales.push(buffer);
//					}
//				}
				
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
				this.redrawPaths();
			}
		},
		"beforeDestroy": function() {
			rsSystem.EventBus.$off("copied-id", this.setMenuID);
			this.universe.$off("universe:modified", this.update);
			this.universe.$off("model:modified", this.update);
			this.location.$off("modified", this.update);
		},
		"template": Vue.templified("components/viewer.html")
	});
})();