
/**
 * 
 * 
 * @class rsswEntitySummary
 * @constructor
 * @module Components
 */
(function() {
	
	rsSystem.component("rsswEntitySummary", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": Object
			},
			"viewing": {
				"type": RSObject
			}
		},
		"data": function() {
			var data = {};
			
			return data;
		},
		"mounted": function() {
			this.entity.$on("rolled", this.receiveRoll);
			this.entity.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"emitClicked": function() {
				this.$emit("selected", this);
			},
			"receiveRoll": function(event) {
				console.log("Summary Received Roll[" + this.entity.id + "]: ", event);
			},
			"update": function() {

			}
		},
		"beforeDestroy": function() {
			console.log("Summary  Disengaging...");
			this.entity.$off("rolled", this.receiveRoll);
			this.entity.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/entity/summary.html")
	});
})();