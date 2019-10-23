
/**
 * 
 * 
 * @class systemInfo
 * @constructor
 * @module Components
 * @zindex 20
 */
(function() {
	var storageKey = "_rs_infoComponentKey";
	
	rsSystem.component("systemInfo", {
		"inherit": true,
		"mixins": [
			
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"user": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			/**
			 * 
			 * @property viewing
			 * @type RSObject
			 */
			data.viewing = null;
			/**
			 * 
			 * @property open
			 * @type Boolean
			 */
			data.open = false;
			
			return data;
		},
		"watch": {
		},
		"mounted": function() {
//			rsSystem.EventBus.$on("display-info", (object) => {
//				this.displayRecord(object);
//			});
			rsSystem.EventBus.$on("display-info", this.displayRecord);
			rsSystem.register(this);
		},
		"methods": {
			/**
			 * 
			 * @method displayRecord
			 * @param {RSObject | Object | String} toView Something to identify the RSObject to view or the object itself.
			 */
			"displayRecord": function(toView) {
				if(toView && !(toView instanceof RSObject)) {
					if(typeof(toView) === "string") {
						toView = this.universe.index.index[toView];
					} else {
						toView = this.universe.index.index[toView.id] || this.universe.index.index[toView.name];
					}
				}
				
				if(toView) {
					if(this.viewing) {
						this.viewing.$off("modified", this.update);
					}
					
					Vue.set(this, "viewing", toView);
					Vue.set(this, "open", true);
					
					this.viewing.$on("modified", this.update);
				}
			},
			
			"processRequest": function(event) {
				
			},
			/**
			 * 
			 * @method closeInfo
			 */
			"closeInfo": function() {
				Vue.set(this, "open", false);
			},
			/**
			 * 
			 * @method update
			 */
			"update": function() {
				this.$forceUpdate();
			}
		},
		"template": Vue.templified("components/info.html")
	});
})();
