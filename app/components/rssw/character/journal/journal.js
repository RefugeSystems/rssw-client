
/**
 * 
 * 
 * @class rsswEntityJournal
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_journalComponentKey";
	
	var sortName = function(a, b) {
		if(a.name && !b.name) {
			return -1;
		} else if(!a.name && b.name) {
			return 1;
		} else if(a.name < b.name) {
			return -1;
		} else if(a.name > b.name) {
			return 1;
		} else {
			return 0;
		}
	};
	
	rsSystem.component("rsswEntityJournal", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSShowdown,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.storageKeyID = storageKey + this.entity.id;
	
			data.mdDescription = null;
			data.description = "";
			data.state = this.loadStorage(data.storageKeyID, {
				"viewing": false
			});
			
			if(!data.state.control_blocks) {
				data.state.control_blocks = {};
			}
			if(isNaN(data.state.open_blocks)) {
				data.state.open_blocks = 0;
			}
			
			if(!data.state.entry) {
				data.state.entry = {};
			}
			if(!data.state.entry.related) {
				data.state.entry.related = [];
			}
			if(!data.state.entry.id) {
				data.state.entry.id = "journal:" + this.entity.id + ":" + Date.now();
			}
			if(!data.state.entry.editor) {
				data.state.entry.editor = this.entity.id;
			}
			
			data.state.entry.session = this.universe.indexes.setting.index["setting:current:session"];
			if(data.state.entry.session) {
				data.state.entry.session = data.state.entry.session.value;
			} else {
				data.state.entry.session = this.universe.indexes.session.listing[this.universe.indexes.session.listing.length - 1];
				if(data.state.entry.session) {
					data.state.entry.session = data.state.entry.session.id;
				}
			}
			data.editingMask = "";
			data.editing = null;
			data.addKnown = "";
			 
			data.sessions = [];
			data.entries = [];
			data.knowns = [];
			
			data.rendering = "";
			data.entry = {};
			
			data.titleField = {
				"label": "Title",
				"property": "name",
				"type": "text"
			};
			
			data.sessionField = {
				"label": "Sessions",
				"property": "session",
				"type": "select",
				"unset": "No Session",
				"persistUnset": true,
				"options": data.sessions,
				"optionLabel": "name",
				"optionValue": "id"
			};
			
			data.entryField = {
				"label": "Journal Entry",
				"property": "description",
				"type": "textarea"
			};

			data.sessionField.options.sortBy("id");
			data.syncTimeout = null;
			data.syncLock = false;
			
			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
		
			
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value]) && this.isOwner(follow)) {
					rsSystem.EventBus.$emit("display-info", follow);
				}
			};

			this.universe.$on("setting:current:session", this.updateSession);
			this.universe.$on("universe:modified", this.update);
			this.entity.$on("modified", this.update);
			this.update();
		},
		"methods": {
			"addKnownEntry": function(known) {
				Vue.set(this, "addKnown", "");
				this.toggleRelated(known);
			},
			"getRecordName": function(id) {
				if(!this.universe.index.index[id] || (this.universe.index.index[id].must_know && !this.entity.knowsOf(this.universe.index.index[id]))) {
					return "Unknown";
				}
				
				return this.universe.index.index[id].name;
			},
			/**
			 * Used to control padding with a control block open.
			 * 
			 * Classing and transition should keep this smooth.
			 * @method editorClass
			 */
			"editorClass": function() {
				var classes = "tier-" + this.state.open_blocks;
				
				if(this.state.open_blocks > 0) {
					classes += " tier-one";
				}
				
				return classes;
			},
			"blockClass": function(block) {
				var classes = "";
				
				if(this.state.control_blocks[block]) {
					classes += " open-block";
				}
				
				return classes;
			},
			"toggleBlock": function(block) {
				Vue.set(this.state.control_blocks, block, !this.state.control_blocks[block]);
				if(this.state.control_blocks[block]) {
					Vue.set(this.state, "open_blocks", this.state.open_blocks + 1);
				} else {
					Vue.set(this.state, "open_blocks", this.state.open_blocks - 1);
				}
			},
			"toggleRelated": function(known) {
				if(known) {
					known = known.id || known;
					var index = this.state.entry.related.indexOf(known);
					if(index === -1) {
						this.state.entry.related.push(known);
					} else {
						this.state.entry.related.splice(index, 1);
					}
				}
				this.sync();
			},
			"newEntry": function() {
				if(this.syncLock) {
					return null;
				}
				
				var buffer,
					x;
				
				buffer = Object.keys(this.state.entry);
				for(x=0; x<buffer.length; x++) {
					if(this.state.entry[buffer[x]] instanceof Array) {
						this.state.entry[buffer[x]].splice(0);
					} else {
						Vue.delete(this.state.entry, buffer[x]);
					}
				}
				
				Vue.set(this.state.entry, "id", "journal:" + this.entity.id + ":" + Date.now());
				Vue.set(this.state.entry, "editor", this.entity.id);
				Vue.set(this.state.entry, "name", "");
				
				buffer = this.universe.indexes.setting.index["setting:current:session"];
				if(buffer && buffer.value) {
					Vue.set(this.state.entry, "session", buffer.value);
				} else {
					buffer = this.universe.indexes.session.listing[this.universe.indexes.session.listing.length - 1];
					if(buffer) {
						Vue.set(this.state.entry, "session", buffer.id);
					}
				}
			},
			"editEntry": function(entry) {
				if(this.syncLock) {
					return null;
				}
				
				var keys = Object.keys(entry),
					x;

				Vue.set(this.state.entry, "description", entry.description);
				Vue.set(this.state.entry, "name", entry.name);
				for(x=0; x<keys.length; x++) {
					if(keys[x][0] !== "_" && keys[x] !== "universe") {
						console.log("Set[" + keys[x] + "]: ", entry[keys[x]], entry);
						Vue.set(this.state.entry, keys[x], entry[keys[x]]);
					}
				}
			},
			"sync": function() {
				if(!this.syncLock) {
					Vue.set(this, "syncLock", true);
				}
				if(this.syncTimeout) {
					clearTimeout(this.syncTimeout);
				}
				Vue.set(this, "syncTimeout", setTimeout(() => {
					this.commitSync();
				}, 500));
			},
			"syncWait": function() {
				if(!this.syncLock) {
					Vue.set(this, "syncLock", true);
				}
			},
			"commitSync": function() {
				if(this.state.entry.id) {
					var keys = Object.keys(this.state.entry),
						data = {},
						x;
	
					data.updated = Date.now();
					data._type = "journal";
					for(x=0; x<keys.length; x++) {
						if(keys[x][0] !== "_" && keys[x] !== "universe") {
							data[keys[x]] = this.state.entry[keys[x]];
						}
					}
					
					this.universe.send("update:journal", data);
				}
				
				Vue.set(this, "syncTimeout", null);
				Vue.set(this, "syncLock", false);
			},
			"getEntryClass": function(entry) {
				if(entry && this.state.entry.id === entry.id) {
					return "selected";
				} else if(!entry && !this.universe.indexes.journal.index[this.state.entry.id]) {
					return "selected";
				} else {
					return "unselected";
				}
			},
			"getKnownClass": function(known) {
				if(this.state.entry.related.indexOf(known.id) === -1) {
					return "unselected";
				} else {
					return "selected";
				}
			},
			"updateSession": function(session) {
				if(!this.universe.indexes.session.index[this.state.entry.id]) {
					Vue.set(this.state.entry, "session", session);
				}
			},
			"update": function() {
				var buffer,
					x;
				
				this.entries.splice(0);
				for(x=0; x<this.universe.indexes.journal.listing.length; x++) {
					buffer = this.universe.indexes.journal.listing[x];
					if(buffer && buffer.editor && buffer.editor === this.entity.id) {
						this.entries.push(buffer);
					}
				}
				this.entries.sort(this.sortData);
				
				this.knowns.splice(0);
				for(x=0; x<this.entity._knownKeys.length; x++) {
					buffer = this.universe.index.index[this.entity._knownKeys[x]];
					if(buffer && !buffer.obscured) {
						this.knowns.push(buffer);
					}
				}
				this.knowns.sort(sortName);
				
				
				this.sessions.splice(0);
				for(x=0; x<this.universe.indexes.session.listing.length; x++) {
					buffer = this.universe.indexes.session.listing[x];
					if(buffer && !buffer.obscured && !buffer.hidden) {
						this.sessions.push(buffer);
					}
				}
				this.sessions.sortBy("id");

//				this.sessionField.options.sortBy("id");
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("setting:current:session", this.updateSession);
			this.universe.$off("universe:modified", this.update);
			this.entity.$off("modified", this.update);
			if(this.entry && this.entry.$off) {
				this.entry.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/rssw/character/journal.html")
	});
})();