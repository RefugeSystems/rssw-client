
/**
 * 
 * 
 * @class rsswCareerRecordDisplay
 * @constructor
 * @module Components
 */
(function() {
	rsSystem.component("rsswCareerRecordDisplay", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSShowdown
		],
		"props": {
			"record": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.holdDescription = null;
			data.description = null;
			
			return data;
		},
		"mounted": function() {
			if(this.record && this.record.$on) {
				this.record.$on("modified", this.update);
			}
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"update": function() {
				if(this.record.description) {
					if(this.holdDescription !== this.record.description) {
						Vue.set(this, "holdDescription", this.record.description);
						Vue.set(this, "description", this.rsshowdown(this.holdDescription));
					}
				} else {
					Vue.set(this, "holdDescription", null);
					Vue.set(this, "description", null);
				}
				
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			if(this.record && this.record.$off) {
				this.record.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/rssw/career/display.html")
	});
})();