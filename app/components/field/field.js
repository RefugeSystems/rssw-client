
/**
 * 
 * 
 * @class rsField
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_fieldComponentKey";
	
	rsSystem.component("rsField", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility
		],
		"props": {
			"root": {
				"required": true,
				"type": Object
			},
			"field": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var x, y, data = {};
			Vue.set(this.field, "type", (this.field.type || "text").toLowerCase());
			if(this.field.unset === undefined) {
				this.field.unset = "Select...";
			}
			data.fid = Random.identifier("field");
			data.reference_value = "";
			
			data.bufferChanging = false;
			data.bufferLoading = false;
			data.bufferTimeout = null;
			data.bufferMark = null;
			data.buffer = this.root[this.field.property];
//			if(this.field.type === "textarea") {
//			} else {
//				data.buffer = "";
//			}
			
			if(this.field.filter) {
				data.filterKeys = Object.keys(this.field.filter);
			}
			
			return data;
		},
		"watch": {
			
		},
		"mounted": function() {
			rsSystem.register(this);
			if(this.field.source_index && this.field.source_index.listing) {
				this.field.source_index.listing.sort(this.sortData);
			}
			this.$watch("root." + this.field.property, function(newValue, oldValue) {
				Vue.set(this, "buffer", newValue);
			});
		},
		"methods": {
			"isVisible": function() {
				if(!this.field.condition) {
					return true;
				}
				
				var keys = Object.keys(this.field.condition),
					test,
					x,
					v;
				
				for(x=0; x<keys.length; x++) {
					switch(this.field.condition[keys[x]].operation) {
						case "<":
							if(this.root[keys[x]] >= this.field.condition[keys[x]].value) {
								return false;
							}
							break;
						case "<=":
							if(this.root[keys[x]] > this.field.condition[keys[x]].value) {
								return false;
							}
							break;
						case ">":
							if(this.root[keys[x]] <= this.field.condition[keys[x]].value) {
								return false;
							}
							break;
						case ">=":
							if(this.root[keys[x]] < this.field.condition[keys[x]].value) {
								return false;
							}
							break;
						case "=":
							if(this.root[keys[x]] != this.field.condition[keys[x]].value) {
								return false;
							}
							break;
						case "exists":
							if(!this.root[keys[x]]) {
								return false;
							}
							break;
						case "!":
							if(this.root[keys[x]]) {
								return false;
							}
							break;
						case "test":
							return !!this.root[keys[x]] === this.field.condition[keys[x]].value;
						case "contains":
							if(this.field.condition[keys[x]].values) {
								for(v=0; v<this.field.condition[keys[x]].values.length; v++) {
									if(this.root[keys[x]].indexOf(this.field.condition[keys[x]].values[v]) === -1) {
										return false;
									}
								}
							} else if(this.field.condition[keys[x]].oneof) {
								test = true;
								for(v=0; test && v<this.field.condition[keys[x]].oneof.length; v++) {
									if(this.root[keys[x]] && this.root[keys[x]].indexOf(this.field.condition[keys[x]].oneof[v]) !== -1) {
										test = false;
									}
								}
								if(test) {
									return false;
								}
							} else {
								if(this.root[keys[x]].indexOf(this.field.condition[keys[x]].value) === -1) {
									return false;
								}
							}
							break;
						default:
							if(this.root[keys[x]] != this.field.condition[keys[x]]) {
								return false;
							}
					}
				}
				
				return true;
			},
			"optionAvailable": function(option) {
				if(this.filterKeys) {
					for(var x=0; x<this.filterKeys.length; x++) {
						if(option[this.filterKeys[x]] != this.field.filter[this.filterKeys[x]]) {
							return false;
						}
					}
				}
				
				return true;
			},
			"dismissReference": function(index, record) {
				this.root[this.field.property].splice(index, 1);
				this.emitChanged();
			},
			"addReference": function(reference) {
				if(!(this.root[this.field.property] instanceof Array)) {
					Vue.set(this.root, this.field.property, []);
				}
				this.root[this.field.property].push(reference);
				Vue.set(this, "reference_value", "");
				this.emitChanged();
			},
			"openReference": function(reference) {
				rsSystem.EventBus.$emit("display-info", reference);
			},
			"blurring": function() {
				this.$emit("blur", this.field);
			},
			"checkField": function() {
				if(!this.root[this.field.property]) {
					return false;
				} else if(this.field.min && (this.root[this.field.property] < this.field.min || this.root[this.field.property].length <this.field.min)) {
					return false;
				} else if(this.field.max && (this.root[this.field.property] >this.field.max || this.root[this.field.property].length >this.field.max)) {
					return false;
				} else if(this.field.validation.pattern && !this.field.validation.pattern.test(this.root[this.field.property])) {
					return false;
				} else if(this.field.validation.method && !this.field.validation.method(this.root[this.field.property])) {
					return false;
				} else {
					return true;
				}
			},
			"bufferChangeProcess": function() {
				if(this.bufferMark < Date.now()) {
					Vue.set(this.root, this.field.property, this.buffer);
					Vue.set(this, "bufferLoading", false);
					this.emitChanged();
				} else {
					if(!this.bufferChanging) {
						Vue.set(this, "bufferChanging", true);
						this.$emit("changing");
					}
					setTimeout(() => {
						this.bufferChangeProcess();
					}, 500);
				}
			},
			"bufferChanged": function() {
				Vue.set(this, "bufferMark", Date.now() + 500);
				Vue.set(this, "bufferLoading", true);
				setTimeout(() => {
					this.bufferChangeProcess();
				}, 500);
				
			},
			"emitChanged": function() {
				this.$emit("changed", {
					"value": this.root[this.field.property],
					"property": this.field.property,
					"time": Date.now()
				});
				
				if(this.field.onchange) {
					this.field.onchange(this.root[this.field.property]);
				}

				Vue.set(this, "bufferChanging", false);
			},
			"set": function(value) {
				Vue.set(this.root, this.field.property, value);
				this.emitChanged();
			},
			"compose": function(row, col) {
				Vue.set(this.tracking[this.r], this.c, false);
				Vue.set(this.tracking[this.r], this.c, false);
				Vue.set(this.tracking[row], col, true);
				Vue.set(this, "r", row);
				Vue.set(this, "c", col);
				return this.field.compose?this.field.compose(row, col):col + ":" + row;
			},
			"separate": function(value) {
				if(value) {
					var apart = value.split(":");
					return {
						"c": apart[0],
						"r": apart[1]
					};
				} else {
					return {};
				}
			},
			"sortData": function(a, b) {
				var aName,
					bName;
				
				if(a.order !== undefined && b.order !== undefined && a.order !== null && b.order !== null) {
					if(a.order < b.order) {
						return -1;
					} else if(a.order > b.order) {
						return 1;
					}
				}
				if((a.order === undefined || a.order === null) && b.order !== undefined && b.order !== null) {
					return -1;
				}
				if((b.order === undefined || b.order === null) && a.order !== undefined && a.order !== null) {
					return 1;
				}

				if(a.name !== undefined && b.name !== undefined && a.name !== null && b.name !== null) {
					aName = a.name.toLowerCase();
					bName = b.name.toLowerCase();
					if(aName < bName) {
						return -1;
					} else if(aName > bName) {
						return 1;
					}
				}
				if((a.name === undefined || a.name === null) && b.name !== undefined && b.name !== null) {
					return -1;
				}
				if((b.name === undefined || b.name === null) && a.name !== undefined && a.name !== null) {
					return 1;
				}

				if(a.id < b.id) {
					return -1;
				} else if(a.id > b.id) {
					return 1;
				}
				
				return 0;
			}
		},
		"template": Vue.templified("components/field.html")
	});
})();
