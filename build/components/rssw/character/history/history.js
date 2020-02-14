
/**
 * 
 * 
 * @class rsswEntityHistory
 * @constructor
 * @module Components
 */
(function() {

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
			"update": function() {
				var buffer,
					x;
				
				if(this.entity.history && this.entity.history.length !== this.history.length) {
					this.history.splice(0);
					for(x=0; x<this.entity.history.length && x < 50; x++) {
						this.entity.history[x]._date = new Date(this.entity.history[x].time);
						this.entity.history[x]._dateString = this.entity.history[x]._date.toLocaleDateString();
						this.entity.history[x]._timeString = this.entity.history[x]._date.toLocaleTimeString();
						if(this.entity.history[x].type === "record_acquired_or_loss") {
							this.getRelated(this.entity.history[x]);
						}
						this.history.push(this.entity.history[x]);
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