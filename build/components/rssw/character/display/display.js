
/**
 * 
 * 
 * @class rsswCharacterRecordDisplay
 * @constructor
 * @module Components
 */
(function() {
	rsSystem.component("rsswCharacterRecordDisplay", {
		"inherit": true,
		"mixins": [
		],
		"props": {
			"record": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			return data;
		},
		"mounted": function() {
			this.record.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"update": function() {
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.record.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/display.html")
	});
})();