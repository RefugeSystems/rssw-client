
/**
 *
 *
 * @class rsswEntityKnowledge
 * @constructor
 * @module Components
 */
(function() {

	var controls = {
		"formatter": {
			"icon": function(icon) {
				return "<span class='" + icon + "'></span>";
			},
			"info": function(icon) {
				return "<span class=\"fas fa-info-circle\"></span>";
			}
		},
		"sorter": {
			"acquired": function(a, b) {
				console.log("Sort Acquired: ", a, b);
			}
		},
		"recordAction": {
			"info": function(record) {
				rsSystem.EventBus.$emit("display-info", record);
			}
		}
	};

	rsSystem.component("rsswEntityKnowledge", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": Object
			},
			"state": {
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.knowledge = new SearchIndex();
			data.corpus = [];

			Vue.set(this.state, "noSelect", true);
			if(this.state && !this.state.filter) {
				Vue.set(this.state, "filter", {});
			}
			if(this.state && !this.state.paging) {
				Vue.set(this.state, "paging", {});
			}
			if(!this.state.paging.per) {
				Vue.set(this.state.paging, "per", 20);
			}
			if(!this.state.paging.current) {
				Vue.set(this.state.paging, "current", 0);
			}
			if(this.state && !this.state.headers) {
				this.resetHeaders();
			} else {
				this.rebindHeaders();
			}

			return data;
		},
		"mounted": function() {
			this.entity.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"resetHeaders": function() {
				if(!this.state.headers) {
					Vue.set(this.state, "headers", []);
				}
				this.state.headers.splice(0);
				this.state.headers.push({
					"title": "",
					"field": "icon"
				});
				this.state.headers.push({
					"title": "Name",
					"field": "name"
				});
				this.state.headers.push({
					"title": "Acquired",
					"field": "time"
				});
				this.state.headers.push({
					"title": "Relations",
					"field": "related"
				});
				this.state.headers.push({
					"title": "Status",
					"field": "status"
				});
				this.state.headers.push({
					"title": "",
					"field": "info",
					"hideBlock": true,
					"nosort": true
				});
				this.rebindHeaders();
			},
			"rebindHeaders": function() {
				var keys,
					x,
					c;

				keys = Object.keys(controls);
				for(x=0; x<this.state.headers.length; x++) {
					for(c=0; c<keys.length; c++) {
						if(controls[keys[c]]) {
							if(controls[keys[c]][this.state.headers[x].field]) {
								Vue.set(this.state.headers[x], keys[c], controls[keys[c]][this.state.headers[x].field]);
							} else {
//								console.log(" ! " + this.state.headers[x].field + " @ "+ keys[c]);
								Vue.delete(this.state.headers[x], keys[c]);
							}
						}
					}

					switch(this.state.headers[x].field) {
						case "time":
							this.state.headers[x].formatter = (empty, record) => {
								if(!this.entity.learned) {
									return "";
								}
								var date = this.entity.learned[record.id];
								if(date) {
									date = new Date(date);
									date = date.toLocaleDateString();
								} else {
									date = "[Unknown]";
								}
								return "<span><span class=\"fas fa-calendar\"><span> " + date + "</span>";
							};
							this.state.headers[x].sorter = (a, b) => {
								if(!this.entity.learned) {
									return 0;
								}
								a = this.entity.learned[a.id] || 0;
								b = this.entity.learned[b.id] || 0;

								if(a < b) {
									return -1;
								} else if(a > b) {
									return 1;
								} else {
									return 0;
								}
							};
							break;
						case "status":
							this.state.headers[x].formatter = (empty, record) => {
								if(!this.entity.related_status) {
									return "";
								}
								var status = this.entity.related_status[record.id];
								switch(status) {
									case "active":
										status = "fas fa-brain";
										break;
									case "complete":
										status = "fas fa-check";
										break;
									case "ignored":
										status = "fas fa-times";
										break;
									case "favorited":
										status = "fas fa-star";
										break;
									case "investigate":
										status = "far fa-search-location";
										break;
									case "working":
										status = "far fa-users-cog";
										break;
									case "learning":
										status = "fad fa-book-reader";
										break;
									default:
										status = "";
								}
								return "<span class=\"" + status + "\"><span>";
							};
							this.state.headers[x].sorter = (a, b) => {
								if(!this.entity.related_status) {
									return 0;
								}
								a = this.entity.related_status[a.id] || "";
								b = this.entity.related_status[b.id] || "";

								if(a < b) {
									return -1;
								} else if(a > b) {
									return 1;
								} else {
									return 0;
								}
							};
							break;
						case "related":
							this.state.headers[x].formatter = (empty, record) => {
								var count = 0;

								if(record.related) {
									count += record.related.length;
								}

								if(!this.entity.related_mapping) {
									return count;
								}

								if(this.entity.related_mapping[record.id]) {
									count += this.entity.related_mapping[record.id].length;
								}
								return count;
							};
							this.state.headers[x].sorter = (a, b) => {
								var ca = 0,
									cb = 0;

								if(a.related) {
									ca += a.related.length;
								}
								if(b.related) {
									cb += b.related.length;
								}

								if(this.entity.related_mapping) {
									if(this.entity.related_mapping[a.id]) {
										ca += this.entity.related_mapping[a.id].length;
									}
									if(this.entity.related_mapping[b.id]) {
										cb += this.entity.related_mapping[b.id].length;
									}
								}

								if(ca < cb) {
									return -1;
								} else if(ca > cb) {
									return 1;
								} else {
									return 0;
								}
							};
							break;
					}
				}
			},
			"processAction": function(command) {

			},
			"update": function() {
				var buffer,
					x;

				//TODO: Clean solution for forgetting data while open?
				if(this.entity.knowledge && this.knowledge.listing.length !== this.entity.knowledge.length) {
					for(x=0; x<this.entity.knowledge.length; x++) {
						if(!this.knowledge.index[this.entity.knowledge] && (buffer = this.universe.indexes.knowledge.lookup[this.entity.knowledge[x]])) {
							this.knowledge.indexItem(buffer);
						}
					}
					this.$forceUpdate();
				}
			}
		},
		"beforeDestroy": function() {
			this.entity.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/entity/knowledge.html")
	});
})();
