
/**
 * 
 * 
 * @class rsswEntityHistory
 * @constructor
 * @module Components
 */
(function() {
	var controls = {
		"formatter": {
			"icon": function(icon, record) {
				return "<span class='" + icon + "'></span>";
			},
			"time": function(icon, record) {
				return "<span><span class=\"fas fa-calendar\"><span> " + record._dateString + "</span>";
			}
		}
	};

	rsSystem.component("rsswEntityHistory", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
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
			data.maxHistory = 300;
			data.last = 0;

			data.index = new SearchIndex();
			data.ids = 1;
			
			data.history = [];
			data.named = {
				"xp": "experience"
			};
			
			return data;
		},
		"mounted": function() {
			this.entity.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"watch": {

		},
		"methods": {
			"setStat": function() {
				
			},
			"filter": function(text) {
				
			},
			"getRelated": function(entry) {
				var records,
					x;
				
				if(!entry || !entry.difference) {
					return false;
				}

				Vue.set(entry, "report", {
					"gained": [],
					"loss": []
				});
				
				records = Object.keys(entry.difference);
				if(records.length === 0) {
					return false;
				}
				
				for(x=0; x<records.length; x++) {
					if(entry.difference[records[x]] > 0) {
						entry.report.gained.push(this.universe.index.lookup[records[x]]);
					} else {
						entry.report.loss.push(this.universe.index.lookup[records[x]]);
					}
				}
				
				return true;
			},
			"copyRecord": function(record) {
				return Object.assign({}, record);
			},
			"getPrevious": function(entry) {
				if(this.universe.indexes[entry.modified]) {
					return this.universe.indexes[entry.modified].index[entry.previous];
				}
			},
			"getCurrent": function(entry) {
				if(this.universe.indexes[entry.modified]) {
					return this.universe.indexes[entry.modified].index[entry.current];
				}
			},
			"getGeneral": function(id, type) {
				if(type) {
					return this.universe.indexes[type].index[id];
				} else {
					return this.universe.index.index[id];
				}
			},
			"update": function() {
				var max = 0,
					buffer,
					x;
				
				if(this.entity.history) {
					for(x=0; x<this.entity.history.length && x < 50; x++) {
						if(this.last < this.entity.history[x].time) {
							buffer = this.copyRecord(this.entity.history[x]);
							if(max < buffer.time) {
								max = buffer.time;
							}
							
							buffer.id = this.ids++;
							buffer._date = new Date(buffer.time);
							buffer._dateString = buffer._date.toLocaleDateString();
							buffer._timeString = buffer._date.toLocaleTimeString();
							buffer._search = buffer._dateString;
							switch(buffer.type) {
								case "record_acquired_or_loss":
									buffer.icon = "fas fa-sort-circle";
									this.getRelated(buffer);
									break;
								default:
									buffer.icon = "fas fa-history";
							}
							
							this.index.indexItem(buffer);
							if(this.last) {
								this.history.unshift(buffer);
							} else {
								this.history.push(buffer);
							}
						}
					}
					if(max) {
						Vue.set(this, "last", max);
					}
					if(this.history.length > this.maxHistory) {
						this.history.splice(this.maxHistory);
					}
				}
			}
		},
		"beforeDestroy": function() {
			this.entity.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/history.html")
	});
})();