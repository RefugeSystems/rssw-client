
/**
 *
 *
 * @class rsswShipManeuver
 * @constructor
 * @module Components
 */
(function() {

	var idleManeuver = {};
	idleManeuver.icon = "fas fa-rocket-launch rot315";
	idleManeuver.speed = "x";

	var byOrder = function(a, b) {
		a = a?a.order:0;
		b = b?b.order:0;
		if(a < b) {
			return -1;
		} else if(a > b) {
			return 1;
		} else {
			return 0;
		}
	};

	rsSystem.component("rsswShipManeuver", {
		"inherit": true,
		"mixins": [
			// rsSystem.components.RSComponentUtility,
			// rsSystem.components.RSCore
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"entity": {
				"required": true,
				"type": Object
			},
			"maneuverIcon": {
				"default": "fas fa-angle-double-up",
				"type": String
			},
			"display": {
				"default": false,
				"type": Boolean
			}
		},
		"watch": {
			"entity": function() {
				this.update();
			}
		},
		"data": function() {
			var data = {};

			data.locked = idleManeuver;
			data.maneuvers = [];
			data.open = false;

			data.halfSlice = 0;
			data.slice = 0;

			return data;
		},
		"mounted": function() {
			this.universe.$on("game:round:start", this.reset);
			this.entity.$on("modified", this.update);
			rsSystem.register(this);
			this.update();
		},
		"methods": {
			"toggleOpen": function() {
				Vue.set(this, "open", !this.open);
			},
			"selectManeuver": function(maneuver) {
				if(!this.display) {
					Vue.set(this, "locked", maneuver);
					Vue.set(this, "open", false);
				}
			},
			"getSpeedValue": function(maneuver) {
				if(maneuver == idleManeuver) {
					return "X";
				}

				if(!maneuver.speed) {
					return 0;
				}

				return maneuver.speed + (this.entity.bonus_ship_speed || 0);
			},
			"maneuverStyleBackdrop": function() {
				if(this.open) {
					return "width: 100%; height: " + this.$el.offsetWidth + "px; right: 0px";
				} else {
					return "";
				}
			},
			"maneuverStyleContainer": function(index, maneuver) {
				if(this.open) {
					return "transform: rotate(" + (this.slice * index + 90) + "deg); width: 50%; overflow: visible;";
				} else {
					return "";
				}
			},
			"maneuverStyleSpeed": function(index, maneuver) {
				if(this.open) {
					return "transform: rotate(" + (this.slice * index + 90) + "deg); width: 40%; overflow: visible;";
				} else {
					return "";
				}
			},
			"maneuverStyleIcon": function(index, maneuver) {
				return "transform: rotate(-" + (this.slice * index + 90) + "deg);";
			},
			"reset": function() {
				Vue.set(this, "locked", idleManeuver);
			},
			"update": function() {
				var buffer,
					x;

				this.maneuvers.splice(0);
				if(this.entity.maneuver) {
					for(x=0; x<this.entity.maneuver.length; x++) {
						buffer = this.universe.indexes.maneuver.index[this.entity.maneuver[x]];
						if(buffer) {
							this.maneuvers.push(buffer);
						}
					}
					Vue.set(this, "slice", 360/this.maneuvers.length);
					Vue.set(this, "halfSlice", this.slice/2);
					this.maneuvers.sort(byOrder);
				}
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("game:round:start", this.reset);
			this.entity.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/ship/maneuver.html")
	});
})();
