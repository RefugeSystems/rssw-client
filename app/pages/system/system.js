
/**
 *
 *
 * @class RSSystem
 * @constructor
 * @module Pages
 */
(function() {
	var getAdrress = new RegExp("/([a-zA-Z0-9.:_-]+)/");

	rsSystem.component("RSSystem", {
		"inherit": true,
		"mixins": [
			rsSystem.components.DataManager
		],
		"props": ["universe", "user"],
		"data": function() {
			var data = {};

			data.player = this.universe.indexes.player.index[this.user.id];
			data.navigator = rsSystem.getBrowserName();
			data.system = rsSystem;
			data.knownErrors = {};

			data.importSelection = false;
			data.importMessageType = "";
			data.importMessage = null;
			data.importIcon = null;
			data.importing = false;
			data.imported = 0;
			data.toImport = 0;

			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("universe:modified", this.update);
			this.universe.$on("model:modified", this.update);
			this.universe.$on("connected", this.update);
			this.universe.$on("error", this.update);
			this.update();
		},
		"methods": {
			"showInfo": function(record) {
				rsSystem.EventBus.$emit("display-info", record);
			},
			"uncachedRefresh": function() {
				// TODO: Align ServiceWorker versioning for cache tracking
				caches.delete("rsswx_0.0.1")
				.then(function() {
					location.reload(true);
				});
			},
			"checkImportSelection": function() {
				var input = $(this.$el).find("#importFileSelection");
				Vue.set(this, "importSelection", input && input.length && input[0].files.length);
			},
			"exportUniverse": function(selected) {
				var appendTo = $(this.$el).find("#anchors")[0],
					anchor = document.createElement("a"),
					exporting,
					index,
					x;

				exporting = {};
				if(selected) {
					index = this.getActiveIndex();
					for(x=0; x<index.selection.length; x++) {
						if(!exporting[index.selected[index.selection[x]]._class]) {
							exporting[index.selected[index.selection[x]]._class] = [];
						}
						exporting[index.selected[index.selection[x]]._class].push(index.selected[index.selection[x]]);
					}
				} else {
					for(x=0; x<rsSystem.listingNouns.length; x++) {
						if(this.universe.indexes[rsSystem.listingNouns[x]] && this.universe.indexes[rsSystem.listingNouns[x]].listing.length) {
							exporting[rsSystem.listingNouns[x]] = this.universe.indexes[rsSystem.listingNouns[x]].listing;
						}
					}
				}

				appendTo.appendChild(anchor);
				anchor.href = URL.createObjectURL(new Blob([JSON.stringify(exporting, null, "\t")]));
				if(selected) {
					anchor.download = "universe_filtered." + Date.now() + ".json";
				} else {
					anchor.download = "universe_complete." + Date.now() + ".json";
				}

				anchor.click();
				URL.revokeObjectURL(anchor.href);
				appendTo.removeChild(anchor);
			},
			"importUniverse": function() {
				if(!this.importing) {
					Vue.set(this, "importMessage", null);
					Vue.set(this, "importing", true);
					var input = $(this.$el).find("#importFileSelection"),
						chain,
						value,
						keys,
						i,
						j;

					if(input && input.length && input[0].files.length) {
						this.readFile(input[0].files[0])
						.then((result) => {
							value = JSON.parse(result.data);
							keys = Object.keys(value);

							j = 0;
							for(i=0; i<keys.length; i++) {
								j += (value[keys[i]]?value[keys[i]].length:0) || 0;
							}
							Vue.set(this, "imported", 0);
							Vue.set(this, "toImport", j);

							keys.forEach((key) => {
								value[key].forEach((record) => {
									record._class = record._class || key;
									record._type = record._type || key;
									if(this.debug || this.universe.debugConnection) {
										console.log("Initiating Import: ", record);
									}
									if(chain) {
										chain = chain.then((msg) => {
											if(this.debug || this.universe.debugConnection) {
												console.log("Imported: ", msg);
											}
											Vue.set(this, "imported", this.imported + 1);
										}).then(() => {
											return this.universe.promisedSend("modify:" + record._class, record);
										});
									} else {
										chain = this.universe.promisedSend("modify:" + record._class, record);
									}
								});
								if(chain) {
									chain.then(() => {
										Vue.set(this, "importing", false);
										Vue.set(this, "importIcon", "fas fa-check rs-light-green");
										Vue.set(this, "importMessage", "Complete: Imported " + this.toImport);
										Vue.set(this, "importMessageType", "Success");
									}).catch((error) => {
										Vue.set(this, "importing", false);
										Vue.set(this, "importIcon", "fas fa-exclamation-triangle rs-light-red");
										Vue.set(this, "importMessage", error.message);
										Vue.set(this, "importMessageType", "Error");
									});
								} else {
									Vue.set(this, "importing", false);
								}
							});
						});
					}
				}
			},
			"makeIssue": function() {
				var buffer = {};
				buffer.id = navigator.userAgent.sha256();
				buffer.name = "Problems: " + this.navigator.name + " " + this.navigator.version;
				buffer.icon = "rs-dark-red fas fa-exclamation-triangle";
				buffer.description = "There are known issues with this browser version";
				buffer._type = "note";
				this.universe.send("modify:note", buffer);
			},
			"getServerAddress": function() {
				return getAdrress.exec(this.universe.connection.address)[1];
			},
			"getDate": function(time) {
				var date = new Date(time);
				return date.toLocaleDateString() + " " + date.toLocaleTimeString();
			},
			"update": function() {
				Vue.set(this.knownErrors, "navigator", this.universe.indexes.note.index[navigator.userAgent.sha256()] || this.universe.indexes.note.index[navigator.userAgent.toLowerCase().sha256()]);
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
			this.universe.$off("model:modified", this.update);
			this.universe.$off("connected", this.update);
			this.universe.$off("error", this.update);
		},
		"template": Vue.templified("pages/system.html")
	});
})();
