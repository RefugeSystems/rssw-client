
/**
 *
 *
 * @class rsswDestinyStatus
 * @constructor
 * @module Components
 */
(function() {
	var token = 0;

	rsSystem.component("rsswTokensDestiny", {
		"inherit": true,
		"mixins": [
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};

			data.destinyTokens = [];
			data.sithTokens = [];
			data.session = null;

			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("model:modified", this.updateFromUniverse);
			this.updateFromUniverse();
		},
		"methods": {
			"updateFromUniverse": function() {
				var buffer;

				buffer = this.universe.indexes.setting.index["setting:current:session"];
				if(buffer) {
					buffer = this.universe.indexes.session.index[buffer.value];
					if(buffer != this.session) {
						if(this.session) {
							this.session.$off("modified", this.updateFromSession);
						}
						Vue.set(this, "session", buffer);
						this.session.$on("modified", this.update);
						this.update();
					}
				}
			},
			"showTokenInfo": function() {
				rsSystem.EventBus.$emit("display-info", "knowledge:token:destiny");
			},
			"update": function() {
				if(this.session) {
					while(this.session.destiny_light > this.destinyTokens.length) {
						this.destinyTokens.push(token++);
					}
					if(this.session.destiny_light < this.destinyTokens.length) {
						this.destinyTokens.splice(this.session.destiny_light);
					}
					while(this.session.destiny_dark > this.sithTokens.length) {
						this.sithTokens.push(token++);
					}
					if(this.session.destiny_dark < this.sithTokens.length) {
						this.sithTokens.splice(this.session.destiny_dark);
					}
				}
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("model:modified", this.updateFromUniverse);
			if(this.session) {
				this.session.$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/rssw/tokens/destiny.html")
	});
})();
