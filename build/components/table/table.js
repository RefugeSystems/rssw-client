
/**
 * 
 * 
 * @class rsTable
 * @constructor
 * @module Components
 * @zindex 1
 */
(function() {
	var storageKey = "_rs_menuComponentKey";
	
	rsSystem.component("rsTable", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCore
		],
		"props": {
			"index": {
				"required": true,
				"type": Object
			},
			"headers": {
				"required": true,
				"type": Array
			},
			"controls": {
				"required": false,
				"type": Array
			},
			"state": {
				"required": true,
				"type": Object
			}
		},
		"watch": {
			"index": function(newIndex, oldIndex) {
				console.warn("Index Updated: ", oldIndex, "\n -> \n", newIndex);
				oldIndex.$off("indexed", this.update);
				newIndex.$on("indexed", this.update);
			}
		},
		"data": function() {
			var data = {},
				x;

			data.corpus = [];
			data.start = 0;
			
			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.index.$on("indexed", this.update);
			this.update();
		},
		"methods": {
			"headerAction": function(header) {
				if(typeof header.action === "function") {
					header.action(header);
				} else if(header.action === null) {
					/* No Action */
				} else {
					if(this.state.sortKey === header.field) {
						Vue.set(this.state, "ordering", !this.state.ordering);
					} else {
						Vue.set(this.state, "sortKey", header.field);
						if(header.sorter) {
							Vue.set(this.state, "sorter", header.sorter);
						} else {
							Vue.delete(this.state, "sorter");
						}
					}
				}
			},
			"isArray": function(item) {
				return (item instanceof Array) || (item && item.constructor && item.constructor.name.toLowerCase().indexOf("array") !== -1);
			},
			"formatObjectHeader": function(object) {
				var x, keys, html;
				keys = Object.keys(object);
				html = "<ul>";
				for(x=0; x<keys.length; x++) {
					html += "<li><span class='property'>" + keys[x] + "</span>: <span class='value'>" + object[keys[x]] + "</span></li>"; 
				}
				html += "<ul>";
			},
			"select": function(record, header) {
				if(!this.state.noSelect) {
					if(this.index.toggleSelect(record)) {
						if(!this.state.noEmit) {
							this.$emit("selected", record, header);
						}
					} else {
						if(!this.state.noEmit) {
							this.$emit("unselected", record, header);
						}
					}
					this.$forceUpdate();
				} else if(!this.state.noEmit) {
					this.$emit("selected", record, header);
					this.$forceUpdate();
				} else {
					// Selection is suppressed
				}
			},
			"update": function() {
				this.corpus.splice(0);
				this.index.list(this.state.search, this.state.ordering, this.state.limit, this.state, this.corpus);
				console.warn("Search: " + JSON.stringify(this.state, null, 4), this.corpus);
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
			this.index.$off("indexed", this.update);
		},
		"template": Vue.templified("components/table.html")
	});
})();
