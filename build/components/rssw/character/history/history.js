
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
			"wounds": function(nV, oV) {
				this.character.commit({
					"wounds": nV
				});
			},
			"strain": function(nV, oV) {
				this.character.commit({
					"strain": nV
				});
			}
		},
		"methods": {
			"showInfo": function(view) {
				rsSystem.EventBus.$emit("display-info", {
					"source": this.entity,
					"record": view
				});
			},
			"setStat": function() {
				
			},
			"filter": function(text) {
				
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