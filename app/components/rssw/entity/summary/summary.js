
/**
 *
 *
 * @class rsswEntitySummary
 * @constructor
 * @module Components
 *
 * @param {Object} selected Maps IDs to a truthy/falsy value to indicate what entities
 * 		should be "flagged" as active. Used here to indicate in the summary if an entity
 * 		is active for visual feedback.
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
			"selected": {
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
			"isActive": function() {
				return this.selected && this.selected[this.entity.id];
			},
			"emitClicked": function() {
				this.$emit("selected", this);
			},
			"receiveRoll": function(event) {
				// console.log("Summary Received Roll[" + this.entity.id + "]: ", event);
			},
			"update": function() {

			}
		},
		"beforeDestroy": function() {
			this.entity.$off("rolled", this.receiveRoll);
			this.entity.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/entity/summary.html")
	});
})();
